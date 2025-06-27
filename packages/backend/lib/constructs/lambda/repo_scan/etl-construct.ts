import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3'

/*
pnpm cdk deploy # to deploy the code.

*/

/*
const entry = '/path/to/function';
const image = DockerImage.fromBuild(entry);

new python.PythonFunction(this, 'function', {
  entry,
  runtime: Runtime.PYTHON_3_8,
  bundling: {
    buildArgs: { PIP_INDEX_URL: "https://your.index.url/simple/", 
    PIP_EXTRA_INDEX_URL: "https://your.extra-index.url/simple/" },
  },
});
*/

export class EtlConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucket = new Bucket(this, 'dataBucket', {
      bucketName: 'aabbccdddatabucket'
    });

    // Add AWS Pandas layer
    const pandasLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'PandasLayer',
      'arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python39:10'
    );

    // Create Lambda function with Pandas layer
    const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'repo_scan_lambda.lambda_handler',
      code: lambda.Code.fromAsset('lib/constructs/lambda/repo_scan'), //cannot find code error
      timeout: cdk.Duration.minutes(5),
      memorySize: 128,
      description: 'Lambda function with Pandas layer for repo scanning deployed with CDK',
      layers: [pandasLayer],
    });

    bucket.grantWrite(lambdaFunction);

  }
}