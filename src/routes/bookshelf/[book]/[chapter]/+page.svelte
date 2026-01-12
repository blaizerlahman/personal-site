<script lang="ts">
	import { page } from '$app/stores';
	import MarkdownViewer from '$lib/components/MarkdownViewer.svelte';
	import bookshelfData from '$lib/data/bookshelf.json';

	interface ChapterNav {
		id: string;
		title: string;
	}

	const bookId = $derived($page.params.book);
	const chapterId = $derived($page.params.chapter);

	let loading = $state(true);
	let err = $state<string | null>(null);
	let markdown = $state('');
	let currentTitle = $state('');
	let prevChapter = $state<ChapterNav | undefined>();
	let nextChapter = $state<ChapterNav | undefined>();

	async function loadChapter(bId: string, cId: string) {
		loading = true;
		err = null;

		try {
			const nav = findChapterNavigation(bId, cId);
			prevChapter = nav.prev;
			nextChapter = nav.next;
			currentTitle = nav.current?.title || '';

			const resp = await fetch(`/api/books/${bId}/${cId}`);
			const data = await resp.json();

			if (!resp.ok) {
				throw new Error(
					data.error || `Failed to fetch book ${bId} chapter ${cId}: ${resp.statusText}`
				);
			}

			markdown = data.markdown;
		} catch (error) {
			err = error instanceof Error ? error.message : 'Unknown error';
		}

		loading = false;
	}

	function findChapterNavigation(
		bId: string,
		cId: string
	): { current?: ChapterNav; prev?: ChapterNav; next?: ChapterNav } {
		const book = bookshelfData.books.find((b) => b.id === bId);
		if (!book) return {};

		const allChapters: ChapterNav[] = [];

		if (book.chapters) {
			allChapters.push(...book.chapters.map((c) => ({ id: c.id, title: c.title })));
		}

		for (const subfolder of book.subfolders || []) {
			if (subfolder.chapters) {
				allChapters.push(...subfolder.chapters.map((c) => ({ id: c.id, title: c.title })));
			}
		}

		const currentIndex = allChapters.findIndex((c) => c.id === cId);
		if (currentIndex === -1) return {};

		return {
			current: allChapters[currentIndex],
			prev: currentIndex > 0 ? allChapters[currentIndex - 1] : undefined,
			next: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : undefined
		};
	}

	$effect(() => {
		if (bookId && chapterId) {
			loadChapter(bookId, chapterId);
		}
	});
</script>

<MarkdownViewer
	{markdown}
	{bookId}
	title={currentTitle}
	{prevChapter}
	{nextChapter}
	backLink="/bookshelf/{bookId}"
/>
