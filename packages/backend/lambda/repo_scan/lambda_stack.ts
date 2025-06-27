import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define IAM role for Lambda execution
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Basic execution role for Lambda function',
    });

    // Add basic Lambda execution policy
    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );

    // Add AWS Pandas layer
    const pandasLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'PandasLayer',
      `arn:aws:lambda:${this.region}:336392948345:layer:AWSSDKPandas-Python39:10`
    );

    // Create Lambda function with Pandas layer
    const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'repo_scan_lambda.lambda_handler',
      code: lambda.Code.fromAsset('lambda'),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,
      description: 'Lambda function with Pandas layer for repo scanning deployed with CDK',
      layers: [pandasLayer],
    });

    // Output the Lambda function ARN
    new cdk.CfnOutput(this, 'LambdaFunctionArn', {
      value: lambdaFunction.functionArn,
      description: 'ARN of the Lambda function',
    });
  }
}