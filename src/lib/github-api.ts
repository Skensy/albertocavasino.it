const REPO_OWNER = "Skensy";
const REPO_NAME = "albertocavasino.it";
const FILE_PATH = "src/data/site-content.json";

export interface GitHubFile {
  content: string;
  sha: string;
}

/**
 * Fetch the current site-content.json from GitHub via the Contents API.
 * Requires a PAT with "Contents: Read and Write" access to the repo.
 */
export async function fetchContent(token: string): Promise<GitHubFile> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      `GitHub API error: ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json();
  const decoded = atob(data.content.replace(/\n/g, ""));
  return { content: decoded, sha: data.sha };
}

/**
 * Save (commit) updated content to site-content.json on GitHub.
 *
 * @param token  GitHub PAT with Contents:Write
 * @param newContent  The full JSON string to write
 * @param sha    SHA of the current file (required for update)
 * @param message  Optional commit message
 */
export async function saveContent(
  token: string,
  newContent: string,
  sha: string,
  message?: string
): Promise<void> {
  const encoded = btoa(newContent);

  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message || "Admin: update site content",
        content: encoded,
        sha,
      }),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(
      `GitHub API error: ${res.status} ${res.statusText}\n${errBody}`
    );
  }
}
