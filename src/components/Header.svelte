<script lang="ts">
    import { matrixMode } from '$lib';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    export let y: number;

  
    export let tabs = [
      { name: "About Me", link: "#about" },
      { name: "Projects", link: "#projects" },
      { name: "Bookshelf", link: "/bookshelf" },
      { name: "What's Going On", link: "/now" },
      { name: "Contact", link: "/contact" },
    ];

    function handleIdClick(event: Event, elementName: string) {
      event.preventDefault();

      const elementID = elementName.replace('#', '')

      if ($page.route.id === '/') {
        const idElement = document.getElementById(elementID);
        if (idElement) {
          idElement.scrollIntoView({ behavior: 'smooth'});
        }

      } else {
        goto(`/${elementName}`);
      }
    }
  </script>
  
  <header
    class={
      "sticky z-[10] top-0 duration-300 px-6 flex items-center justify-between border-b border-solid " +
      (y > 0
        ? " py-4 bg-slate-950 border-violet-950"
        : " py-6 bg-transparent border-transparent")
    }
  >
    <h1 class="font-medium">
      <b class="font-bold poppins">Blaize</b> <span>Lahman</span>
    </h1>
  
    <div class="sm:flex items-center gap-4 hidden">
      {#each tabs as tab, index}
        {#if tab.name === "About Me" || tab.name === "Contact" || tab.name === "Projects"}
          <a
            href={tab.link}
            class="duration-200 hover:text-violet-400"
            on:click={(event) => handleIdClick(event, tab.link)}
          >
            <p>{tab.name}</p>
          </a>

        {:else}
          <a
            href={tab.link}
            class="duration-200 hover:text-violet-400"
            target={index === 2 ? "_blank" : ""}
          >
            <p>{tab.name}</p>
          </a>
        {/if}
      {/each}
  
      <button
        on:click={() => matrixMode.update(n => !n)}
        class="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
        aria-label="Toggle Matrix Mode"
      >
        {#if $matrixMode}
          Matrix Off
        {:else}
          Matrix Mode
        {/if}
      </button>
    </div>
  </header>
  