<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    borderWidth?: 'thin' | 'medium' | 'thick';
    children: Snippet;
  }
  
  let { 
    className = '',
    padding = 'sm',
    borderStyle = 'solid',
    borderWidth = 'thin',
    children
  }: Props = $props();

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const borderClasses = {
    thin: 'border',
    medium: 'border-4',
    thick: 'border-6'
  };
  
  const borderStyleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
  };
</script>

<div class="bg-slate-900 rounded-lg border-violet-500 {borderClasses[borderWidth]} 
            {borderStyleClasses[borderStyle]} {paddingClasses[padding]} {className}">
    {@render children()}
</div>
