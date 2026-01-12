<script lang="ts">
	import bookshelf from '$lib/data/bookshelf.json';
	import Bookshelf from '$lib/components/bookshelf/Bookshelf.svelte';
	import SectionDivider from '../../components/SectionDivider.svelte';
	import MatrixRain from '../../components/matrix/MatrixRain.svelte';
	import { matrixMode } from '$lib';

	function handleBookClick(bookId: string) {
		window.location.href = `/bookshelf/${bookId}`;
	}
</script>

<svelte:head>
	<title>Bookshelf</title>
</svelte:head>

{#if $matrixMode}
	<MatrixRain />
{/if}

<main class="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
	<SectionDivider name="Bookshelf" id="bookshelf" />

	<div class="mb-12 text-center">
		<p class="mx-auto max-w-lg text-gray-400">
			A collection of technical books I've read and taken notes from. 
		</p>
	</div>

	<Bookshelf books={bookshelf.books} onBookClick={handleBookClick} />
</main>
