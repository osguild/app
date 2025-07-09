import * as cdk from "aws-cdk-lib";

import type { Construct } from "constructs";
import { EtlConstruct } from "./constructs/etl-construct";
import { RestApiConstruct } from "./constructs/rest-api-construct";

interface BackendStackOptions extends cdk.StackProps {
	githubSecret: string;
	githubClientId: string;
}

export class BackendStack extends cdk.Stack {
	constructor(
		scope: Construct,
		id: string,
		{ githubClientId, githubSecret, ...props }: BackendStackOptions,
	) {
		super(scope, id, props);

		new RestApiConstruct(this, "restApi", { githubClientId, githubSecret });

		new EtlConstruct(this, "etlConstruct");

		// database construct here at some point
	}
}
