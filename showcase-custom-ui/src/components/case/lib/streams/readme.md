# Streams and Channels

Streams and Channels are intended as a very light-weight primitive for the kinds
of reactivity required between our engine and typical front-end frameworks.

## Streams

A stream is nothing more than an eventEmitter that can be subscribed to:

```ts
type Stream<T> = (handle: (value:T) => void) => (() => void)
const unsubscribe = stream((value) => doSomethingWith(value))
```

The purely conceptual streams in themselves are not making any guarantees or
statements about asynchronicity with regard to when the handler is called. This
is different from Promises or async/await, which guarantee asynchronous behavior
always.

That said, there are certain streams that _can_ decide to make guarantees, based
on their implementation or use cases.

Passing streams around should always be essentially "free". Only when a stream
is subscribed to should any sort of processing start.

Since streams are "sources" of events they are sometimes referred to as `source`.
From the perspective of a consumer, it is impossible to distinguish between a
direct source (such as returned from `fromEvent` or `makeSource`) and a source
that has been extended with operators.

### Operators

Operators are functions that take one stream and return another stream. This
package provides a few commonly used operators that modify the behavior of their
input streams.

The `pipe` function is provided to allow for easy composition and chaining of
operators.

## Channels

Streams are one-directional, but for communication between the UI and the
engine, we need a bit more. The concept of Channels is again very lightweight:
A channel consists of a stream, an optional update function, and an optional
initial value.

```ts
type Channel<In, Out = In> = {
  stream: Stream<Out>, 
  update?: (value:In) => void,
  initialValue?: () => Out
}
```

While it will be common in practice, it is not strictly necessary for the types
of both directions of communication to be identical

The reason we have the initial value is that often such an initial value is
necessary to render something in the UI while we wait for a value from the
stream which might not be ready synchronously. The initial value is provided not
as a plain value, but as a function _returning_ the value, so that a channel can
be passed around and re-used while always providing an up-to-date initial value.
The initial value is optional, because there are scenarios where having a
default value makes no sense, or it is impossible to determine one synchronously.

If a initial value can be provided asynchronously, we don't need this extra
mechanism. The source can simply emit that value on the stream once it's ready.

The update function is also optional, since there are scenarios where we want a 
stream with a default value, but don't provide a way to update the source.

To make typing easier for the common case, we provide a `ReadWriteChannel`
where `update` is not optional.

### BufferedChannel

The BufferedChannel is a stateful ReadWriteChannel that synchronizes value
between the stream and the update method in a way that makes it easier to
provide an optimized synchronous UI experience, even if the source in the
background is asynchronous.

Values sent through update are immediately emitted back to the stream, unless 
updating the source causes the source to synchronously emit a value. Having a 
cached value in the Channel requires that Input and Output type are identical.
It also allows us to update values using an updater function instead of a plain
value.

### useStream and useChannel

The `useStream` and `useChannel` hooks are finally connecting Streams and
Channels with React. Similarly simple connectors could be written for other UI
frameworks.