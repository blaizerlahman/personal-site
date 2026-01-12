<script lang="ts">
  import { matrixMode } from '$lib';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let y: number;

  let isMenuOpen = false;

  export let tabs = [
    { name: "About Me", link: "#about" },
    { name: "Projects", link: "#projects" },
    // { name: "What's Going On", link: "/now" },
    { name: "Contact", link: "#contact" },
    { name: "Bookshelf", link: "/bookshelf" },
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

  function downloadResume() {
    const link = document.createElement('a');
    link.href = '/blaize_lahman_resume.pdf';
    link.download = 'blaize_lahman_resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function toggleMatrixMode() {
    matrixMode.update(mode => !mode);
    isMenuOpen = false;
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
  
  <div class="flex items-center gap-4">
    <h1 class="font-medium">
      <a href="/"><b class="font-bold poppins">Blaize Lahman</b></a>
    </h1>

    <button
      on:click={downloadResume}
      class="flex items-center gap-2 px-3 py-1 rounded bg-violet-800 hover:bg-violet-700 transition duration-200 text-white"
      aria-label="Download Resume"
    >
      Resume
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    </button>
  </div>

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
      class="quantico px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
      aria-label="Toggle Matrix Mode"
    >
      {#if $matrixMode}
        Matrix Off
      {:else}
        Matrix Mode
      {/if}
    </button>
  </div>

  <!--mobile dropdown menu-->
  <div class="sm:hidden relative">
    <button
      on:click={toggleMenu}
      class="flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none"
      aria-label="Toggle menu"
    >
      <span class="block w-6 h-0.5 bg-current duration-300"></span>
      <span class="block w-6 h-0.5 bg-current duration-300"></span>
      <span class="block w-6 h-0.5 bg-current duration-300"></span>
    </button>

    {#if isMenuOpen}
      <div class="absolute right-0 top-full mt-2 w-48 bg-slate-900 rounded-lg shadow-lg border border-violet-950 py-2 z-20">
        {#each tabs as tab}
          {#if tab.name === "About Me" || tab.name === "Contact" || tab.name === "Projects"}
            <a
              href={tab.link}
              class="block px-4 py-2 text-sm hover:bg-slate-800 hover:text-violet-400 duration-200"
              on:click={(event) => {
                handleIdClick(event, tab.link); 
                isMenuOpen = false;
              }}
            >
              {tab.name}
            </a>
          {:else}
            <a
              href={tab.link}
              class="block px-4 py-2 text-sm hover:bg-slate-800 hover:text-violet-400 duration-200"
              on:click={() => isMenuOpen = false}
            >
              {tab.name}
            </a>
          {/if}
        {/each}
        <button
          on:click={toggleMatrixMode}
          class="quantico block w-full text-left px-4 py-2 text-sm hover:bg-slate-800 transition"
        >
          {#if $matrixMode}
            Matrix Off
          {:else}
            Matrix Mode
          {/if}
        </button>
      </div>
    {/if}
  </div>
</header>
  
