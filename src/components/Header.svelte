<script>
    export let y;

    export let tabs = [
        {name: "About Me", link: "/about"},
        {name: "Projects", link: "/projects"},
        {name: "Bookshelf", link: "/bookshelf"},
        {name: "What's Going On", link: "/now"},
        {name: "Contact", link: "/contact"},
    ];
</script>

<header
    class={"sticky z-[10] top-0 duration-300 px-6 flex items-center justify-between border-b border-solid " +
        (y > 0
            ? " py-4 bg-slate-950 border-violet-950"
            : " py-6 bg-transparent border-transparent")}
>
    <h1 class="font-medium">
        <b class="font-bold poppins">Blaize</b> <span class="">Lahman</span>
    </h1>

    <div class="sm:flex items-center gap-4 hidden">
        {#each tabs as tab, index}
            <a
                href={tab.link}
                class="duration-200 hover:text-violet-400"
                target={index === 2 ? "_blank" : ""}
            >
                <p>{tab.name}</p>
            </a>
        {/each}
    </div>
</header>