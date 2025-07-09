import path from "node:path";
import { PythonFunction } from "@aws-cdk/aws-lambda-python-alpha";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class EtlConstruct extends Construct {
	constructor(scope: Construct, id: string) {
		super(scope, id);

		const bucket = new Bucket(this, "dataBucket", {
			bucketName: "aabbccdddatabucket", // TODO: Update bucketName
		});

		// Add AWS Pandas layer
		const pandasLayer = lambda.LayerVersion.fromLayerVersionArn(
			this,
			"PandasLayer",
			"arn:aws:lambda:us-east-1:336392948345:layer:AWSSDKPandas-Python39:10",
		);

		// Create Lambda function with Pandas layer
		const lambdaFunction = new lambda.Function(this, "MyLambdaFunction", {
			runtime: lambda.Runtime.PYTHON_3_9,
			handler: "repo_scan_lambda.lambda_handler",
			code: lambda.Code.fromAsset(
				path.join(__dirname, "/packages/backend/src/python/lambda/repo_scan"), // "../../packages/backend/src/python/lambda/repo_scan",
			),
			timeout: cdk.Duration.minutes(5),
			memorySize: 128,
			description:
				"Lambda function with Pandas layer for repo scanning deployed with CDK",
			layers: [pandasLayer],
			environment: {
				gh_api_key: "xxxx", // TODO: Update gh_api_key
				s3_bucket_location: bucket.bucketName,
			},
		});
		console.log(
			path.join(__dirname, "/packages/backend/src/python/lambda/repo_scan"),
		);
		bucket.grantWrite(lambdaFunction);
	}
}
