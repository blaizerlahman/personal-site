<script>
	const uid = Math.random().toString(36).substr(2, 9);
	const wiggleId = `wiggle-${uid}`;
</script>

<style>
	:global(.blob-float) {
		animation: blobFloat 8s ease-in-out infinite;
	}
	
	@keyframes blobFloat {
		0%   { transform: translate(0,0)          scale(1)    rotate(0deg);  }
		12%  { transform: translate(45px,-52px)   scale(1.32) rotate(8deg);  }
		25%  { transform: translate(38px,-48px)   scale(1.25) rotate(5deg);  }
		37%  { transform: translate(-22px,18px)   scale(0.92) rotate(-12deg); }
		50%  { transform: translate(-46px,36px)   scale(0.85) rotate(-6deg); }
		62%  { transform: translate(-18px,72px)   scale(1.08) rotate(15deg);  }
		75%  { transform: translate(34px,56px)    scale(1.18) rotate(4deg);  }
		87%  { transform: translate(58px,12px)    scale(1.15) rotate(-8deg);  }
		100% { transform: translate(0,0)          scale(1)    rotate(0deg);  }
	}

	:global(.blob-glow) {
		animation: blobGlow 4s ease-in-out infinite;
	}
	
	@keyframes blobGlow {
		0%   { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4)); }
		25%  { filter: drop-shadow(0 0 35px rgba(139, 92, 246, 0.7)); }
		50%  { filter: drop-shadow(0 0 45px rgba(139, 92, 246, 0.9)); }
		75%  { filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.6)); }
		100% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.4)); }
	}

	:global(.headshot-breathe) {
		animation: headshot 4s ease-in-out infinite;
	}
	
	@keyframes headshot {
		0%   { transform: scale(1) rotate(0deg); }
		50%  { transform: scale(1.02) rotate(1deg); }
		100% { transform: scale(1) rotate(0deg); }
	}

	:global(.test-spin) {
		animation: spin 2s linear infinite;
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>

<main class="flex flex-col flex-1">
	<section
		class="flex flex-col md:flex-row items-center gap-52 py-24
		       max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10">

		<div class="flex-1 space-y-6 text-left">
			<h1 class="text-4xl sm:text-5xl font-bold leading-tight">
				Blaize&nbsp;Lahman
			</h1>
			<p class="max-w-md opacity-80">
				Full-stack&nbsp;Developer • Data&nbsp;Wrangler • Cyber&nbsp;Dabbler
			</p>
			<button
				class="px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors">
				Get in touch
			</button>
		</div>

		<div
			class="relative shrink-0
			       w-[18rem] h-[18rem] md:w-[20rem] md:h-[20rem] mx-auto
			       blob-float">

			<div class="absolute inset-0 -z-10 w-full h-full rounded-full 
			           bg-violet-700 opacity-55 blob-glow"></div>

			<svg viewBox="0 0 100 100"
			     class="absolute inset-0 -z-10 w-full h-full text-violet-700 opacity-30">
				<defs>
					<filter id={wiggleId} x="-20%" y="-20%" width="140%" height="140%">
						<feTurbulence type="fractalNoise"
						              baseFrequency="0.6"
						              numOctaves="2"
						              seed="2"
						              result="noise">
							<animate attributeName="baseFrequency"
							         dur="4s"
							         values="0.6;0.3;0.8;0.6"
							         repeatCount="indefinite"/>
						</feTurbulence>

						<feDisplacementMap in="SourceGraphic"
						                   in2="noise"
						                   scale="20"
						                   xChannelSelector="R"
						                   yChannelSelector="G"/>
					</filter>
				</defs>

				<circle cx="50" cy="50" r="40" 
				        filter="url(#{wiggleId})"
				        fill="currentColor">
					<animate attributeName="r"
					         dur="3s"
					         values="40;35;45;40"
					         repeatCount="indefinite"/>
				</circle>
			</svg>

			<img
				src="/images/landing_headshot.png"
				alt="Head-shot of Blaize Lahman"
				loading="lazy"
				class="w-full h-full rounded-full border-8 border-violet-700
				       object-cover object-center shadow-lg
				       headshot-breathe" />
		</div>
	</section>
</main>