<script lang="ts">
	import FloatingBlobImage from '../FloatingBlobImage.svelte';
	import { matrixMode } from '$lib';
	import AolImageLoader from '../matrix/AOLImageLoader.svelte';
</script>

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
			<FloatingBlobImage src="/images/landing_headshot.png" alt="Headshot of Blaize Lahman"/>
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
  