// =============================================================================
// NOT FOR AWS LAMBDA. Reference handler for non-Lambda Linux deployments.
// =============================================================================
//
// `@cesdk/node-native` requires glibc ≥ 2.39 on Linux (see
// `bindings/nodejs/scripts/check-glibc-floor.sh`). AWS Lambda's
// Amazon Linux 2023 base image ships glibc 2.34, which is below the floor;
// a Lambda that `require()`s this handler aborts at load with
// `version 'GLIBC_2.38' not found`.
//
// Use this handler as a template for **other Linux runtimes** that *do*
// satisfy glibc 2.39+: Kubernetes (Ubuntu 24.04 / Debian 13 nodes),
// Cloud Run (Debian 13 base), EC2, on-prem VMs.
//
// For AWS Lambda, use the sibling `cesdk-handler.js`
// (`@cesdk/node` WASM) — that handler is the one this cookbook deploys.
//
// Native variant of cesdk-handler.js that uses @cesdk/node-native instead of
// @cesdk/node. Functionally equivalent but runs on native CPU bindings (no
// WASM), which is faster on image-heavy workloads.
//
// Migration deltas vs cesdk-handler.js:
//
//   1. `require('@cesdk/node-native')` instead of `require('@cesdk/node')`.
//
//   2. `baseURL` is optional. By default the loader resolves the engine
//      resource bundle (fonts, ICU, icons, shaders) from the main
//      `@cesdk/node-native/assets/` directory shipped in the npm
//      package — no extra env wiring required. Pass `baseURL` only when
//      hosting the bundle on S3 / CloudFront / a CDN.
//
//   3. `engine.block.export()` returns a `Blob` (matching @cesdk/node).
//      Call `await blob.arrayBuffer()` before handing to `Buffer.from()`
//      / S3.
//
//   4. Packaging: ship `node_modules/@cesdk/node-native` plus the relevant
//      `@cesdk/node-native-<platform>` sibling (resolved automatically via
//      `optionalDependencies`). Linux x64 binaries are produced via
//      `bindings/nodejs/docker/Dockerfile.linux-x64-full`. Linux arm64 is
//      not yet built upstream.

const CreativeEngine = require("@cesdk/node-native");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({});
const dynamoDBClient = new DynamoDBClient({});
const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

const bucketName = process.env.BUCKET;
const templateURL = process.env.TEMPLATE_URL;
const tableName = process.env.TABLE_NAME;
const baseURL = process.env.CESDK_BASE_URL;

const { MimeType } = CreativeEngine;

const config = {
  license: "<your-license-here>",
  baseURL,
};

exports.main = async function (event) {
  try {
    const engine = await CreativeEngine.init(config);
    try {
      await engine.scene.loadFromURL(templateURL);
      for (const record of event.Records) {
        const item = record.dynamodb.NewImage;
        const filename = item.filename.S;
        const id = item.id.S;
        const interpolationParams = JSON.parse(item.interpolationParams.S);
        engine.block.setString(
          engine.block.findByType("text")[0],
          "text/text",
          interpolationParams.headline
        );

        const [page] = engine.block.findByType("page");
        // Returns a Blob (matching @cesdk/node) — unwrap once.
        const renderedImage = await engine.block.export(page, MimeType.PNG);
        const imageBytes = Buffer.from(await renderedImage.arrayBuffer());

        const putObjectCommand = new PutObjectCommand({
          Bucket: bucketName,
          Body: imageBytes,
          ContentType: "image/png",
          Key: filename,
        });
        await s3Client.send(putObjectCommand);
        const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
          expiresIn: 3600,
        });
        const updateCommand = new UpdateCommand({
          TableName: tableName,
          Key: { id },
          UpdateExpression: "SET signedUrl = :signedUrl, #s = :status",
          ExpressionAttributeValues: {
            ":signedUrl": signedUrl,
            ":status": "DONE",
          },
          ExpressionAttributeNames: { "#s": "status" },
        });
        await dynamoDBDocClient.send(updateCommand);
      }
    } finally {
      // Always dispose to release native resources before the Lambda freezes.
      engine.dispose();
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};
