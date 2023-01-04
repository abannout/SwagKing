import EventEmitter from "events";
import { Awaitable, ClientEvents, EventType, GameEvent } from "../types";

export class EventRelay {
  private emitter = new EventEmitter();
  on<K extends keyof ClientEvents>(eventName: K, fn: (event: GameEvent<ClientEvents[K]>) => Awaitable<void>) {
    this.emitter.on(eventName, fn);
  }

  off<K extends keyof ClientEvents>(eventName: K, fn: (event: GameEvent<ClientEvents[K]>) => Awaitable<void>) {
    this.emitter.off(eventName, fn);
  }

  emit<K extends keyof ClientEvents>(eventName: K, event: GameEvent<ClientEvents[K]>) {
    this.emitter.emit(eventName, event);
  }
};