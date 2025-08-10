<script lang="ts">
  import LandingProjectCard from "../LandingProjectCard.svelte";
</script>


<main class="flex flex-col">
  <section class="flex flex-col md:flex-col items-center gap-10 py-4
  max-w-[800px] mx-auto px-4 sm:px-8 lg:px-10">
    <div class="flex-1 space-y-6 text-left">
      Enough of the boring stuff, let's get to the projects! A more detailed look at 
      all of these can be found on the projects page, this is just a brief overview.
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LandingProjectCard 
        name="EnrollAlert"
        imageSrc="/images/enrollalert_logo_transparent.png"
        imageAlt="EnrollAlert Logo"
        description="A course enrollment tool for UW-Madison students that sends user-specified notifications for course openings."
        tools={["Next.js", "TypeScript", "Go", "PostgreSQL", "AWS Lambda", "AWS SES", "Vercel"]}
        projectUrl="https://enrollalert.com"
        githubUrl="https://github.com/blaizerlahman/enroll-alert"
      />
      <LandingProjectCard 
        name="College Football Model"
        imageSrc="/images/football_graphic.png"
        imageAlt="Football Icon"
        description="A college football prediction model that successfully predicted games in the 2024 season at a 54.5% win rate against the spread."
        tools={["Python", "pandas", "NumPy", "Scikit-learn", "Matplotlib", "Selenium"]}
        githubUrl="https://github.com/blaizerlahman/CFB-Model"
      />
      <LandingProjectCard
        name="This Website!" 
        imageSrc="/images/personal_site_graphic.png"
        imageAlt="Computer and Person Icon"
        description="The site you're on right now! A showcase of my projects and development journey."
        tools={["Svelte", "TypeScript", "HTML", "CSS"]}
        githubUrl="https://github.com/blaizerlahman/personal-site"
      />
    </div>
  </section>
</main>