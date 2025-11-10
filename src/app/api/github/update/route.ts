import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Octokit } from "@octokit/rest";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { owner, repo, path, content, message } = await req.json();

  if (!owner || !repo || !path || !content || !message)
    return Response.json({ error: "Missing parameters" }, { status: 400 });

  const octokit = new Octokit({ auth: session.accessToken });

  // Get existing file SHA to update
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

  return Response.json({ success: true });
}
