import { Handler, Operator, pipe, Source } from '.';

/** @public */
export interface Channel<Out, In = Out> {
  stream: Source<Out>;
  update?: (v: In) => void;
  initialValue?: () => Out;
}

/** @public */
export interface ReadWriteChannel<Out, In = Out> extends Channel<Out, In> {
  stream: Source<Out>;
  update: (v: In) => void;
  initialValue?: () => Out;
}

/** @public */
export interface BufferedChannel<T> extends ReadWriteChannel<T, T> {
  update: (newValue: T | ((oldValue: T) => T)) => void;
}

export const pipeChannel = <Out, In = Out>(...operators: Operator<any>[]) => (
  channel: Channel<Out, In>
) => {
  return {
    ...channel,
    // @ts-ignore
    stream: pipe(channel.stream, ...operators)
  };
};

const NO_VALUE = Symbol('NO_VALUE');

/**
 * Makes sure that an update is immediately and synchronously returned to the
 * handler, even if the channel source is asynchronous. The use case would be to
 * update a react state immediately after sending the update to the engine.
 *
 * This way we can guarantee synchronous behavior of the channel, even if the
 * underlying source is asynchronous, but won't affect synchronous sources.
 *
 * This will not guarantee a synchronous handler invocation on subscription,
 * only after updates;
 *
 * The value type T being a function is undefined behavior
 *
 * @param isValueEqual When provided, prevent subsequent updates that are equal
 *                     to the value in cache
 */
export const syncBuffer = <T>(
  { stream: source, update, initialValue }: ReadWriteChannel<T>,
  isValueEqual: (a: T, b: T) => boolean = () => false
): BufferedChannel<T> => {
  /**
   * Stores whatever is passed into `update` or was last received from the source
   *
   * Prevent updates with identical values to the current value from reaching
   * the source (current means the one we passed to update just before, or the
   * last we received from the source)
   */
  let cache = initialValue ? initialValue() : NO_VALUE;
  /**
   * Used to track whether the call to update resulted synchronously in a new
   * value from the source
   */
  let gotValueFromSource = false;
  /**
   * We need to call the handler from the update function. We're storing it here.
   */
  let savedHandler: Handler<T> | undefined;

  const bufferedSource: Source<T> = (handler: Handler<T>) => {
    if (savedHandler) {
      throw new Error('Tried to subscribe a second time to a buffered channel');
      // This could be made possible by maintaining a set of savedHandlers
    } else {
      savedHandler = handler;
    }
    const unsubscribe = source((e) => {
      gotValueFromSource = true;
      cache = e;
      handler(e);
    });
    return () => {
      savedHandler = undefined;
      unsubscribe();
    };
  };

  // This is not perfectly sound, since it is theoretically possible for T to
  // be a function, but in practice that's undefined behavior
  function isFn(
    updater: T | ((oldValue: T) => T)
  ): updater is (oldValue: T) => T {
    return typeof updater === 'function';
  }

  const bufferedUpdate = (newValue: ((oldValue: T) => T) | T) => {
    if (isFn(newValue)) {
      // This swallows updates that happen before we ever get a value.
      // is that a problem? Not likely, because the only situation in this
      // would happen is if there's a) no default value and b) something
      // triggering the update very briefly after opening the channel.
      //
      // We do this because otherwise the updater functions would be forced to
      // handle the undefined case, even though that is not practically relevant
      if (cache === NO_VALUE) return;

      // eslint-disable-next-line no-param-reassign
      newValue = newValue(cache);
    }

    if (cache !== NO_VALUE && isValueEqual(newValue, cache)) return;
    cache = newValue;
    gotValueFromSource = false;
    update(newValue);
    if (!gotValueFromSource) {
      savedHandler?.(newValue);
    }
  };

  return {
    stream: bufferedSource,
    update: bufferedUpdate,
    initialValue
  };
};

export default Channel;
