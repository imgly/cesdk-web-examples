const { Stack } = require("aws-cdk-lib");
const CESDKService = require("../lib/cesdk-service");

class CesdkAwsLambdaStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new CESDKService.CESDKService(this, "CESDK Service");
  }
}

module.exports = { CesdkAwsLambdaStack };
