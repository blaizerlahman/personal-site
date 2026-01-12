import { json } from '@sveltejs/kit';
import { rateLimit } from '#lib/utils/rateLimit';
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
export const GET: RequestHandler = async ({ request, params, setHeaders }) => {

  // check rate limiting
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? request.headers.get('cf-connecting-ip') ?? 'unknown';
    rateLimit(ip);
  } catch (error) {
    return json(
      { error: error.message },
      { status: 429 }
    );
  }

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
	if (chapter.file.endsWith('.md') && chapter.file.replace('.md', '') === chapter.title) {
		filePath = `${chapter.bookPath}/${chapter.file}`;
	} else {
		filePath = `${chapter.bookPath}/${chapter.file}${chapter.title}.md`;
	}

	try {
		const resp = await fetchGithubFile(filePath, true);

		// cache for 1 day and allow stale for 1 week
		setHeaders({
			'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
			'Content-Type': 'application/json',
			'X-Content-Type-Options': 'nosniff'
		});

		return json({
			markdown: resp,
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
