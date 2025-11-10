import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Octokit } from "@octokit/rest";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const path = searchParams.get("path");

  const session = await getServerSession(authOptions);
  if (!session?.accessToken)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (!owner || !repo || !path)
    return Response.json({ error: "Missing parameters" }, { status: 400 });

  const octokit = new Octokit({ auth: session.accessToken });
  const { data } = await octokit.repos.getContent({ owner, repo, path });

  return Response.json(data);
}
