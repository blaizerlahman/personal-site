<script lang="ts">
	interface Props {
		title: string;
		spineColor: string;
		textColor: string;
		width?: string;
		height?: string;
		isHovered?: boolean;
		isPulled?: boolean;
	}

	let {
		title,
		spineColor,
		textColor,
		width = '60px',
		height = '200px',
		isHovered = false,
		isPulled = false
	}: Props = $props();

	let titleElement: HTMLElement;
	let hasOverflow = $state(false);

	$effect(() => {
		if (titleElement) {
			hasOverflow = titleElement.scrollWidth > titleElement.clientWidth;
		}
	});
</script>

<div
	class="book-spine"
	class:is-hovered={isHovered}
	class:is-pulled={isPulled}
	style="--width: {width}; --height: {height}; --spine-color: {spineColor}; --text-color: {textColor}"
>
	<div class="spine-gradient"></div>
	<div class="spine-content">
		<span class="spine-title" bind:this={titleElement}>{title}</span>
		{#if hasOverflow}
			<span class="ellipsis">...</span>
		{/if}
	</div>
	<div class="spine-decoration"></div>
</div>

<style>
	.book-spine {
		width: var(--width);
		height: var(--height);
		background: var(--spine-color);
		color: var(--text-color);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		overflow: hidden;
		user-select: none;
		cursor: pointer;
	}

	.spine-gradient {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0.5) 0%,
			rgba(0, 0, 0, 0.2) 15%,
			rgba(255, 255, 255, 0.05) 50%,
			rgba(0, 0, 0, 0.1) 85%,
			rgba(0, 0, 0, 0.4) 100%
		);
		pointer-events: none;
		z-index: 2;
	}

	.spine-content {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		position: relative;
		z-index: 1;
		padding: 20px 0;
	}

	.spine-content::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 40px;
		background: linear-gradient(to bottom, transparent, var(--spine-color));
		pointer-events: none;
		z-index: 4;
	}

	.spine-title {
		font-family: 'Share Tech Mono', monospace;
		font-weight: 500;
		font-size: 14px;
		writing-mode: vertical-rl;
		text-orientation: mixed;
		direction: ltr;
		margin: 0 auto;
		line-height: 1.4;
		letter-spacing: 0.5px;
		max-height: 100%;
		overflow: hidden;
		white-space: nowrap;
	}

	.ellipsis {
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%) rotate(90deg);
		font-family: 'Share Tech Mono', monospace;
		font-size: 12px;
		font-weight: 500;
		color: var(--text-color);
		z-index: 5;
		opacity: 0.9;
		letter-spacing: 2px;
	}

	.spine-decoration {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
		z-index: 3;
	}

	.is-hovered .spine-title {
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
	}

	.is-pulled {
		filter: brightness(0.85);
	}

	.is-pulled .spine-title {
		text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
	}

	@media (max-width: 640px) {
		.book-spine {
			width: 50px;
			height: 160px;
		}

		.spine-content {
			padding: 16px 0;
		}

		.spine-title {
			font-size: 11px;
			letter-spacing: 0.3px;
		}

		.ellipsis {
			font-size: 10px;
			bottom: 6px;
		}

		.spine-content::after {
			height: 32px;
		}
	}
</style>
