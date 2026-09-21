<script lang="ts">
  import { onMount } from 'svelte';
  import SectionDivider from '$lib/../components/SectionDivider.svelte';
  import TextBox from '$lib/../components/TextBox.svelte';
  import SearchableSelect from '$lib/../components/SearchableSelect.svelte';

  type Tab = 'predict' | 'results';
  let tab = $state<Tab>('predict');

  interface Matchup {
    team1: string;
    team2: string;
    favored_team: string | null;
    margin: number;
    predicted_score_diff: number;
    model_season: number;
  }
  interface Record {
    wins: number;
    losses: number;
    pushes: number;
    n: number;
    win_rate: number | null;
  }
  interface Records {
    overall: Record;
    good: Record;
    great: Record;
    best: Record;
  }
  interface Performance {
    season: number | null;
    season_to_date: Records | null;
    last_week: { week: number; records: Records } | null;
  }

  // teams
  let teams = $state<string[]>([]);
  let season = $state<number | null>(null);
  let teamsError = $state('');

  // predict
  let team1 = $state<string | null>(null);
  let team2 = $state<string | null>(null);
  let predicting = $state(false);
  let matchup = $state<Matchup | null>(null);
  let predictError = $state('');

  // results
  let perf = $state<Performance | null>(null);
  let perfLoading = $state(false);
  let perfError = $state('');
  let perfLoaded = false;

  const canPredict = $derived(!!team1 && !!team2 && team1 !== team2 && !predicting);

  onMount(loadTeams);

  async function loadTeams() {
    try {
      const r = await fetch('/api/cfb/teams');
      if (!r.ok) throw new Error();
      const data = await r.json();
      teams = data.teams ?? [];
      season = data.season ?? null;
    } catch {
      teamsError = 'Could not load the team list right now.';
    }
  }

  async function predict() {
    if (!team1 || !team2) return;
    predicting = true;
    predictError = '';
    matchup = null;
    try {
      const r = await fetch(`/api/cfb/matchup?team1=${encodeURIComponent(team1)}&team2=${encodeURIComponent(team2)}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error ?? 'Prediction failed');
      matchup = data;
    } catch (e) {
      predictError = (e as Error).message || 'Prediction failed';
    } finally {
      predicting = false;
    }
  }

  async function loadPerformance() {
    perfLoaded = true;
    perfLoading = true;
    perfError = '';
    try {
      const r = await fetch('/api/cfb/performance');
      if (!r.ok) throw new Error();
      perf = await r.json();
    } catch {
      perfError = 'Could not load results right now.';
    } finally {
      perfLoading = false;
    }
  }

  function selectTab(t: Tab) {
    tab = t;
    if (t === 'results' && !perfLoaded) loadPerformance();
  }

  function fmt(rec: Record): string {
    if (rec.n === 0 || rec.win_rate === null) return 'no picks yet';
    const wl = rec.pushes ? `${rec.wins}-${rec.losses}-${rec.pushes}` : `${rec.wins}-${rec.losses}`;
    return `${wl} (${(rec.win_rate * 100).toFixed(1)}%)`;
  }

  const TIERS: { key: keyof Records; label: string }[] = [
    { key: 'overall', label: 'Overall' },
    { key: 'good', label: 'Good picks (≥59.5%)' },
    { key: 'great', label: 'Great picks (≥64.5%)' },
    { key: 'best', label: 'Best picks (≥69.5%)' }
  ];
</script>

<svelte:head>
  <title>CFB Model</title>
</svelte:head>

<main class="mx-auto max-w-[900px] px-4 py-12 sm:px-8">
  <SectionDivider name="College Football Model" id="cfb-model" />

  <div class="mb-8">
    <TextBox>
      <div class="text-center">
        <p class="mx-auto text-gray-400">
          Each FBS team has its own model trained on rolling team stats, roster talent, and SP+
          ratings. To predict a matchup, both teams' models are used and the result is a projected
          scoring margin i.e. the model's estimated spread. Pick any two teams below to see who it
          favors, or switch to Results for how the model has done against the spread during the most recent season.
        </p>
      </div>
    </TextBox>
  </div>

  <!-- tab toggle -->
  <div class="mx-auto mb-8 flex w-fit rounded-lg border border-slate-700 bg-slate-800/50 p-1">
    {#each [{ id: 'predict', label: 'Predict' }, { id: 'results', label: 'Results' }] as t}
      <button
        class={'rounded-md px-5 py-1.5 text-sm font-medium transition-colors duration-200 ' +
          (tab === t.id ? 'bg-violet-600 text-white' : 'text-gray-300 hover:text-violet-300')}
        onclick={() => selectTab(t.id as Tab)}
      >
        {t.label}
      </button>
    {/each}
  </div>

  {#if tab === 'predict'}
    <section class="mx-auto max-w-[700px]">
      {#if teamsError}
        <p class="text-center text-sm text-red-400">{teamsError}</p>
      {/if}

      <div class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end">
        <div class="flex-1">
          <SearchableSelect options={teams} bind:value={team1} label="Team 1" placeholder="Search teams…" />
        </div>
        <div class="pb-2 text-center font-bold text-violet-300 sm:pb-3">vs.</div>
        <div class="flex-1">
          <SearchableSelect options={teams} bind:value={team2} label="Team 2" placeholder="Search teams…" />
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <button
          class="rounded bg-violet-600 px-6 py-2 font-medium text-white transition-colors duration-200
                 hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canPredict}
          onclick={predict}
        >
          {predicting ? 'Predicting…' : 'Predict'}
        </button>
      </div>

      {#if predictError}
        <p class="mt-6 text-center text-sm text-red-400">{predictError}</p>
      {/if}

      {#if matchup}
        <div class="mt-8">
          <TextBox>
            <div class="text-center">
              {#if matchup.favored_team}
                <p class="text-lg font-bold text-white">
                  {matchup.favored_team} favored by {matchup.margin.toFixed(1)}
                </p>
                <p class="mt-1 text-sm text-gray-400">
                  {matchup.team1} vs. {matchup.team2} · projected margin
                  {matchup.predicted_score_diff.toFixed(1)}
                </p>
              {:else}
                <p class="text-lg font-bold text-white">Pick'em — no projected favorite</p>
                <p class="mt-1 text-sm text-gray-400">{matchup.team1} vs. {matchup.team2}</p>
              {/if}
            </div>
          </TextBox>
        </div>
      {/if}
    </section>
  {:else}
    <section class="mx-auto max-w-[700px]">
      {#if perfLoading}
        <p class="text-center text-sm text-gray-400">Loading results…</p>
      {:else if perfError}
        <p class="text-center text-sm text-red-400">{perfError}</p>
      {:else if perf && (perf.season_to_date || perf.last_week)}
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {#if perf.season_to_date}
            <div class="rounded-lg border border-slate-700/50 bg-slate-800/50 p-5">
              <h3 class="mb-3 font-bold text-violet-300">Season {perf.season} to date</h3>
              <dl class="space-y-2 text-sm">
                {#each TIERS as t}
                  <div class="flex justify-between gap-4">
                    <dt class="text-gray-400">{t.label}</dt>
                    <dd class="text-gray-200">{fmt(perf.season_to_date[t.key])}</dd>
                  </div>
                {/each}
              </dl>
            </div>
          {/if}
          {#if perf.last_week}
            <div class="rounded-lg border border-slate-700/50 bg-slate-800/50 p-5">
              <h3 class="mb-3 font-bold text-violet-300">Week {perf.last_week.week}</h3>
              <dl class="space-y-2 text-sm">
                {#each TIERS as t}
                  <div class="flex justify-between gap-4">
                    <dt class="text-gray-400">{t.label}</dt>
                    <dd class="text-gray-200">{fmt(perf.last_week.records[t.key])}</dd>
                  </div>
                {/each}
              </dl>
            </div>
          {/if}
        </div>
        <p class="mt-4 text-center text-xs text-gray-500">
          Win rates are against the spread and exclude pushes. Higher-confidence tiers are based on the model's
          own historical success rate.
        </p>
      {:else}
        <p class="text-center text-sm text-gray-400">No graded results yet this season.</p>
      {/if}
    </section>
  {/if}
</main>
