# Welcome to your CDK JavaScript project

This is a blank project for CDK development with JavaScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app. The build step is not required when using JavaScript.

## Useful commands

- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## `@cesdk/node` on AWS Lambda

The handler is `src/cesdk-handler.js`. The Lambda runtime (`nodejs22.x` on
Amazon Linux 2023) ships glibc 2.34, which is below the **glibc ≥ 2.39 floor**
of the native Linux engine. So on Lambda, `@cesdk/node` starts its WASM engine.
On a Linux host with glibc 2.39 or later, the same handler runs the native
engine. Examples are Kubernetes, Cloud Run, or EC2 on Ubuntu 24.04+ or Debian
13+. That host needs the runtime libraries that the `@cesdk/node` README lists.

`cdk deploy` uploads `src/` with its `node_modules/`. Install the dependencies
there without the optional packages:

```bash
cd src
npm install --omit=optional
```

Without the flag, npm adds the `@cesdk/node` platform package of the machine
that runs the install, 40 to 60 MB. Lambda never loads it, but it counts
against the 250 MB limit of an unzipped function. With the flag, the function
has about the size of earlier `@cesdk/node` versions. On Lambda, the engine logs
at `Info` that this host has no native engine, with or without the flag. Do not
use the flag for a host that runs the native engine.
