import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Octokit } from "@octokit/rest";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const octokit = new Octokit({ auth: session.accessToken });
    const { data } = await octokit.repos.listForAuthenticatedUser({ per_page: 100 });

    const repos = data.map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
    }));

    return Response.json(repos);
  } catch (error: any) {
    console.error("Error fetching repos:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
