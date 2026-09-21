<script lang="ts">
  interface Props {
    options: string[];
    value?: string | null;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
  }

  let {
    options,
    value = $bindable(null),
    placeholder = 'Search…',
    label = '',
    disabled = false
  }: Props = $props();

  let open = $state(false);
  let query = $state('');
  let highlight = $state(0);
  let root: HTMLDivElement;

  // When a value is chosen the input shows it; typing filters the list.
  const display = $derived(open ? query : (value ?? ''));
  const filtered = $derived(
    (() => {
      const q = query.trim().toLowerCase();
      if (!open || q === '') return options;
      return options.filter((o) => o.toLowerCase().includes(q));
    })()
  );

  function openList() {
    if (disabled) return;
    open = true;
    query = '';
    highlight = 0;
  }

  function choose(option: string) {
    value = option;
    open = false;
    query = '';
  }

  function onInput(e: Event) {
    query = (e.target as HTMLInputElement).value;
    open = true;
    highlight = 0;
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      openList();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlight = Math.min(highlight + 1, filtered.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlight = Math.max(highlight - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlight]) choose(filtered[highlight]);
    } else if (e.key === 'Escape') {
      open = false;
    }
  }

  function onWindowClick(e: MouseEvent) {
    if (root && !root.contains(e.target as Node)) open = false;
  }
</script>

<svelte:window onclick={onWindowClick} />

<div class="relative w-full" bind:this={root}>
  {#if label}
    <span class="mb-1 block text-xs font-medium text-violet-300">{label}</span>
  {/if}

  <input
    type="text"
    role="combobox"
    aria-expanded={open}
    aria-controls="options-list"
    autocomplete="off"
    {disabled}
    value={display}
    {placeholder}
    onfocus={openList}
    oninput={onInput}
    onkeydown={onKeydown}
    class="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm
           text-white placeholder-gray-500 transition-colors duration-200
           focus:border-violet-500 focus:outline-none disabled:opacity-50"
  />

  {#if open && filtered.length > 0}
    <ul
      id="options-list"
      class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border
             border-violet-900 bg-slate-900 py-1 shadow-lg shadow-violet-500/10"
    >
      {#each filtered as option, i}
        <li>
          <button
            type="button"
            class={'block w-full px-3 py-1.5 text-left text-sm transition-colors duration-150 ' +
              (i === highlight ? 'bg-slate-800 text-violet-300' : 'text-gray-300 hover:bg-slate-800')}
            onclick={() => choose(option)}
            onmouseenter={() => (highlight = i)}
          >
            {option}
          </button>
        </li>
      {/each}
    </ul>
  {:else if open && query.trim() !== ''}
    <div
      class="absolute z-20 mt-1 w-full rounded-md border border-violet-900 bg-slate-900
             px-3 py-2 text-sm text-gray-500"
    >
      No teams found
    </div>
  {/if}
</div>
