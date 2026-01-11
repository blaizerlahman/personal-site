import fs from 'fs/promises';
import path from 'path';
import { fetchGithubFile } from '#lib/utils/github.js';

interface BookMetadata {
	title: string;
	author: string;
	spineColor: string;
	textColor: string;
  description: string;
	githubPath: string;
}

interface BooksMetadata {
	books: Record<string, BookMetadata>;
}

interface NotesFolder {
	title: string;
	githubPath: string;
	chapters: Chapter[];
	subfolders: NotesFolder[];
}

interface BookNotes {
  id: string;
	title: string;
  author: string;
  spineColor: string;
  textColor: string;
  description: string;
	githubPath: string;
	chapters: Chapter[];
	subfolders: NotesFolder[];
}

interface Chapter {
	id: string;
	title: string;
	file: string;
}

/**
 * Generates URL-safe chapter ID from filename
 */
function generateChapterId(filename: string): string {

  // replace non-alpha (whitespace) w/ dashses and remove leading/end dashses
	return filename.replace('.md', '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Reads and parses the books metadata JSON file.
 *
 * @returns A promise that resolves to the books metadata object containing all book entries
 * @throws Error if the books-metadata.json file cannot be found or read
 */
async function getBooksMetadata(): Promise<BooksMetadata> {

	let metadataJSON: string;

  // read book metadata 
	try {
		metadataJSON = await fs.readFile(
			path.join(process.cwd(), 'src/lib/data/books-metadata.json'),
			'utf-8'
		);
	} catch (error) {
		throw new Error(`Could not find books-metadata.json: ${error}`);
	}

	const booksMetadata: BooksMetadata = JSON.parse(metadataJSON);

	return booksMetadata;
}

/**
 * Recursively builds a NotesFolder structure by fetching contents from GitHub.
 *
 * @param notesFolder - The NotesFolder to populate (must have githubPath set)
 * @throws Error if GitHub API request fails
 */
async function buildNotesFolder(notesFolder: NotesFolder, bookPath: string): Promise<void> {

	const noteDirs = await fetchGithubFile(notesFolder.githubPath);

	// go through directory and create nested subfolders
	for (const note of noteDirs) {

    // if regular note, create a chapter object with it, else create subfolder with it
		if (note.name.endsWith('.md')) {

			// don't add folder files (same name as folder or book)
			if (note.name.replace('.md', '') !== notesFolder.title) {
				notesFolder.chapters.push({
          id: generateChapterId(note.name),
          title: note.name.replace('.md', ''),
          file: notesFolder.githubPath.replace(bookPath + '/', '') + '/'
        });
			}
		} else {
			const subfolderPath = path.join(notesFolder.githubPath, note.name);

			const subfolder: NotesFolder = {
				title: note.name,
				githubPath: subfolderPath,
				chapters: [],
				subfolders: []
			};

			// create subfolder and recursively build it
			await buildNotesFolder(subfolder, bookPath);

			// add subfolder to notes if it has content
			if (subfolder.chapters.length > 0 || subfolder.subfolders.length > 0) {
				notesFolder.subfolders.push(subfolder);
			}
		}
	}
}

/**
 * Recursively flattens all chapters from NotesFolder into index
 */
function flattenNotesFolder(notesFolder: NotesFolder,bookPath: string,): Record<string, { title: string; file: string; bookPath: string }> {

	const chapters: Record<string, { title: string; file: string; bookPath: string }> = {};

	// add notes from this folder
	for (const chapter of notesFolder.chapters) {
		chapters[chapter.id] = {
			title: chapter.title,
			file: chapter.file,
			bookPath: bookPath
		};
	}

	// recursively add from subfolders
	for (const subfolder of notesFolder.subfolders) {
		const subChapters = flattenNotesFolder(subfolder, bookPath);
		Object.assign(chapters, subChapters);
	}

	return chapters;
}

/**
 * Creates flat chapter index for O(1) lookups
 */
function createChapterIndex(books: BookNotes[]): Record<string, Record<string, any>> {

	const index: Record<string, Record<string, any>> = {};

	for (const book of books) {
		index[book.id] = {};

		// add root notes
		for (const chapter of book.chapters) {
			index[book.id][chapter.id] = {
				title: chapter.title,
				file: chapter.file,
				bookPath: book.githubPath
			};
		}

		// add notes from subfolders (flattened)
		for (const subfolder of book.subfolders) {
			const folderChapters = flattenNotesFolder(subfolder, book.githubPath);
			Object.assign(index[book.id], folderChapters);
		}
	}

	return index;
}

// generateBookshelf Main driver function for getting metadata and building bookshelf information from it.
async function generateBookshelf() {

	// get books metadata from books-metadata.json
	const booksMetadata: BooksMetadata = await getBooksMetadata().catch((error) => {
		console.error(error);
		process.exit(1);
	});

	const books: BookNotes[] = [];

	// parse metadata to get book info and GH link 
	for (const [bookId, bookMetadata] of Object.entries(booksMetadata.books)) {

		try {
			const bookDirs = await fetchGithubFile(bookMetadata.githubPath);

			// to store book notes and nested folders of notes in
			const bookNotes: BookNotes = {
        id: bookId,
				title: bookMetadata.title,
        author: bookMetadata.author,
        spineColor: bookMetadata.spineColor,
        textColor: bookMetadata.textColor,
        description: bookMetadata.description,
				githubPath: bookMetadata.githubPath,
				chapters: [],
				subfolders: []
			};

			// go through files and add any markdown files to notes, otherwise recursively build notes subfolders
			for (const subdir of bookDirs) {

				if (subdir.name.endsWith('.md')) {
					// skip if it's a folder file
					if (subdir.name.replace('.md', '') !== bookNotes.title) {
						bookNotes.chapters.push({
              id: generateChapterId(subdir.name),
              title: subdir.name.replace('.md', ''),
              file: subdir.name
            });
					}
				} else {
					const subfolderPath = path.join(bookMetadata.githubPath, subdir.name);

					const notesFolder: NotesFolder = {
						title: subdir.name,
						githubPath: subfolderPath,
						chapters: [],
						subfolders: []
					};

					// recursively builds nested notes/subfolders
					await buildNotesFolder(notesFolder, bookMetadata.githubPath);

					// add to book notes if it has content
					if (notesFolder.chapters.length > 0 || notesFolder.subfolders.length > 0) {
						bookNotes.subfolders.push(notesFolder);
					}
				}
			}

			books.push(bookNotes);

		} catch (error) {
			console.error(`Failed to scan ${bookId}:`, error instanceof Error ? error.message : error);
		}
	}

	// create flat chapter index
	const chapterIndex = createChapterIndex(books);
	const totalChapters = Object.values(chapterIndex).reduce((sum, book) => sum + Object.keys(book).length, 0);

	// create final bookshelf structure
	const bookshelf = {
		books,
		chapterIndex,
		lastUpdated: new Date().toISOString()
	};

	// write to file
	const outputPath = path.join(process.cwd(), 'src/lib/data/bookshelf.json');
	await fs.writeFile(outputPath, JSON.stringify(bookshelf, null, 2));
}

generateBookshelf().catch((error) => {
	console.error('Error in bookshelf generation:', error);
	process.exit(1);
});
