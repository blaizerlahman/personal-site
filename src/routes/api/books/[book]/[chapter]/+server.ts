import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchGithubFile } from '#lib/utils/github';
import bookshelf from '#lib/data/bookshelf.json';

/**
 * Fetches a book chapter content from GitHub and returns it with metadata.
 * @param {Object} params - Route parameters containing book and chapter IDs
 * @param {string} params.book - The book identifier
 * @param {string} params.chapter - The chapter identifier
 * @param {Object} setHeaders - Function to set response headers
 * @returns {Promise<Response>} JSON response with chapter content and metadata
 */
export const GET: RequestHandler = async ({ params, setHeaders }) => {
	// unpack params, both should be id's to index into bookshelf
	const { book: bookId, chapter: chapterId } = params;

	// lookup ids in bookshelf
	const chapter = bookshelf.chapterIndex[bookId]?.[chapterId];
	if (!chapter) {
		return json({ error: `Chapter ${chapterId} for book ${bookId} not found` }, { status: 404 });
	}

	let filePath: string;

	// if it's a root chapter note it'll have same title/filename, so just append filename to path
	// otherwise append chapter name to note title
	if (chapter.file.endWith('.md') && chapter.file.replace('.md', '') == chapter.file.title) {
		filePath = `${chapter.bookPath}/${chapter.file}`;
	} else {
		filePath = `${chapter.bookPath}/${chapter.file}${chapter.title}`;
	}

	console.log(`FILE PATH: ${filePath}`);

	try {
		const resp = await fetchGithubFile(filePath);

		// cache for 1 day and allow stale for 1 week
		setHeaders({
			'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
			'Content-Type': 'application/json',
			'X-Content-Type-Options': 'nosniff'
		});

		return json({
			resp,
			metadata: {
				book: bookId,
				chapter: chapterId,
				title: chapter.title
			}
		});
	} catch (error) {
		return json(
			{
				error: `Error fetching from GH`,
				message: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};
