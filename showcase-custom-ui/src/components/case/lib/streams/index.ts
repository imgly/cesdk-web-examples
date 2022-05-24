/** @public */
export type UnsubscribeFn = () => void;

/** @public */
export type Handler<T> = (v: T) => void;

/**
 * A stream source
 * @public
 */
export type Source<T> = (handler: Handler<T>) => UnsubscribeFn;

/**
 * A stream operator, converting one source into another
 * @public
 */
export type Operator<I, O = I> = (source: Source<I>) => Source<O>;

/** @public */
export type Emit<T> = (...values: T[]) => void;

/**
 * Create a stream source from scratch.
 * @param onSubscribe This callback is invoked whenever a new handler subscribes
 *                    to this source. The callback is given an emit method that
 *                    can be used to emit values to the new subscriber.
 * @returns A stream source that has an attached `emit` method.
 */
export function makeSource<T>(
  onSubscribe?: (emitToSubscriber: Emit<T>) => void
): Source<T> & { emit: Emit<T> } {
  const handlers: Set<Handler<T>> = new Set();

  function emit(...e: T[]): void {
    // @ts-ignore
    for (const handler of handlers) {
      for (const value of e) {
        handler(value);
      }
    }
  }

  function stream(handler: Handler<T>) {
    handlers.add(handler);
    const emitToSubscriber = (...values: T[]) => {
      for (const value of values) {
        handler(value);
      }
    };
    onSubscribe?.(emitToSubscriber);
    return () => handlers.delete(handler);
  }

  stream.emit = emit;

  return stream;
}

export const filter =
  <T extends any>(filterFn: (e: T) => boolean) =>
  (source: Source<T>) =>
  (handler: Handler<T>): UnsubscribeFn => {
    return source((e) => {
      if (filterFn(e)) {
        handler(e);
      }
    });
  };

export const map =
  <I, O>(mapFn: (i: I) => O) =>
  (source: Source<I>) =>
  (listener: Handler<O>): UnsubscribeFn => {
    return source((e) => {
      listener(mapFn(e));
    });
  };

/**
 * Map and potentially unwrap an async value.
 *
 * This can be used with synchronous and asynchronous sources (i.e. plain values
 * or promises), and synchronous or asynchronous map functions.
 * The resulting stream will received unwrapped plain values, but will always
 * receive them asynchronously.
 * @param mapFn
 * @returns
 */
export const mapAsync =
  <I, O = I>(mapFn: (i: I) => O | Promise<O>) =>
  (source: Source<I | Promise<I>>) =>
  (listener: Handler<O>) => {
    return source(async (e) => {
      const i = await e;
      listener(await mapFn(i));
    });
  };

/**
 * Guarantees that the handler is invoked at least once, immediately and
 * synchronously after the subscription, with the provided first value.
 *
 * If the source already sends data synchronously during subscription, that
 * data is used instead and the firstValue is ignored.
 */
export const kickOff =
  <T>(firstValue: T | (() => T)) =>
  (source: Source<T>) =>
  (handler: Handler<T>): UnsubscribeFn => {
    let receivedData = false;

    const unsubscribe = source((e) => {
      receivedData = true;
      handler(e);
    });

    if (!receivedData) {
      handler(firstValue instanceof Function ? firstValue() : firstValue);
    }

    return unsubscribe;
  };

export const id = <T>(source: Source<T>) => source;

/**
 * Swallows updates and doesn't pass them on, when their value is the same as
 * the value that was passed before.
 *
 * The equals function does not actually have to implement an equivalence
 * relation. It can also be thought of as a "reject" function, that receives
 * the previous and current value.
 */
export const memo =
  <T>(equals = (value: T, lastValue: T | undefined) => value === lastValue) =>
  (source: Source<T>) => {
    let lastValue: T;
    return (handler: Handler<T>) => {
      return source((e) => {
        if (equals(e, lastValue)) {
          return;
        }
        lastValue = e;
        handler(e);
      });
    };
  };

/**
 * Fans out a source to multiple handlers
 *
 * Normally, if you attach a handler to a source, the entire chain of operators
 * on that source is invoked for every event and every handler.
 *
 * The `fan` operator maintains its own list of handlers and subscribes upstream
 * only once!
 *
 * ```
 * Without Fan:
 *        ┌─► Filter ─► Map ─► Consumer
 * Source │
 *        └─► Filter ─► Map ─► Consumer
 *
 * With Fan:
 *                                ┌─► Consumer
 * Source ─► Filter ─► Map ─► Fan │
 *                                └─► Consumer
 * ```
 *
 * Use this only when needed, since it does bring some overhead with it.
 *
 * Note: If the source emits synchronously during subscription, only the first
 * handler will receive that event!
 */
export const fan = <T>(source: Source<T>) => {
  const handlers = new Set<Handler<T>>();
  let unsubscribe: UnsubscribeFn | null = null;

  return (handler: Handler<T>) => {
    handlers.add(handler);
    if (unsubscribe === null) {
      unsubscribe = source((e) => {
        handlers.forEach((h) => h(e));
      });
    }
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        unsubscribe?.();
        unsubscribe = null;
      }
    };
  };
};

/**
 * Allows for easier expression of a series of operators.
 *
 * The first argument should always be a Source, subsequent arguments should be
 * Operators with matching types.
 *
 * @returns a source that matches the output type of the last operator
 */
export function pipe<T>(source: Source<T>): Source<T>;
export function pipe<A, B>(source: Source<A>, ab: Operator<A, B>): Source<B>;
export function pipe<A, B, C>(
  source: Source<A>,
  ab: Operator<A, B>,
  bc: Operator<B, C>
): Source<C>;
export function pipe<A, B, C, D>(
  source: Source<A>,
  ab: Operator<A, B>,
  bc: Operator<B, C>,
  cd: Operator<C, D>
): Source<D>;
export function pipe<A, B, C, D, E>(
  source: Source<A>,
  ab: Operator<A, B>,
  bc: Operator<B, C>,
  cd: Operator<C, D>,
  de: Operator<D, E>
): Source<E>;
export function pipe<A, B, C, D, E, F>(
  source: Source<A>,
  ab: Operator<A, B>,
  bc: Operator<B, C>,
  cd: Operator<C, D>,
  de: Operator<D, E>,
  ef: Operator<E, F>
): Source<F>;
export function pipe<T>(
  source: Source<any>,
  ...operators: Operator<any>[]
): Source<T> {
  return operators.reduce((res, operator) => operator(res), source);
}
