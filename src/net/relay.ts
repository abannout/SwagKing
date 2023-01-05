import EventEmitter from "events";
import { Awaitable, ClientEvents, EventHeaders, EventType, GameEvent } from "../types";
import { Context } from "../context";
import * as amqplib from "amqplib";
import logger from "../utils/logger";

const emitter = new EventEmitter();

export async function setupRelay(context: Context, playerQueue: string) {
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

function emit<K extends keyof ClientEvents>(eventName: K, event: GameEvent<ClientEvents[K]>) {
  emitter.emit(eventName, event);
}