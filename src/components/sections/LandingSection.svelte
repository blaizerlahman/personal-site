<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { matrixMode } from '$lib';
	import AolImageLoader from '../matrix/AOLImageLoader.svelte';

	const HALF_CYCLE = 4000;
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

	$: scale      = 1      + 0.05 * $progress;
	$: glowRadius = 15     + 20   * $progress;
	$: glowAlpha  = 0.20   + 0.60 * $progress;
	$: glowStyle  = `filter: drop-shadow(0 0 ${glowRadius}px rgba(139,92,246,${glowAlpha}))`;
	$: headStyle  = `transform: scale(${scale})`;
</script>
  
<style>
	.blob-container  { position: relative; transform-origin: center; }
	.blob-background { transition: filter 200ms linear; }
</style>
  
<main class="flex flex-col flex-1">
	<section
	  class="flex flex-col md:flex-row my-6 items-center gap-30 py-8
			 max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10"
	>
	  <div class="flex-1 space-y-6 text-left">
	    <h1 class="text-4xl sm:text-5xl font-bold leading-tight">
		  Blaize&nbsp;Lahman
		</h1>
		<p>
		  I'm a backend-focused full stack developer with a passion for building software that <strong>helps</strong> people.
		</p>
		<p>
		  Currently a Computer Science and Data Science major at the University of Wisconsin-Madison focused on expanding my 
		  technical knowledge in full stack development, data science, and cybersecurity.
		</p>
	  </div>
  
	  <div
		class="blob-container relative shrink-0
			   w-[18rem] h-[18rem] md:w-[20rem] md:h-[20rem] mx-auto"
	  >
		{#if !$matrixMode}
		  <div
			class="blob-background absolute inset-0 -z-20 w-full h-full rounded-full
				   bg-violet-700 opacity-100"
			style={glowStyle}
		  ></div>
		  <img
			src="/images/landing_headshot.png"
			alt="Headshot of Blaize Lahman"
			loading="lazy"
			class="w-full h-full rounded-full border-8 border-violet-700
				   object-cover object-center shadow-lg"
			style={headStyle}
		  />
		{:else}
		  <!-- matrix mode headshot -->
		  <AolImageLoader
			src="/images/dithered_headshot.png"
			alt="Dithered Headshot"
			className="w-full h-full rounded-full border-8 border-violet-700
				   object-cover object-center shadow-lg"
		  />
		{/if}
	  </div>
	</section>
</main>
  