<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    
    export let src: string;
    export let alt: string = '';
    export let className: string = '';
    export let style: string = '';
    export let matrixMode: boolean = true;
    export let loadingSpeed: number = 300; 
    export let chunkHeight: number = 20; 
    
    let containerElement: HTMLDivElement;
    let canvasElement: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let img: HTMLImageElement;
    let isLoaded = false;
    let currentHeight = 0;
    let loadingInterval: ReturnType<typeof setInterval>;
    let hasStartedLoading = false; 
    
    onMount(() => {
      if (matrixMode) {
        startAOLLoading();
      }
    });
    
    function startAOLLoading() {
      if (hasStartedLoading) return;
      
      hasStartedLoading = true;
      isLoaded = false;
      currentHeight = 0;
      
      if (canvasElement && containerElement) {
        const rect = containerElement.getBoundingClientRect();
        canvasElement.width = rect.width;
        canvasElement.height = rect.height;
        ctx = canvasElement.getContext('2d')!;
      }
      
      img = new Image();      
      img.onload = () => {
        if (!canvasElement || !matrixMode) return;
        
        // start loading animation
        loadingInterval = setInterval(() => {
          drawAOLStyle();
        }, loadingSpeed);
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', src);
        isLoaded = true;
      };
      
      img.src = src;
    }
    
    function drawAOLStyle() {
      if (!ctx || !img || !canvasElement) return;
      
      const canvasWidth = canvasElement.width;
      const canvasHeight = canvasElement.height;
      
      const imageAspect = img.width / img.height;
      const canvasAspect = canvasWidth / canvasHeight;
      
      let drawWidth, drawHeight, drawX, drawY;
      let sourceX, sourceY, sourceWidth, sourceHeight;
      
      if (imageAspect > canvasAspect) {
        drawWidth = canvasWidth;
        drawHeight = canvasHeight;
        drawX = 0;
        drawY = 0;
        
        sourceHeight = img.height;
        sourceWidth = img.height * canvasAspect;
        sourceX = (img.width - sourceWidth) / 2;
        sourceY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = canvasHeight;
        drawX = 0;
        drawY = 0;
        
        sourceWidth = img.width;
        sourceHeight = img.width / canvasAspect;
        sourceX = 0;
        sourceY = (img.height - sourceHeight) / 2;
      }
      
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // draw image progressively
      if (currentHeight > 0) {
        const progressRatio = Math.min(currentHeight / canvasHeight, 1);
        const currentSourceHeight = sourceHeight * progressRatio;
        const currentDrawHeight = canvasHeight * progressRatio;
        
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, currentSourceHeight, 
          drawX, drawY, drawWidth, currentDrawHeight 
        );
      }
      
      currentHeight += chunkHeight;
    
      if (currentHeight >= canvasHeight) {
        clearInterval(loadingInterval);
        isLoaded = true;
      }
    }
    
    function stopLoading() {
      if (loadingInterval) {
        clearInterval(loadingInterval);
      }
    }
    
    function resetComponent() {
      stopLoading();
      hasStartedLoading = false;
      isLoaded = false;
      currentHeight = 0;
    }
    
    $: if (src) {
      resetComponent();
      if (matrixMode && containerElement) {
        startAOLLoading();
      }
    }
    
    onDestroy(() => {
      stopLoading();
    });
  </script>
  
  <div bind:this={containerElement} class="aol-image-container {className}" {style}>
    {#if matrixMode && !isLoaded}
      <canvas
        bind:this={canvasElement}
        class="w-full h-full object-cover"
        style="display: block;"
      ></canvas>
    {:else}
      <img
        {src}
        {alt}
        class="w-full h-full object-cover"
        style="display: block;"
      />
    {/if}
  </div>
  
  <style>
    .aol-image-container {
      position: relative;
      overflow: hidden;
    }
    
    .aol-image-container canvas,
    .aol-image-container img {
      border-radius: inherit;
    }
  </style>