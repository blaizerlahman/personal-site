<script lang="ts">
  import TextBox from "../TextBox.svelte";
</script>

<main class="flex flex-col">
  <section id="intro" class="flex flex-col md:flex-row items-center gap-10 py-4
  max-w-[800px] mx-auto px-4 sm:px-8 lg:px-10">
    <div class="flex-1 space-y-6 text-left">
      Hey, welcome to my site! 
      <br><br>
      <TextBox>
        This serves as a personal website to showcase some of my projects, 
        provide a digital resume, and give updates on my journey as a developer
        (and also try out some nerdy stuff, check out Matrix Mode!).
        <br><br>
        While there may not be much to showcase right now, I use that as motivation to one day
        have so much shareworthy work that it can't all fit on the site!
      </TextBox>
    </div>
  </section>
</main>