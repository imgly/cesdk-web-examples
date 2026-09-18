const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const iam = require("aws-cdk-lib/aws-iam");
const eventsource = require("aws-cdk-lib/aws-lambda-event-sources");

class CESDKService extends Construct {
  constructor(scope, id) {
    super(scope, id);

    const tableName = "ImagesTable";
    const bucket = new s3.Bucket(this, "CESDKStore");

    // lambda function for images endpoint creating new images and returning images
    const imagesHandler = new lambda.Function(this, "ImagesHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("src"),
      handler: "images-handler.main",
      environment: {
        TABLE_NAME: tableName,
      },
    });

    // lambda function running CE.SDK and rendering image
    const cesdkHandler = new lambda.Function(this, "CESDKHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset("src"),
      handler: "cesdk-handler.main",
      environment: {
        BUCKET: bucket.bucketName,
        TABLE_NAME: tableName,
        TEMPLATE_URL:
          "https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene",
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 2048,
    });

    // Create dynamo db table for storing image objects
    const imagesTable = new dynamodb.Table(this, "ImagesTable", {
      tableName: "ImagesTable",
      billingMode: dynamodb.BillingMode.PROVISIONED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      pointInTimeRecoverySpecification: {
        PointInTimeRecoveryEnabled: true,
      },
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    });

    // Configure lambda permissions for resources
    bucket.grantReadWrite(cesdkHandler);

    const imagesTablePermissionPolicy = new iam.PolicyStatement({
      actions: [
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
      ],
      resources: [imagesTable.tableArn],
    });

    const imagesTablePermissions = new iam.Policy(
      this,
      `${this.appName}-ImagesTablePermissions`,
      {
        statements: [imagesTablePermissionPolicy],
      }
    );

    imagesHandler.role?.attachInlinePolicy(imagesTablePermissions);
    cesdkHandler.role?.attachInlinePolicy(imagesTablePermissions);

    cesdkHandler.addEventSource(
      new eventsource.DynamoEventSource(imagesTable, {
        startingPosition: lambda.StartingPosition.LATEST,
      })
    );

    // Set up REST api for images
    const api = new apigateway.RestApi(this, "cesdk-api", {
      restApiName: "CESDK Service",
      description: "This service renders cesdk templates.",
    });

    const CESDKIntegration = new apigateway.LambdaIntegration(imagesHandler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    });

    const imagesResource = api.root.addResource("images");
    imagesResource.addMethod("POST", CESDKIntegration); // POST /images

    const imageResource = imagesResource.addResource("{id}");
    imageResource.addMethod("GET", CESDKIntegration); // GET /images/{id}
  }
}

module.exports = { CESDKService };
