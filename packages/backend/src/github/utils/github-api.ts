import { Octokit } from "@octokit/rest";

let octokit: Octokit;

export function getOctokitClient(accessToken?: string): Octokit {
	if (octokit) return octokit;

	octokit = new Octokit({ auth: accessToken });

	return octokit;
}
