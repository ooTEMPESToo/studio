import { Octokit } from "@octokit/rest";

export async function getUserRepos(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.repos.listForAuthenticatedUser();
  return data.map(repo => ({
    name: repo.name,
    full_name: repo.full_name,
  }));
}

export async function getRepoFiles(owner: string, repo: string, accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.repos.getContent({ owner, repo, path: "" });
  return data;
}

export async function updateFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  accessToken: string
) {
  const octokit = new Octokit({ auth: accessToken });

  const { data: file } = await octokit.repos.getContent({ owner, repo, path });
  const sha = (file as any).sha;

  const base64Content = Buffer.from(content).toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: base64Content,
    sha,
  });
}
