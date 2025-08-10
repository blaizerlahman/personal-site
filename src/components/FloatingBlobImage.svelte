<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	export let src: string;
	export let alt: string;
	export let size: string = '18rem'; 
	export let mdSize: string = '20rem'; 
	export let glowColor: string = '139,92,246';
	export let borderColor: string = 'border-violet-700';
	export let cycleDuration: number = 4000; 
	export let scaleRange: number = 0.05; 
	export let glowRange: { base: number; range: number } = { base: 15, range: 20 };
	export let alphaRange: { base: number; range: number } = { base: 0.20, range: 0.60 };

	const HALF_CYCLE = cycleDuration;
	const progress = tweened(0, {
		duration: HALF_CYCLE,
		easing: cubicInOut
	});

	let direction = 1;

	function pulse() {
		progress.set(direction);
		direction = 1 - direction;
		setTimeout(pulse, HALF_CYCLE);
	}

	onMount(pulse);

	$: scale = 1 + scaleRange * $progress;
	$: glowRadius = glowRange.base + glowRange.range * $progress;
	$: glowAlpha = alphaRange.base + alphaRange.range * $progress;
	$: glowStyle = `filter: drop-shadow(0 0 ${glowRadius}px rgba(${glowColor},${glowAlpha}))`;
	$: headStyle = `transform: scale(${scale})`;
</script>

<style>
	.blob-container {
		position: relative;
		transform-origin: center;
	}
	.blob-background {
		transition: filter 200ms linear;
	}
</style>

<div
	class="blob-container relative shrink-0 mx-auto w-[{size}] h-[{size}] md:w-[{mdSize}] md:h-[{mdSize}]"
>
	<div
		class="blob-background absolute inset-0 -z-20 w-full h-full rounded-full bg-violet-700 opacity-100"
		style={glowStyle}
	></div>
	<img
		{src}
		{alt}
		loading="lazy"
		class="w-full h-full rounded-full border-8 object-cover object-center shadow-lg {borderColor}"
		style={headStyle}
	/>
</div>