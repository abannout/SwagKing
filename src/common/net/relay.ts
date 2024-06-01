import * as amqplib from "amqplib";
import EventEmitter from "events";
import { config } from "../../config.js";
import { Awaitable, ClientEvents, EventHeaders, GameEvent } from "../types.js";
import logger from "../../utils/logger.js";

const emitter = new EventEmitter();

export type RelayContext = {
  playerId: string;
  playerExchange: string;
};

export async function setupRelay(context: RelayContext) {
  const { rabbitMQ } = config.net;
  const conn = await amqplib.connect({
    protocol: "amqp",
    hostname: rabbitMQ.host,
    port: rabbitMQ.port,
    username: rabbitMQ.user,
    password: rabbitMQ.password,
  });

  conn.on("error", function (err) {
    if (err.message !== "Connection closing") {
      console.error("[AMQP] conn error", err.message);
    }
  });

  conn.on("close", function () {
    console.error("[AMQP] reconnecting");
    setupRelay(context);
  });

  const channel = await conn.createChannel();
  const playerQueue = `player-${context.playerId}-all`;
  await channel.assertQueue(playerQueue);
  channel.bindQueue(playerQueue, context.playerExchange, "#");

  channel.consume(playerQueue, (msg) => {
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

      // We need to acknowledge the message to remove it from the queue
      // The problem is that we need to do that after we have processed the message
      // However, in a long game we get PRECONDITION_FAILED errors if we ack the message too late
      // As a workaround, we ack the message before we process it. This is not ideal but it works for now...
      channel.ack(msg);

      try {
        emit(
          headers.type,
          {
            headers,
            payload: event,
          },
          context
        );
      } catch (e) {
        logger.error(e);
      }

      // channel.ack(msg);
    } else {
      logger.info("Consumer cancelled by server");
    }
  });
}

export function on<K extends keyof ClientEvents>(
  eventName: K,
  fn: (
    event: GameEvent<ClientEvents[K]>,
    context: RelayContext
  ) => Awaitable<void>
) {
  emitter.on(eventName, fn);
}

function emit<K extends keyof ClientEvents>(
  eventName: K,
  event: GameEvent<ClientEvents[K]>,
  context: RelayContext
) {
  // Triggers hopefully all of our state handlers
  emitter.emit(eventName, event, context);
}
