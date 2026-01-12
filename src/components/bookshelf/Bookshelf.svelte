<script lang="ts">
	import PullableBook from './PullableBook.svelte';

	interface Book {
		id: string;
		title: string;
		spineColor: string;
		textColor: string;
		width?: string;
	}

	interface Props {
		books: Book[];
		onBookClick?: (bookId: string) => void;
	}

	let { books, onBookClick }: Props = $props();

	function handleBookClick(bookId: string) {
		onBookClick?.(bookId);
	}
</script>

<div class="bookshelf">
	<div class="shelf">
		<div class="shelf-rail shelf-rail-top"></div>
		<div class="shelf-inner">
			<div class="books-row">
				{#each books as book (book.id)}
					<PullableBook {book} onClick={() => handleBookClick(book.id)} />
				{/each}
			</div>
		</div>
		<div class="shelf-rail shelf-rail-bottom"></div>
	</div>
	<div class="shelf-shadow"></div>
</div>

<style>
	.bookshelf {
		position: relative;
		padding: 20px 0;
	}

	.shelf {
		position: relative;
		background: linear-gradient(to bottom, #1e1b2e 0%, #15121f 30%, #0f0a14 100%);
		border-radius: 4px;
		overflow: visible;
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.4),
			0 1px 3px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.03);
	}

	.shelf-rail-top {
		height: 10px;
		background: linear-gradient(to bottom, #2d2456, #1a1529);
		border-bottom: 1px solid rgba(139, 92, 246, 0.15);
		border-radius: 4px 4px 0 0;
	}

	.shelf-rail-bottom {
		height: 14px;
		background: linear-gradient(to top, #0a0610, #1a1529);
		border-top: 1px solid rgba(0, 0, 0, 0.5);
		border-radius: 0 0 4px 4px;
	}

	.shelf-inner {
		position: relative;
		padding: 0 24px;
	}

	.books-row {
		display: flex;
		align-items: flex-end;
		gap: 12px;
		padding: 8px 0;
		min-height: 220px;
	}

	.shelf-shadow {
		position: absolute;
		bottom: -8px;
		left: 10%;
		right: 10%;
		height: 20px;
		background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
		pointer-events: none;
	}

	@media (max-width: 640px) {
		.bookshelf {
			padding: 16px 0;
		}

		.shelf-inner {
			padding: 0 16px;
		}

		.books-row {
			gap: 8px;
			justify-content: center;
			flex-wrap: wrap;
			min-height: 180px;
			padding: 6px 0;
		}

		.shelf-rail-top {
			height: 8px;
		}

		.shelf-rail-bottom {
			height: 10px;
		}

		.shelf-shadow {
			bottom: -6px;
			left: 5%;
			right: 5%;
			height: 16px;
		}
	}

	@media (min-width: 641px) and (max-width: 1024px) {
		.shelf-inner {
			padding: 0 20px;
		}

		.books-row {
			gap: 10px;
			justify-content: flex-start;
			padding: 8px 0 10px;
		}
	}
</style>
