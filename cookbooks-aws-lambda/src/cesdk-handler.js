const CreativeEngine = require("@cesdk/node");
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

const { MimeType } = CreativeEngine;

const config = {
  license: "<your-license-here>",
};

exports.main = async function (event) {
  try {
    const engine = await CreativeEngine.init(config);
    // load scene from remote template file
    await engine.scene.loadFromURL(templateURL);
    for (const record of event.Records) {
      const item = record.dynamodb.NewImage;
      const filename = item.filename.S;
      const id = item.id.S;
      const interpolationParams = JSON.parse(item.interpolationParams.S);
      // Interpolate the text content from request params
      engine.block.setString(
        engine.block.findByType("text")[0],
        "text/text",
        interpolationParams.headline
      );

      const [page] = engine.block.findByType("page");
      const renderedImage = await engine.block.export(page, {
        mimeType: "image/png",
      });
      const imageBuffer = await renderedImage.arrayBuffer();

      const putObjectCommand = new PutObjectCommand({
        Bucket: bucketName,
        Body: Buffer.from(imageBuffer),
        ContentType: "image/png",
        Key: filename,
      });
      // Store rendered image in S3 bucket
      await s3Client.send(putObjectCommand);
      // Retrieve image url
      const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 3600,
      });
      // Update the item in DB with the signed URL and status
      const updateCommand = new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression: "SET #status = :statusValue, #url = :signedUrl",
        ExpressionAttributeNames: {
          "#url": "url",
          "#status": "creationStatus",
        },
        ExpressionAttributeValues: {
          ":signedUrl": signedUrl,
          ":statusValue": "FINISHED",
        },
        ReturnValues: "UPDATED_NEW",
      });
      await dynamoDBDocClient.send(updateCommand);
    }
  } catch (error) {
    console.warn(error);
  }
};
