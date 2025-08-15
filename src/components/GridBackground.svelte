<script lang="ts">
  import { showGrid } from '$lib';
</script>
  
{#if $showGrid}
  <div class="inset-0 opacity-5 absolute z-[-1] bgGrid"></div>
{/if}