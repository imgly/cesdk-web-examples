const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const dynamoDBClient = new DynamoDBClient({});
const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

const tableName = process.env.TABLE_NAME;

exports.main = async function (event) {
  const routeKey = `${event.httpMethod} ${event.resource}`;

  try {
    switch (routeKey) {
      case "POST /images":
        const id = uuidv4();
        const filename = `awesome-headline-${id}.png`;
        const requestBody = JSON.parse(event.body);
        // Create a new item in the DB table
        const putCommand = new PutCommand({
          TableName: tableName,
          Item: {
            id,
            filename,
            interpolationParams: JSON.stringify({
              headline: requestBody.headline,
            }),
            creationStatus: "PENDING",
            url: "",
          },
        });
        await dynamoDBDocClient.send(putCommand);
        var body = { id };
        break;

      case "GET /images/{id}":
        const getCommand = new GetCommand({
          TableName: tableName,
          Key: {
            id: event.pathParameters.id,
          },
        });
        const getResponse = await dynamoDBDocClient.send(getCommand);
        body = getResponse.Item;
        break;
    }

    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify(body),
    };
  } catch (error) {
    var body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify(body),
    };
  }
};
