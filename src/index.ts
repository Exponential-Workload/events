type AnyFunc = (...args: any[]) => any;
/**
  * NodeJS EventEmitter without any special typesafety
  * Use {@link EventEmitter} for typesafe events (recommended)
  * @example
  * ```ts
  * const emitter = new NodeEventEmitter();
  * emitter.on('event', (arg1: string, arg2: number) => { // not inferred!
  *   console.log(arg1, arg2);
  * });
  * emitter.emit('event', 'hello', 123); // works as intended, however:
  * emitter.emit('event', 'hello', 'hi'); // no errors; any, any
  * emitter.emit('event', 'hello'); // no errors; any
  * emitter.emit('event', 'hello', 123, 456); // no errors; any, any, any
  * ```
  */
export class NodeEventEmitter {
  /** Event Listeners - First is the one listening, 2nd is one to call */
  private _event_listeners: Record<string | symbol, [AnyFunc, AnyFunc][]> = {};
  /** Add a listener to an event */
  public on(event: string | symbol, listener: AnyFunc): this {
    if (!this._event_listeners[event]) this._event_listeners[event] = [];
    this._event_listeners[event].push([listener, listener]);
    return this;
  }
  /** Add a listener to an event that will only be called once */
  public once(event: string | symbol, listener: AnyFunc): this {
    if (!this._event_listeners[event]) this._event_listeners[event] = [];
    this._event_listeners[event].push([listener, (...args: any[]) => {
      this.removeListener(event, listener);
      return listener(...args);
    }]);
    return this;
  }
  /** Emit an event */
  public emit(event: string | symbol, ...args: any[]): boolean {
    if (!this._event_listeners[event]) return false;
    for (const [listener, callback] of this._event_listeners[event]) {
      callback(...args);
    }
    return true;
  }
  /**
    * Remove all listeners from an event
    * @param event Event to remove listeners from
    * @param listener Listener to remove
    */
  public off(event: string | symbol, listener: AnyFunc): this {
    if (!this._event_listeners[event]) return this;
    this._event_listeners[event] = this._event_listeners[event].filter(([l]) => l !== listener);
    return this;
  }
  /**
    * Remove all listeners from an event
    * @alias {@link off NodeEventEmitter.off}
    */
  public removeListener(event: string | symbol, listener: AnyFunc): this {
    return this.off(event, listener);
  }
  /**
    * Remove all listeners from an event
    * @param event Event to remove listeners from
    */
  public removeAllListeners(event?: string | symbol): this {
    if (!event) this._event_listeners = {};
    else delete this._event_listeners[event];
    return this;
  }
  /**
    * Get all listeners from an event
    * @param event Event to get listeners from
    */
  public listeners(event: string | symbol): AnyFunc[] {
    if (!this._event_listeners[event]) return [];
    return this._event_listeners[event].map(([l]) => l);
  }
  /**
    * Get all listeners from an event
    * @param event Event to get listeners from
    */
  public rawListeners(event: string | symbol): AnyFunc[] {
    if (!this._event_listeners[event]) return [];
    return this._event_listeners[event].map(([l]) => l);
  }
  /**
    * Get the number of listeners from an event
    * @param event Event to get listener count from
    */
  public listenerCount(event: string | symbol): number {
    if (!this._event_listeners[event]) return 0;
    return this._event_listeners[event].length;
  }
  /**
    * Get all event names
    */
  public eventNames(): (string | symbol)[] {
    return Object.keys(this._event_listeners);
  }
}
/**
  * A typesafe EventEmitter
  * @example
  * ```ts
  * class SomeEmitter extends EventEmitter<{
  *   'event': (arg1: string, arg2: number) => void;
  * }> {}
  * const emitter = new SomeEmitter();
  * emitter.on('event', (arg1, arg2) => { // automatically typed string, number
  *   console.log(arg1, arg2);
  * });
  * emitter.emit('event', 'hello', 123); // typechecked to string, number!
  * emitter.emit('event', 'hello', 'hi'); // errors because 'hi' is not a number!
  * emitter.emit('event', 'hello'); // errors because 2 arguments are required!
  * emitter.emit('event', 'hello', 123, 456); // errors because only 2 arguments are allowed!
  * ```
  */
// psst! this also works on vanilla nodejs event emitters!
export class EventEmitter<T extends Record<string, AnyFunc>> {
  private readonly emitter = new NodeEventEmitter();
  constructor() { }
  public on<K extends (keyof T & (string | symbol))>(event: K, listener: T[K]): this {
    this.emitter.on(event, listener);
    return this;
  }
  public once<K extends (keyof T & (string | symbol))>(event: K, listener: T[K]): this {
    this.emitter.once(event, listener);
    return this;
  }
  public emit<K extends (keyof T & (string | symbol))>(event: K, ...args: Parameters<T[K]>): boolean {
    return this.emitter.emit(event, ...args);
  }
  public off<K extends (keyof T & (string | symbol))>(event: K, listener: T[K]): this {
    this.emitter.off(event, listener);
    return this;
  }
  public removeListener<K extends (keyof T & (string | symbol))>(event: K, listener: T[K]): this {
    this.emitter.removeListener(event, listener);
    return this;
  }
  public removeAllListeners<K extends (keyof T & (string | symbol))>(event?: K): this {
    this.emitter.removeAllListeners(event);
    return this;
  }
  public listeners<K extends (keyof T & (string | symbol))>(event: K): T[K][] {
    return this.emitter.listeners(event) as T[K][];
  }
  public rawListeners<K extends (keyof T & (string | symbol))>(event: K): T[K][] {
    return this.emitter.rawListeners(event) as T[K][];
  }
  public listenerCount<K extends (keyof T & (string | symbol))>(event: K): number {
    return this.emitter.listenerCount(event);
  }
  public eventNames(): (keyof T & (string | symbol))[] {
    return this.emitter.eventNames() as (keyof T & (string | symbol))[];
  }
}
export default EventEmitter;
