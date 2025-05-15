import type {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from "aws-lambda";
import { getPullRequestRatio } from "../services";

export async function handler(
	_event: APIGatewayProxyEvent,
	_context: Context,
): Promise<APIGatewayProxyResult> {
	const ratio = await getPullRequestRatio();
	return {
		statusCode: 200,
		body: JSON.stringify({ ratio }),
	};
}
