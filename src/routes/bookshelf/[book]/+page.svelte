<script lang="ts">
  import { page } from '$app/stores';
  import bookshelf from '$lib/data/bookshelf.json';
  
  interface Chapter {
    id: string;
    title: string;
    file: string;
  }
  
  interface NotesFolder {
    title: string;
    githubPath: string;
    chapters: Chapter[];
    subfolders: NotesFolder[];
  }
  
  const bookId = $page.params.book;
  const book = bookshelf.books.find(b => b.id === bookId);
</script>

<main class="max-w-[800px] mx-auto px-4 py-8">
  {#if book}
    <h1 class="text-4xl font-bold mb-2">{book.title}</h1>
    <p class="text-gray-400 mb-8">by {book.author}</p>
    
    <p class="text-gray-300 mb-6">{book.description}</p>
    
    <h2 class="text-2xl font-bold mb-4">Table of Contents</h2>
    
    <!-- Root-level chapters -->
    {#if book.chapters.length > 0}
      <ol class="space-y-2 mb-6">
        {#each book.chapters as chapter}
          <li>
            <a 
              href="/bookshelf/{book.id}/{chapter.id}"
              class="text-violet-400 hover:text-violet-300"
            >
              {chapter.title}
            </a>
          </li>
        {/each}
      </ol>
    {/if}
    
    <!-- Subfolders (recursive rendering - simplified for Phase 2) -->
    {#each book.subfolders as folder}
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-2">{folder.title}</h3>
        
        <!-- Chapters in this folder -->
        {#if folder.chapters.length > 0}
          <ol class="space-y-2 ml-4">
            {#each folder.chapters as chapter}
              <li>
                <a 
                  href="/bookshelf/{book.id}/{chapter.id}"
                  class="text-violet-400 hover:text-violet-300"
                >
                  {chapter.title}
                </a>
              </li>
            {/each}
          </ol>
        {/if}
        
        <!-- Nested subfolders (show one level for Phase 2) -->
        {#each folder.subfolders as subfolder}
          <div class="ml-4 mt-2">
            <h4 class="font-semibold">{subfolder.title}</h4>
            <ol class="space-y-1 ml-4">
              {#each subfolder.chapters as chapter}
                <li>
                  <a 
                    href="/bookshelf/{book.id}/{chapter.id}"
                    class="text-violet-400 hover:text-violet-300 text-sm"
                  >
                    {chapter.title}
                  </a>
                </li>
              {/each}
            </ol>
          </div>
        {/each}
      </div>
    {/each}
  {:else}
    <p>Book not found</p>
  {/if}
</main>
