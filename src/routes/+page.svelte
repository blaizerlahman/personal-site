<script>
    import LandingSection from "../components/sections/LandingSection.svelte";
	import MatrixRain from "../components/matrix/MatrixRain.svelte";
    import { matrixMode } from "$lib";
	import AboutSection from "../components/sections/AboutSection.svelte";
	import SectionDivider from "../components/SectionDivider.svelte";
	import IntroSection from "../components/sections/WelcomeSection.svelte";
	import LandingProjectSection from "../components/sections/LandingProjectSection.svelte";
	import ContactSection from "../components/sections/ContactSection.svelte";
</script>

{#if $matrixMode}
    <MatrixRain />
{/if}

<LandingSection />
<SectionDivider name="Welcome" id="welcome"/>
<IntroSection />
<SectionDivider name="About" id="about"/>
<AboutSection />
<SectionDivider name="Projects" id="projects"/>
<LandingProjectSection />
<SectionDivider name="Contact" id="contact"/>
<ContactSection />
