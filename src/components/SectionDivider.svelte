<script lang="ts">
  interface Props {
    name: string;
    id: string;
  }

  let { name, id }: Props = $props();
</script>

<div id={id} class="flex items-center my-6 w-[70%] mx-auto px-4">
  <div class="flex-grow border border-purple-400"></div>
  <span class="px-6 text-purple-300 font-semibold text-sm uppercase tracking-wider bg-slate-900 whitespace-nowrap">
    {name}
  </span>
  <div class="flex-grow border border-purple-400"></div>
</div>
