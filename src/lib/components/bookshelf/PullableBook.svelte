<script lang="ts">
	import BookSpine from './BookSpine.svelte';

	interface Book {
		id: string;
		title: string;
		spineColor: string;
		textColor: string;
		width?: string;
	}

	interface Props {
		book: Book;
		width?: string;
		height?: string;
		trigger?: 'hover' | 'search' | 'both';
		pullAngle?: number;
		pullDistance?: string;
		onClick?: () => void;
	}

	let {
		book,
		width,
		height = '200px',
		trigger = 'both',
		pullAngle = 25,
		pullDistance = '60px',
		onClick
	}: Props = $props();

	let isHovered = $state(false);
	let isPulled = $state(false);
	let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

	const bookWidth = $derived(book.width || width || '60px');
	const isActive = $derived(isHovered || isPulled);

	function handleMouseEnter() {
		if (trigger === 'hover' || trigger === 'both') {
			// Clear any pending timeout to prevent the book from closing
			if (hoverTimeout) {
				clearTimeout(hoverTimeout);
				hoverTimeout = null;
			}
			isHovered = true;
		}
	}

	function handleMouseLeave() {
		if (trigger === 'hover' || trigger === 'both') {
			// Add a small delay before removing hover state to prevent jiggling
			hoverTimeout = setTimeout(() => {
				isHovered = false;
				hoverTimeout = null;
			}, 150);
		}
	}

	export function pull() {
		if (trigger === 'search' || trigger === 'both') {
			isPulled = true;
		}
	}

	export function release() {
		isPulled = false;
	}

	function handleClick() {
		onClick?.();
	}
</script>

<div
	class="pullable-book"
	class:hover={isHovered}
	class:pulled={isPulled}
	role="button"
	tabindex="0"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	style="--pull-angle: -{pullAngle}deg; --pull-distance: {pullDistance}"
>
	<BookSpine
		title={book.title}
		spineColor={book.spineColor}
		textColor={book.textColor}
		width={bookWidth}
		{height}
		isHovered={isActive}
		{isPulled}
	/>
</div>

<style>
	.pullable-book {
		display: inline-block;
		transform-origin: bottom center;
		transform-style: preserve-3d;
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		cursor: pointer;
		perspective: 1000px;
	}

	.pullable-book:hover,
	.pullable-book:focus,
	.pullable-book.hover {
		z-index: 10;
	}

	.pullable-book:hover,
	.pullable-book:focus,
	.pullable-book.hover {
		transform: 
			translateZ(50px)
			translateY(15px)
			rotateZ(calc(var(--pull-angle) * 0.3))
			scale(1.05);
	}

	.pullable-book.pulled {
		transform: 
			translateZ(80px)
			translateY(25px)
			rotateZ(calc(var(--pull-angle) * 0.5))
			scale(1.08);
	}

	@media (max-width: 640px) {
		.pullable-book {
			perspective: 800px;
		}

		.pullable-book:hover,
		.pullable-book:focus,
		.pullable-book.hover {
			transform: 
				translateZ(35px)
				translateY(10px)
				rotateZ(calc(var(--pull-angle) * 0.2))
				scale(1.03);
		}

		.pullable-book.pulled {
			transform: 
				translateZ(55px)
				translateY(18px)
				rotateZ(calc(var(--pull-angle) * 0.4))
				scale(1.05);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pullable-book {
			transition: none;
		}
	}
</style>
