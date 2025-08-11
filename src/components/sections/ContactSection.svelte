<script lang="ts">
	import FloatingBlobImage from '../FloatingBlobImage.svelte';
	import { matrixMode } from '$lib';
	import AolImageLoader from '../matrix/AOLImageLoader.svelte';
	
	const MailIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
	const LinkedinIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>`;
	const GithubIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`;
	const MapPinIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
	const ExternalLinkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6"></path><path d="m10 14 9-9"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>`;

	const contactInfo = {
		name: "Blaize Lahman",
		title: "Contact Me",
		description: "I'm always interested in exploring new opportunities, collaborating on development, or just talking. Feel free to send me an email!",
		email: "blermdotdev@gmail.com",
		linkedin: "https://linkedin.com/in/blaizelahman",
		github: "https://github.com/blaizerlahman",
		location: "Madison, WI"
	};

	const contactItems = [
		{
			type: 'email',
			value: contactInfo.email,
			href: `mailto:${contactInfo.email}`,
			icon: MailIcon,
			label: 'Email'
		},
		{
			type: 'linkedin',
			href: contactInfo.linkedin,
			icon: LinkedinIcon,
			label: 'LinkedIn'
		},
		{
			type: 'github',
			value: 'blaizerlahman',
			href: contactInfo.github,
			icon: GithubIcon,
			label: 'GitHub'
		},
		{
			type: 'location',
			value: contactInfo.location,
			href: `https://maps.google.com/?q=${encodeURIComponent(contactInfo.location)}`,
			icon: MapPinIcon,
			label: 'Location'
		}
	];
</script>

<main class="flex flex-col flex-1">
	<section
		class="flex flex-col md:flex-row-reverse my-6 items-center gap-30 py-8
			   max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10"
	>
		<div class="flex-1 space-y-8 text-left">
			<div class="space-y-4">
				<h1 class="text-4xl sm:text-5xl font-bold leading-tight">
					{contactInfo.title}
				</h1>
				<p class="text-lg text-gray-600 dark:text-gray-300">
					{contactInfo.description}
				</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{#each contactItems as item}
					<a
						href={item.href}
						class="group flex items-center space-x-4 p-4 rounded-lg border border-gray-200 
							   hover:border-violet-300 dark:border-gray-700 dark:hover:border-violet-500
							   transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md"
						target="_blank"
						rel={"noopener noreferrer"}
					>
						<div class="flex-shrink-0 w-5 h-5 text-violet-600 dark:text-violet-400 
								   group-hover:text-violet-700 dark:group-hover:text-violet-300 
								   transition-colors duration-200">
							{@html item.icon}
						</div>
						
						<div class="flex-1 min-w-0">
							<div class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
								{item.label}
							</div>
							<div class="text-gray-900 dark:text-gray-100 group-hover:text-violet-600 
								       dark:group-hover:text-violet-400 transition-colors duration-200 
								       font-medium truncate">
								{item.value}
							</div>
						</div>
						
						
            <div class="flex-shrink-0 w-4 h-4 text-gray-400 group-hover:text-violet-500 
                   transition-colors duration-200">
              {@html ExternalLinkIcon}
            </div> 
					</a>
				{/each}
			</div>
		</div>

		<div class="blob-container relative shrink-0 w-[18rem] h-[18rem] md:w-[20rem] md:h-[20rem] mx-auto">
			{#if !$matrixMode}
				<FloatingBlobImage 
          src="/images/composite_headshot.jpg" 
          alt="Headshot of Blaize Lahman"
          className="w-full h-full rounded-full border-6 object-cover object-center shadow-lg" />
			{:else}
				<AolImageLoader
					src="/images/dithered_composite_headshot.jpeg"
					alt="Dithered Headshot"
					className="w-full h-full rounded-full border-8 border-violet-700
							   object-cover object-center shadow-lg"
				/>
			{/if}
		</div>
	</section>
</main>