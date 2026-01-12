<script lang="ts">
	import bookshelf from '$lib/data/bookshelf.json';
	import Bookshelf from '$lib/../components/bookshelf/Bookshelf.svelte';
	import SectionDivider from '$lib/../components/SectionDivider.svelte';

	function handleBookClick(bookId: string) {
		window.location.href = `/bookshelf/${bookId}`;
	}
</script>

<svelte:head>
	<title>Bookshelf</title>
</svelte:head>

<main class="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
	<SectionDivider name="Bookshelf" id="bookshelf" />

	<div class="mb-12 text-center">
		<p class="mx-auto text-gray-400">
			A collection of technical books I've read and the notes I've taken on them. My notetaking
			style is basically just slightly rephrasing whatever is on the page, so don't expect these to
			be groundbreaking or anything. I mainly keep them here as a means to revisit them from my
			phone or another device if I don't have my normal machine.
		</p>
	</div>

	<div class="mx-auto max-w-lg">
		<Bookshelf books={bookshelf.books} onBookClick={handleBookClick} />
	</div>
</main>
