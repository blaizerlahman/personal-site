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
  
  <div class="relative h-42 w-full overflow-hidden flex items-center justify-center">
    <img
      src={imageSrc}
      alt={imageAlt}
      class="max-w-full max-h-full object-contain transition-transform duration-300 
             group-hover:scale-105 mx-auto my-auto px-4"
      loading="lazy"
    />
  </div>
  
  <div class="p-4 space-y-3">
    <h3 class="text-lg font-bold text-white group-hover:text-violet-300 
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
      <div class="flex gap-2 pt-2">
        {#if projectUrl}
          <a 
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 px-3 py-1.5 text-center text-xs font-medium
                   bg-violet-600 hover:bg-violet-500 text-white rounded-md
                   transition-colors duration-200 hover:shadow-md"
          >
            Visit Site
          </a>
        {/if}
        
        {#if githubUrl}
          <a 
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 px-3 py-1.5 text-center text-xs font-medium
                   border border-slate-600 hover:border-violet-500 
                   text-gray-300 hover:text-violet-300 rounded-md
                   transition-colors duration-200 hover:bg-slate-700/50"
          >
            Code
          </a>
        {/if}
      </div>
    {/if}
  </div>
</div>