/**
 * Fetches the contents of a directory from a GitHub repository/file using the GitHub API.
 *
 * @param githubPath - The path to the directory within the repository
 * @returns A promise that resolves to an array of directory contents
 * @throws Error if GitHub token, owner, or repo environment variables are missing
 * @throws Error if the API request fails
 */
export async function fetchGithubFile(filePath: string): Promise<string> {
  const token = process.env.GH_TOKEN;
  if (!token) {
    throw new Error("Github token variable not provided.");
  }

  const owner = process.env.GH_OWNER;
  const repo = process.env.GH_REPO;
  if (!owner || !repo) {
    throw new Error("Github repository or owner variable not provided.");
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const resp = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!resp.ok) {
    throw new Error(`Github API error for ${filePath}: ${resp.status} ${resp.statusText}`);
  }
  
  return await resp.json();
}
