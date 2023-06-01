# Image Matting Server Demo

This demo shows an example on how to build an application executing image matting
on the client-side. This code is for demo purposes only and is not production ready.


## Preparations

Install the needed dependencies with `npm` via

```
npm rum install
```

In addition, the model used for the image matting processing by the uses onnx-runtime
and the needed wasm runtime file all need to be hosted somewhere.
The URLs can be configured inside the `ImageCanvas` component by changing the
following constants:

```
const MODEL_URL = 'https://cdn.img.ly/assets/showcases/image-matting/9a670c90e2fca852c909ba18fc8f80bbc5eff377574681732c1974d72aa31c05';
const WASM_PATH = '';
```
The WASM runtimes can be found inside the `onnxruntime-web` packages
`dist/` folder. `WASM_PATH` can either be a prefix path for all the `.wasm` files at once,
or you can configure each files path separately. For details about that,
see: https://onnxruntime.ai/docs/api/js/interfaces/Env.WebAssemblyFlags.html#wasmPaths and https://github.com/microsoft/onnxjs/blob/master/docs/migration-to-ort-web.md#webassembly-deploy

### Performance configuration (optional, but recommended)

To ensure the image matting being processed with the best possible performance,
a few extra steps have to be considered. The demo probably will run without these,
but we encourage to take care of these aswell to get a proper real-world experience.

#### CORS HTTP headers for WASM

The wasm files in the above configured path need to be served with two specific
CORS headers being set to leverage their full feature and performance potential:

- [`Cross-Origin-Embedder-Policy: require-corp`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)
- [`Cross-Origin-Opener-Policy: same-origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)

#### Workaround for ensuring threading in Safari

Encountered with Safari 16 and greater, threading does not seem to be supported
when using minified code bundles. As a workaround in this demo, minification has
been disable inside `next.config.js`:

```
webpack: (config, {}) => {
  config.optimization.minimize = false;
  config.optimization.minimizer = [];
}
```

## Development

Simply run

```
npm run dev
```

to start the development environment. By default, the application standalone
demo UI will be accessible on `http://localhost:3002`.

