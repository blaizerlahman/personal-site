<script lang="ts">
	import '../app.css';
	import GridBackground from '../components/GridBackground.svelte';
	import Header from "../components/Header.svelte";

	let y: number = 0;
	let innerWidth: number = 0;
	let innerHeight: number = 0;

	function goTop() {
		document.body.scrollIntoView({ behavior: 'smooth'});
	}

	let { children } = $props();
</script>

<div 
	class="container relative flex flex-col max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen"
>
	<Header {y} {innerHeight}/>
	<GridBackground/>
	
	{@render children()}
</div>

<svelte:window bind:scrollY={y} bind:innerHeight bind:innerWidth />