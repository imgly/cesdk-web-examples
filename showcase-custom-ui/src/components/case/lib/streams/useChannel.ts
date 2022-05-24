import Channel, { ReadWriteChannel } from './Channel';
import useStream from './useStream';

const NoopChannel = Object.freeze<ReadWriteChannel<never>>({
  stream: () => () => () => {
    // noop
  },
  update: () => {
    // noop
  }
});

// RW Channel with explicit initialValue: all guaranteed
function useChannel<Out, In = Out>(
  channel: ReadWriteChannel<Out, In> | undefined,
  initialValue: Out | (() => Out)
): [value: Out, update: (v: In) => void];

// RW Channel without initialValue: only update guaranteed
function useChannel<Out, In = Out>(
  channel: ReadWriteChannel<Out, In> | undefined
): [value: Out | undefined, update: (v: In) => void];

// Channel with initialValue: value guaranteed
function useChannel<Out, In = Out>(
  channel: Channel<Out, In> | undefined,
  initialValue: Out | (() => Out)
): [value: Out, update?: (v: In) => void];

// Channel without initialValue: nothing guaranteed
function useChannel<Out, In = Out>(
  channel: Channel<Out, In> | undefined
): [value: Out | undefined, update?: (v: In) => void];

function useChannel<Out, In = Out>(
  // @ts-ignore
  { stream: source, update, initialValue }: Channel<Out, In> = NoopChannel,
  defaultValue?: Out | (() => Out)
): [value: Out | undefined, update?: (v: In) => void] {
  const value = useStream(source, initialValue ?? defaultValue);
  return [value, update];
}

export default useChannel;
