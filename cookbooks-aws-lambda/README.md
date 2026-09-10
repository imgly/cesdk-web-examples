# Welcome to your CDK JavaScript project

This is a blank project for CDK development with JavaScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app. The build step is not required when using JavaScript.

## Useful commands

- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Choosing between `@cesdk/node` (WASM) and `@cesdk/node-native` (native)

This cookbook ships two parallel handler files:

- `src/cesdk-handler.js` — uses `@cesdk/node` (WASM). Works out of the box on
  any Lambda x86_64 / arm64 runtime; no native binaries to ship.
- `src/cesdk-handler-native.js` — uses `@cesdk/node-native`. Faster on
  image-heavy workloads but requires a Linux x64 native binary shipped as a
  Lambda Layer and a `CESDK_BASE_URL` env var pointing at engine assets.

Pick `node-native` when export throughput matters and `node` (WASM) when you
want zero-config deployment.
