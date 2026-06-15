function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function fromBase64(b64: string): string {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

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
  const decoded = fromBase64(data.content.replace(/\n/g, ""));
  return { content: decoded, sha: data.sha };
}

/**
 * Save (commit) updated content to site-content.json on GitHub.
 */
export async function saveContent(
  token: string,
  newContent: string,
  sha: string,
  message?: string
): Promise<string> {
  const encoded = toBase64(newContent);

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

  const data = await res.json();
  return data.content.sha as string;
}
