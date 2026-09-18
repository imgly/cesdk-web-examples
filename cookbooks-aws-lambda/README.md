# Welcome to your CDK JavaScript project

This is a blank project for CDK development with JavaScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app. The build step is not required when using JavaScript.

## Useful commands

- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## Use `@cesdk/node` (WASM) on AWS Lambda

This cookbook is built around `@cesdk/node` (WASM). The Lambda runtimes
(`nodejs22.x` on Amazon Linux 2023) ships glibc 2.34, which
is below the **glibc ≥ 2.39 floor** that `@cesdk/node-native`'s Linux
binary requires; a Lambda function that does
`require('@cesdk/node-native')` fails at load with
`version 'GLIBC_2.38' not found`. There is no Lambda base image today
with a new enough glibc.

The repo also includes `src/cesdk-handler-native.js` as a **reference for
non-Lambda Linux deployments** — Kubernetes / Cloud Run / EC2 running
Ubuntu 24.04+ or Debian 13+. It is documented as not-for-Lambda at the
top of the file. The active handler in this cookbook is
`src/cesdk-handler.js`.
