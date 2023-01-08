import * as amqplib from "amqplib";
import EventEmitter from "events";
import { Context } from "../context";
import { Awaitable, ClientEvents, EventHeaders, GameEvent } from "../types";
import logger from "../utils/logger";

const emitter = new EventEmitter();
type CommandFunction = () => Promise<void>;
const commands: CommandFunction[] = [];

export async function setupRelay(context: Context) {
  const { playerQueue } = context.player;
  if (playerQueue === undefined) {
    throw Error("Player Queue is undefined");
  }

  const { rabbitMQ } = context.net;
  const conn = await amqplib.connect(
    `amqp://${rabbitMQ.user}:${rabbitMQ.password}@${rabbitMQ.host}:${rabbitMQ.port}`
  );

  const channel = await conn.createChannel();
  await channel.assertQueue(playerQueue);

  channel.consume(playerQueue, async (msg) => {
    if (msg !== null) {
      const event = JSON.parse(msg.content.toString());
      const headers: EventHeaders = Object.entries(msg.properties.headers)
        .map(([key, value]) => ({ key, value: value.toString() }))
        .reduce(
          (acc, { key, value }) => ({ ...acc, [key]: value }),
          {}
        ) as EventHeaders;

      logger.debug({
        headers,
        event,
      });

      emit(headers.type, {
        headers,
        payload: event,
      });

      channel.ack(msg);
    } else {
      logger.info("Consumer cancelled by server");
    }
  });
}

export function on<K extends keyof ClientEvents>(
  eventName: K,
  fn: (event: GameEvent<ClientEvents[K]>) => Awaitable<void>
) {
  emitter.on(eventName, fn);
}

export function off<K extends keyof ClientEvents>(
  eventName: K,
  fn: (event: GameEvent<ClientEvents[K]>) => Awaitable<void>
) {
  emitter.off(eventName, fn);
}

export function enqueue(fn: CommandFunction) {
  commands.push(fn);
}

function emit<K extends keyof ClientEvents>(
  eventName: K,
  event: GameEvent<ClientEvents[K]>
) {
  emitter.emit(eventName, event);
}

// We need to queue the command cleanup as the last action to do on round end. Probably it would make more sense to implement priorities
// into the relay. For now just call this method at the end of index.ts to make life easier for now. But I think I need to do something
// like this in the future anyway.
export function setupCommandCleanup() {
  // Let's just dispatch all commands once the round has been started. We might need to tweak that later but I think it is okay as we're just
  // one round behind using that tactic
  on("round-status", async (event) => {
    const status = event.payload.roundStatus;
    if (status !== "started") return;

    const commandsToSend = commands.map((fn) => fn());
    const result = await Promise.allSettled(commandsToSend);
    const rejected = result.filter(
      (r) => r.status === "rejected"
    ) as PromiseRejectedResult[];
    const fulfilled = result.filter(
      (r) => r.status === "fulfilled"
    ) as PromiseFulfilledResult<void>[];

    logger.info(
      `Sent ${commandsToSend.length} commands (${rejected.length} rejected / ${fulfilled.length} fulfilled)`
    );

    rejected.forEach((promise) => {
      logger.error(`Failed because: ${promise.reason}`);
    });

    const deletedCommands = commands.splice(0, commands.length);
    logger.debug(`Deleted ${deletedCommands} commands`);
  });
}

// on("round-status", (event) => {
//   const status = event.payload.roundStatus;
//   if (status !== "ended") return;

//   commands.splice(0, commands.length);
// });
