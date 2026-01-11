<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { marked } from 'marked';
  import hljs from 'highlight.js';

  const bookId = $page.params.book;
  const chapterId = $page.params.chapter;

  let loading = $state(true);
  let err   = $state<string | null>(null);
  let markdown = $state('');

  // configure marked
  marked.setOptions({
    highlight: (code, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }

      return hljs.highlightAuto(code).value;

    },
    breaks: true,
    gfm: true
  });

  onMount(async () => {
    try {
      
      // get markdown note
      const resp = await fetch(`/api/books/${bookId}/${chapterId}`);
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || `Failed to fetch book ${bookId} chapter ${chapterId}: $resp.statusText`);
      }

      markdown = marked(data.markdown);
    } catch (error) {
      err = error instanceof Error ? error.message : 'Unknown error';
    }

    loading = false;
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"/>
</svelte:head>

<main class="max-w-[800px] mx-auto px-4 py-8">
  <a href="/bookshelf/{bookId}" class="text-violet-400 hover:text-violet-300 mb-4 inline-block">
    ← Back to Table of Contents
  </a>
  
  {#if loading}
    <p>Loading chapter...</p>
  {:else if err}
    <p class="text-red-400">Error: {err}</p>
  {:else}
    <article class="prose prose-invert max-w-none">
      {@html markdown}
    </article>
  {/if}
</main>
