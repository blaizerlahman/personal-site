<script>
    import LandingSection from "../components/LandingSection.svelte";
	import MatrixRain from "../components/MatrixRain.svelte";
    import { matrixMode } from "$lib";
</script>

{#if $matrixMode}
    <MatrixRain />
{/if}

<LandingSection />