<script lang="ts">
  import { matrixMode } from '$lib';
  import AolImageLoader from './matrix/AOLImageLoader.svelte';
  
  interface Props {
    name: string;
    imageSrc: string;
    imageAlt: string;
    description: string;
    tools?: string[];
    projectUrl?: string;
    githubUrl?: string;
  }
  
  let { 
    name, 
    imageSrc, 
    imageAlt, 
    description, 
    tools = [], 
    projectUrl, 
    githubUrl 
  }: Props = $props();
</script>

<div class="group bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 
            hover:border-violet-500/50 transition-all duration-300 overflow-hidden
            hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1">
  
  <div class="relative h-48 w-full overflow-hidden">
    {#if !$matrixMode}
      <img
        src={imageSrc}
        alt={imageAlt}
        class="w-full h-full object-cover transition-transform duration-300 
               group-hover:scale-105"
        loading="lazy"
      />
    {:else}
      <AolImageLoader
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full"
        matrixMode={$matrixMode}
        loadingSpeed={200}
        chunkHeight={15}
      />
    {/if}
    
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>
  
  <div class="p-6 space-y-4">
    <h3 class="text-xl font-bold text-white group-hover:text-violet-300 
               transition-colors duration-300 poppins">
      {name}
    </h3>
    
    <p class="text-gray-300 text-sm leading-relaxed">
      {description}
    </p>
    
    {#if tools.length > 0}
      <div class="flex flex-wrap gap-2">
        {#each tools as tool}
          <span class="px-2 py-1 text-xs rounded-full bg-violet-900/30 
                       text-violet-300 border border-violet-700/50
                       font-mono">
            {tool}
          </span>
        {/each}
      </div>
    {/if}
    
    {#if projectUrl || githubUrl}
      <div class="flex gap-3 pt-2">
        {#if projectUrl}
          <a 
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 px-4 py-2 text-center text-sm font-medium
                   bg-violet-600 hover:bg-violet-500 text-white rounded-md
                   transition-colors duration-200 hover:shadow-md"
          >
            View Project
          </a>
        {/if}
        
        {#if githubUrl}
          <a 
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 px-4 py-2 text-center text-sm font-medium
                   border border-slate-600 hover:border-violet-500 
                   text-gray-300 hover:text-violet-300 rounded-md
                   transition-colors duration-200 hover:bg-slate-700/50"
          >
            View Code
          </a>
        {/if}
      </div>
    {/if}
  </div>
</div>