import type { RestEndpointMethodTypes } from "@octokit/rest";
import { getOctokitClient } from "../utils/github-api";

export async function getPullRequestRatio(): Promise<number> {
	const client = getOctokitClient();

	const pullRequests = await client.pulls.list({
		owner: "biomejs",
		repo: "biome",
		state: "open",
	});

	let reviewedPRCount = 0;

	await Promise.all(
		pullRequests.data.map(async (pullRequest) => {
			// look at pull request review comments to see if PR has been reviewed
			// use the review_comments_url to get the review comments on a PR
			// if there are no review comments i.e. it hasn't been reviewed yet, then we know it hasn't been reviewed
			// if the array is NOT empty, we know it's been reviewed
			pullRequest.review_comments_url;
			const reviewComments = await client.pulls.listReviewComments({
				owner: "biomejs",
				repo: "biome",
				pull_number: pullRequest.number,
			});
			reviewedPRCount += reviewComments.data.length ? 1 : 0;
		}),
	);

	return reviewedPRCount / pullRequests.data.length;
}
