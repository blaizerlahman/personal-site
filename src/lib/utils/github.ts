/**
 * Fetches the contents of a file/directory from a GitHub repository/file using the GitHub API.
 *
 * @param githubPath - The path to the directory within the repository
 * @param raw - bool specifying whetehr or not to return a raw file (if not returns jason)
 * @returns A promise that resolves to either a JSON object representing file/dir contents or raw file string
 * @throws Error if GitHub token, owner, or repo environment variables are missing
 * @throws Error if the API request fails
 */
export async function fetchGithubFile(filePath: string, raw: boolean = false): Promise<string | any> {
  const token = process.env.GH_TOKEN;
  if (!token) {
    throw new Error("Github token variable not provided.");
  }

  const owner = process.env.GH_OWNER;
  const repo = process.env.GH_REPO;
  if (!owner || !repo) {
    throw new Error("Github repository or owner variable not provided.");
  }

  // don't allow to call with any path besides to book notes
  if (filePath.startsWith("Development/Tech Books") || filePath.includes("..")) {
    throw new Error("Invalid path.");
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  // fetches either raw text or json representation of file
  const resp = await fetch(url, {
    headers: {
      Accept: raw ? "application/vnd.github.v3.raw" : "application/vnd.github+json", // content type based on raw specification
      Authorization: `Bearer ${token}`
    }
  });

  if (!resp.ok) {
    throw new Error("Github API error when fetching content");
  }
  
  // return text if raw specified else return JSON object
  return raw ? await resp.text() : await resp.json();
}
