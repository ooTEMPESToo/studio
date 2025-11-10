"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Loader2, Github } from "lucide-react";

interface GitHubRepoPaneProps {
  onLoadFile: (content: string) => void; // function to send file content to CodeInputPane
}

export default function GitHubRepoPane({ onLoadFile }: GitHubRepoPaneProps) {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [pushMessage, setPushMessage] = useState("");

  // Fetch user repositories
  const fetchRepos = async () => {
    if (!session) return;
    setLoading(true);
    const res = await fetch("/api/github/repos");
    const data = await res.json();
    setRepos(data);
    setLoading(false);
  };

  // Fetch repo files when repo is selected
  const fetchFiles = async (repoFullName: string) => {
    if (!session) return;
    setLoading(true);
    const [owner, repo] = repoFullName.split("/");
    const res = await fetch(`/api/github/files?owner=${owner}&repo=${repo}`);
    const data = await res.json();
    setFiles(data);
    setSelectedRepo(repoFullName);
    setLoading(false);
  };

  // Fetch content of a selected file
  const fetchFileContent = async (repoFullName: string, path: string) => {
    const [owner, repo] = repoFullName.split("/");
    setLoading(true);
    const res = await fetch(
      `/api/github/file?owner=${owner}&repo=${repo}&path=${path}`
    );
    const data = await res.json();
    const content = atob(data.content); // decode from base64
    setFileContent(content);
    onLoadFile(content); // pass content to main editor
    setSelectedFile(path);
    setLoading(false);
  };

  // Push updated code back to GitHub
  const pushToGitHub = async () => {
    if (!selectedRepo || !selectedFile || !pushMessage) return;
    const [owner, repo] = selectedRepo.split("/");
    setLoading(true);

    const res = await fetch("/api/github/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner,
        repo,
        path: selectedFile,
        content: fileContent,
        message: pushMessage,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (result.success) {
      alert("✅ File successfully pushed to GitHub!");
      setPushMessage("");
    } else {
      alert("❌ Failed to push changes");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!session}>
          <Github className="mr-2 h-4 w-4" />
          {session ? "Open GitHub Repos" : "Connect GitHub First"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>GitHub Repository Browser</DialogTitle>
        </DialogHeader>

        {!session && (
          <p className="text-sm text-gray-400">
            Please sign in with GitHub first.
          </p>
        )}

        {session && (
          <div className="space-y-4">
            {/* Step 1: Load Repositories */}
            <div>
              <Button onClick={fetchRepos} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Fetch My Repositories"
                )}
              </Button>
              <ul className="mt-2 max-h-40 overflow-y-auto border rounded p-2 text-sm">
                {Array.isArray(repos) && repos.length > 0 ? (
                  repos.map((repo) => (
                    <li
                      key={repo.full_name}
                      className={`cursor-pointer px-2 py-1 rounded ${
                        selectedRepo === repo.full_name
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => fetchFiles(repo.full_name)}
                    >
                      {repo.full_name}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground px-2 py-1">
                    {loading
                      ? "Loading repositories..."
                      : "No repositories found or unauthorized."}
                  </p>
                )}
              </ul>
            </div>

            {/* Step 2: Repo Files */}
            {selectedRepo && (
              <div>
                <h3 className="font-medium mb-1">Files in {selectedRepo}</h3>
                <ul className="max-h-40 overflow-y-auto border rounded p-2 text-sm">
                  {files.map((file: any) => (
                    <li
                      key={file.path}
                      className={`cursor-pointer px-2 py-1 rounded ${
                        selectedFile === file.path
                          ? "bg-green-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => fetchFileContent(selectedRepo, file.path)}
                    >
                      {file.path}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step 3: Push Changes */}
            {selectedFile && (
              <div className="space-y-2 border-t pt-3">
                <h3 className="font-medium">
                  Commit Changes to {selectedFile}
                </h3>
                <input
                  type="text"
                  placeholder="Enter commit message..."
                  value={pushMessage}
                  onChange={(e) => setPushMessage(e.target.value)}
                  className="w-full rounded border p-2 text-sm"
                />
                <Button
                  onClick={pushToGitHub}
                  disabled={!pushMessage || loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Push to GitHub"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
