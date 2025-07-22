<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const words = [
    'CYBER', 'SVELTE', 'AWS', 'TYPESCRIPT',
    'REACT', 'POSTGRESQL', 'SQL', 'PYTHON',
    'JAVA', 'GOLANG', 'FULLSTACK', 'DOCKER',
    'LAMBDA', 'PANDAS', 'BACKEND', 'GIT',
    'NEXT', 'REST'
  ];

  const fontSize = 20;
  let columns = 0;
  let drops: number[] = [];
  
  interface FadingText {
    x: number;
    y: number;
    text: string;
    opacity: number;
  }
  
  let fadingTexts: FadingText[] = [];
  let intervalId: ReturnType<typeof setInterval>;

  function resize() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const newColumns = Math.floor(canvas.width / fontSize);
    ctx.font = `${fontSize}px monospace`;
    
    if (newColumns > columns) {
      for (let i = columns; i < newColumns; i++) {
        drops[i] = 0;
      }
    } else if (newColumns < columns) {
      drops.length = newColumns;
    }
    
    columns = newColumns;
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.textBaseline = 'top';
    
    // draw and update fading text
    for (let i = fadingTexts.length - 1; i >= 0; i--) {
      const fadingText = fadingTexts[i];
      
      ctx.fillStyle = `rgba(47, 13, 104, ${fadingText.opacity})`;
      ctx.fillText(fadingText.text, fadingText.x, fadingText.y);
      
      // fade the text
      fadingText.opacity -= 0.05; 
      
      if (fadingText.opacity <= 0) {
        fadingTexts.splice(i, 1);
      }
    }
    
    ctx.fillStyle = '#2f0d68';
    
    for (let i = 0; i < columns; i++) {
      const text = words[Math.floor(Math.random() * words.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      
      ctx.fillText(text, x, y);
      
      fadingTexts.push({
        x: x,
        y: y,
        text: text,
        opacity: 1.0
      });
      
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  onMount(() => {
    ctx = canvas.getContext('2d')!;
    resize();
    
    window.addEventListener('resize', resize);
    intervalId = setInterval(draw, 80);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', resize);
    };
  });
</script>

<style>
  canvas {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: -10;
    background: #000;
  }
</style>

<canvas bind:this={canvas}></canvas>