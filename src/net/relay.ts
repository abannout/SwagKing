import EventEmitter from "events";
import { Awaitable, ClientEvents, EventHeaders, EventType, GameEvent } from "../types";
import { Context } from "../context";
import * as amqplib from "amqplib";
import logger from "../utils/logger";
import { stat } from "fs";

const emitter = new EventEmitter();
type CommandFunction = () => Promise<void>;
const robotCommands: Record<string, CommandFunction> = {};
const robotlessCommands: CommandFunction[] = [];

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
        .reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}) as any;

      logger.debug({
        headers,
        event,
      });

      emit(headers.type, {
        headers,
        payload: event
      });

      channel.ack(msg);
    } else {
      logger.info("Consumer cancelled by server");
    }
  });
}

export function on<K extends keyof ClientEvents>(eventName: K, fn: (event: GameEvent<ClientEvents[K]>) => Awaitable<void>) {
  emitter.on(eventName, fn);
}

export function off<K extends keyof ClientEvents>(eventName: K, fn: (event: GameEvent<ClientEvents[K]>) => Awaitable<void>) {
  emitter.off(eventName, fn);
}

export function enqueue(robotId: string | null, fn: CommandFunction) {
  if (robotId !== null) {
    robotCommands[robotId] = fn;
  }
  else {
    robotlessCommands.push(fn);
  }
}

function emit<K extends keyof ClientEvents>(eventName: K, event: GameEvent<ClientEvents[K]>) {
  emitter.emit(eventName, event);
}

// Let's just dispatch all commands once the round has been started. We might need to tweak that later but I think it is okay as we're just
// one round behind using that tactic
on("round-status", async (event) => {
  const status = event.payload.roundStatus;
  if (status !== "started") return;

  const commandsToSend = [...robotlessCommands, ...Object.values(robotCommands)];
  const result = await Promise.allSettled(commandsToSend.map(fn => fn()));
  const rejected = result.filter(r => r.status === "rejected") as PromiseRejectedResult[];
  const fulfilled = result.filter(r => r.status === "fulfilled") as PromiseFulfilledResult<void>[];

  logger.info(`Sent ${commandsToSend.length} commands (${rejected.length} rejected / ${fulfilled.length} fulfilled)`);

  rejected.forEach(promise => {
    logger.debug("Failed because: ", promise.reason)
  })

  for (const key of Object.keys(robotCommands)) {
    delete robotCommands[key];
  }
  robotlessCommands.splice(0, robotlessCommands.length);
});