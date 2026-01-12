<script lang="ts">
	import { marked } from 'marked';
	import hljs from 'highlight.js';
  import TextBox from './TextBox.svelte';

	interface ChapterNav {
		id: string;
		title: string;
	}

	interface Props {
		markdown: string;
		bookId: string;
		title?: string;
		prevChapter?: ChapterNav;
		nextChapter?: ChapterNav;
		backLink?: string;
	}

	let { markdown, bookId, title, prevChapter, nextChapter, backLink }: Props = $props();

	function highlightCode(code: string, lang: string): string {
		if (lang && hljs.getLanguage(lang)) {
			return hljs.highlight(code, { language: lang }).value;
		}
		return hljs.highlightAuto(code).value;
	}

	let renderedMarkdown = $derived.by(() => {
		if (!markdown) return '';

		const renderer = new marked.Renderer();
		renderer.code = ({ text, lang }) => {
			const highlighted = lang ? highlightCode(text, lang) : highlightCode(text, '');
			return `<pre><code class="hljs language-${lang || ''}">${highlighted}</code></pre>`;
		};

		return marked.parse(markdown, { renderer, breaks: true, gfm: true }) as string;
	});
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"
	/>
</svelte:head>

<div class="mx-auto max-w-[1000px] px-4 py-8 sm:px-8">
	{#if backLink}
		<a
			href={backLink}
			class="mb-6 inline-block text-violet-400 transition-colors duration-200 hover:text-violet-300"
		>
			← Back to Table of Contents
		</a>
	{/if}

	{#if title}
		<h1 class="poppins mb-8 text-3xl font-semibold text-white">{title}</h1>
	{/if}

	<article class="prose-viola">
		{#if markdown}
      <TextBox>
        {@html renderedMarkdown}
      </TextBox>
		{:else}
			<div class="animate-pulse space-y-4">
				<div class="h-8 w-3/4 rounded bg-slate-800"></div>
				<div class="h-4 w-full rounded bg-slate-800"></div>
				<div class="h-4 w-5/6 rounded bg-slate-800"></div>
				<div class="h-4 w-full rounded bg-slate-800"></div>
				<div class="h-4 w-4/5 rounded bg-slate-800"></div>
			</div>
		{/if}
	</article>

	{#if prevChapter || nextChapter}
		<nav
			class="mt-12 flex flex-col items-stretch justify-between gap-4 border-t border-slate-700 pt-6 sm:flex-row sm:items-center"
		>
			{#if prevChapter}
				<a
					href="/bookshelf/{bookId}/{prevChapter.id}"
					class="group flex flex-1 items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition-all duration-200 hover:border-violet-500/50"
				>
					<span class="text-violet-400 transition-transform duration-200 group-hover:-translate-x-1"
						>←</span
					>
					<div class="text-left">
						<p class="text-xs tracking-wider text-gray-500 uppercase">Previous</p>
						<p class="text-gray-300 transition-colors duration-200 group-hover:text-white">
							{prevChapter.title}
						</p>
					</div>
				</a>
			{:else}
				<div></div>
			{/if}

			{#if nextChapter}
				<a
					href="/bookshelf/{bookId}/{nextChapter.id}"
					class="group flex flex-1 items-center justify-end gap-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-right transition-all duration-200 hover:border-violet-500/50"
				>
					<div>
						<p class="text-xs tracking-wider text-gray-500 uppercase">Next</p>
						<p class="text-gray-300 transition-colors duration-200 group-hover:text-white">
							{nextChapter.title}
						</p>
					</div>
					<span class="text-violet-400 transition-transform duration-200 group-hover:translate-x-1"
						>→</span
					>
				</a>
			{:else}
				<div></div>
			{/if}
		</nav>
	{/if}
</div>
