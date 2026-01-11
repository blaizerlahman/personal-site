<script lang="ts">
  import bookshelf from '$lib/data/bookshelf.json';
</script>

<main class="max-w-[800px] mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8">Bookshelf</h1>
  
  <ul class="space-y-4">
    {#each bookshelf.books as book}
      <li>
        <a 
          href="/bookshelf/{book.id}"
          class="text-lg text-violet-400 hover:text-violet-300"
        >
          {book.title}
        </a>
        <p class="text-gray-400 text-sm">by {book.author}</p>
        <p class="text-gray-500 text-xs">
          {book.chapters.length} root chapters, {book.subfolders.length} folders
        </p>
      </li>
    {/each}
  </ul>
</main>
