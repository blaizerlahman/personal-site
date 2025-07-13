<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
  
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
  
    const words = [
      'CYBER', 'SVELTE', 'AWS', 'TYPESCRIPT',
      'REACT', 'POSTGRESQL', 'SQL', 'PYTHON',
      'JAVA', 'GOLANG', 'FULLSTACK', 'DOCKER',
      'AWS_LAMBDA', 'PANDAS'
    ];
    const fontSize = 20;             // size of each step
    let columns: number;             // number of streams
    let drops: number[] = [];        // vertical positions
    let intervalId: ReturnType<typeof setInterval>;
  
    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
      ctx.font = `${fontSize}px monospace`;
    }
  
    function draw() {
      // fade old characters
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      ctx.fillStyle = '#2f0d68';
      ctx.textBaseline = 'top';
  
      for (let i = 0; i < columns; i++) {
        const text = words[Math.floor(Math.random() * words.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
  
        ctx.fillText(text, x, y);
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
      intervalId = setInterval(draw, 60);
  
      return () => {
        clearInterval(intervalId);
        window.removeEventListener('resize', resize);
      };
    });
  </script>
  
  <style>
    /* full-screen, behind all content */
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -10;
      background: #000;
    }
  </style>
  
  <canvas bind:this={canvas}></canvas>
  