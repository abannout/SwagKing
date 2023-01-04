import EventEmitter from "events";
import { EventType, GameEvent } from "../types";

type RelayFunction<T> = (event: GameEvent<T>) => Promise<void> | void;

type EventMap = Record<EventType, any>;
type EventKey<T extends EventMap> = EventType & keyof T;
interface Emitter<T extends EventMap> {
  on<K extends EventKey<T>>
    (eventName: K, fn: RelayFunction<T[K]>): void;
  off<K extends EventKey<T>>
    (eventName: K, fn: RelayFunction<T[K]>): void;
  emit<K extends EventKey<T>>
    (eventName: K, params: T[K]): void;
}

const emitter = new EventEmitter();

export class EventRelay<T extends EventMap> implements Emitter<T> {
  private emitter = new EventEmitter();
  on<K extends EventKey<T>>(eventName: K, fn: RelayFunction<T[K]>) {
    this.emitter.on(eventName, fn);
  }

  off<K extends EventKey<T>>(eventName: K, fn: RelayFunction<T[K]>) {
    this.emitter.off(eventName, fn);
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
    this.emitter.emit(eventName, params);
  }
};