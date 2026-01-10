import fs from 'fs/promises';
import path from 'path';

interface BookMetadata {
  title:      string; 
  author:     string;
  spineColor: string;
  textColor:  string;
  githubPath: string;
}

interface BooksMetadata {
  books: Record<string, BookMetadata>;
}

// getGitHubDirContents General function for getting the contents of a Github directory
async function getGitHubDirContents(repoPath: string): Promise<any[]> {
  const token = process.env.GH_TOKEN;
  if (!token) {
    throw new Error("Missing Github auth token variable.");
  }
  
  const owner = process.env.GH_OWNER;
  const repo = process.env.GH_REPO;
  if (!owner || !repo) {
    throw new Error("Missing repo owner or repo name variables.");
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;

  // GET request for repo contents
  const resp = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!resp.ok) {
    throw new Error(`Github API error for ${repoPath}: ${resp.status} ${resp.statusText}`);
  }

  return await resp.json();
  //const data = await resp.json();
  //console.log(data);
  //return data;
}

async function getBooksMetadata(): BooksMetadata {

  let metadataJSON: string;

  try {
    metadataJSON = await fs.readFile(path.join(process.cwd(), "src/lib/data/books-metadata.json"), "utf-8");
  } catch (error) {
    throw new Error(`Could not find books-metadata.json: ${error}`);
  }

  console.log(metadataJSON);

  const booksMetadata: BooksMetadata = JSON.parse(metadataJSON);

  console.log(Object.keys(booksMetadata.books));

  return booksMetadata;
}

const booksMetadata: BooksMetadata = await getBooksMetadata().catch((error) => {
  console.error(error);
  process.exit(1);
});

getGitHubDirContents("Development/Tech Books/Operating Systems - Three Easy Pieces").catch((error) => {
  console.error(error);
  process.exit(1);
});
