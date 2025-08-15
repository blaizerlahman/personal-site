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

<svelte:head>
	<title>Blaize Lahman Personal Website and Developer Portfolio</title>
	<meta name="description" content="Official site of Blaize Lahman. View projects, resume, and contact info.">
	<meta name="keywords" content="Blaize Lahman, blaize, lahman, enrollalert, portfolio, computer science, data science, UW-Madison, software developer">
</svelte:head>

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
