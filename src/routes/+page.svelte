<script>
    import LandingSection from "../components/sections/LandingSection.svelte";
	import MatrixRain from "../components/matrix/MatrixRain.svelte";
    import { matrixMode } from "$lib";
	import AboutSection from "../components/sections/AboutSection.svelte";
	import SectionDivider from "../components/SectionDivider.svelte";
	import IntroSection from "../components/sections/WelcomeSection.svelte";
	import ProjectSection from "../components/sections/LandingProjectSection.svelte";
	import LandingProjectSection from "../components/sections/LandingProjectSection.svelte";
</script>

{#if $matrixMode}
    <MatrixRain />
{/if}

<LandingSection />
<SectionDivider name="Welcome" />
<IntroSection />
<SectionDivider name="About" />
<AboutSection />
<SectionDivider name="Projects" />
<LandingProjectSection />
<SectionDivider name="Contact" />
