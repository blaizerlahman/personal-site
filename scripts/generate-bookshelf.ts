import fs from 'fs/promises';
import path from 'path';

interface BookMetadata {
	title: string;
	author: string;
	spineColor: string;
	textColor: string;
	githubPath: string;
}

interface BooksMetadata {
	books: Record<string, BookMetadata>;
}

interface NotesFolder {
	title: string;
	repoPath: string;
	notes: string[];
	subfolders: NotesFolder[];
}

interface BookNotes {
	title: string;
	repoPath: string;
	notes: string[];
	subfolders: NotesFolder[];
}

/**
 * Fetches the contents of a directory from a GitHub repository using the GitHub API.
 *
 * @param repoPath - The path to the directory within the repository (e.g., "Development/Tech Books/Operating Systems")
 * @returns A promise that resolves to an array of directory contents
 * @throws Error if GitHub token, owner, or repo environment variables are missing
 * @throws Error if the API request fails
 */
async function getGitHubDirContents(repoPath: string): Promise<any[]> {
	const token = process.env.GH_TOKEN;
	if (!token) {
		throw new Error('Missing Github auth token variable.');
	}

	const owner = process.env.GH_OWNER;
	const repo = process.env.GH_REPO;
	if (!owner || !repo) {
		throw new Error('Missing repo owner or repo name variables.');
	}

	const url = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`;

	// GET request for repo contents
	const resp = await fetch(url, {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`
		}
	});

	if (!resp.ok) {
		throw new Error(`Github API error for ${repoPath}: ${resp.status} ${resp.statusText}`);
	}

	if (repoPath == 'Development/Tech Books/Operating Systems - Three Easy Pieces') {
		const data = await resp.json();
		console.log(data);
		return data;
	}

	return await resp.json();
}

/**
 * Reads and parses the books metadata JSON file.
 *
 * @returns A promise that resolves to the books metadata object containing all book entries
 * @throws Error if the books-metadata.json file cannot be found or read
 */
async function getBooksMetadata(): Promise<BooksMetadata> {
	let metadataJSON: string;

	try {
		metadataJSON = await fs.readFile(
			path.join(process.cwd(), 'src/lib/data/books-metadata.json'),
			'utf-8'
		);
	} catch (error) {
		throw new Error(`Could not find books-metadata.json: ${error}`);
	}

	// console.log(metadataJSON);

	const booksMetadata: BooksMetadata = JSON.parse(metadataJSON);

	// console.log(Object.keys(booksMetadata.books));

	// console.log(Object.values(booksMetadata.books));

	return booksMetadata;
}

/**
 * Recursively builds a NotesFolder structure by fetching contents from GitHub.
 *
 * @param notesFolder - The NotesFolder to populate (must have repoPath set)
 * @throws Error if GitHub API request fails
 */
async function buildNotesFolder(notesFolder: NotesFolder): Promise<void> {

	const noteDirs = await getGitHubDirContents(notesFolder.repoPath);

  // go through directory and create nested subfolders
	for (const note of noteDirs) {

		if (note.name.endsWith('.md')) {

      // don't add folder files
      if (note.name.replace('.md', '') !== notesFolder.title) {
        notesFolder.notes.push(note.name);
      }
		} else {

			const subfolderPath = path.join(notesFolder.repoPath, note.name);

			const subfolder: NotesFolder = {
				title: note.name,
				repoPath: subfolderPath,
				notes: [],
				subfolders: []
			};

      // create subfolder and recursively build it
			await buildNotesFolder(subfolder);

			notesFolder.subfolders.push(subfolder);
		}
	}

  //for (const note of notesFolder.notes) {
  //  console.log(`NESTED NOTE in ${notesFolder.title}: ${note}`);
  //}

  //for (const subdir of notesFolder.subfolders) {
  //  console.log(`NESTED SUBFOLDER in ${notesFolder.title}: ${subdir.title}`);
  //}
}

// generateBookshelf Main driver function for getting metadata and building bookshelf information from it.
async function generateBookshelf() {

	// get books metadata from books-metadata.json
	const booksMetadata: BooksMetadata = await getBooksMetadata().catch((error) => {
		console.error(error);
		process.exit(1);
	});

	// parse metadata to get book info and GH link
	for (const bookMetadata of Object.values(booksMetadata.books)) {
		console.log(
			`Getting github dir contents for ${bookMetadata.title} with path ${bookMetadata.githubPath}`
		);
		const bookDirs = await getGitHubDirContents(bookMetadata.githubPath);

		// to store book notes and nested folders of notes in
		const bookNotes: BookNotes = {
			title: bookMetadata.title,
			repoPath: bookMetadata.githubPath,
			notes: [],
			subfolders: []
		};

		// go through files and add any markdown files to notes, otherwise recursively build notes subfolders
		for (const subdir of bookDirs) {
			if (subdir.name.endsWith('.md')) {
				// skip if it's a folder file
				if (subdir.name.replace('.md', '') !== bookNotes.title) {
					bookNotes.notes.push(subdir.name);
				}
			} else {

				const subfolderPath = path.join(bookMetadata.githubPath, subdir.name);

				const notesFolder: NotesFolder = {
					title: subdir.name,
					repoPath: subfolderPath,
					notes: [],
					subfolders: []
				};

        // recursively builds nested notes/subfolders
				await buildNotesFolder(notesFolder);

        // add to book notes
				bookNotes.subfolders.push(notesFolder);
			}
		}

		//for (const note of bookNotes.notes) {
		//	console.log(`BOOK NOTE: ${note}`);
		//}

		//for (const subfolder of bookNotes.subfolders) {
		//	console.log(`SUBFOLDER: ${subfolder.title}`);
		//}
	}
}

generateBookshelf();

//getGitHubDirContents("Development/Tech Books/Operating Systems - Three Easy Pieces").catch((error) => {
//  console.error(error);
//  process.exit(1);
//});
