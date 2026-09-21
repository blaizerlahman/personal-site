import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rateLimit } from '#lib/utils/rateLimit';
import data from '#lib/data/cfb/matchups.json';

interface Entry {
  favored_team: string | null;
  margin: number;
  predicted_score_diff: number;
}

const matchups = data.matchups as Record<string, Entry>;

/** Look up a precomputed matchup. Predictions are regenerated weekly. */
export const GET: RequestHandler = async ({ request, url, setHeaders }) => {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('cf-connecting-ip') ??
      'unknown';
    rateLimit(ip);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 429 });
  }

  const team1 = url.searchParams.get('team1')?.trim();
  const team2 = url.searchParams.get('team2')?.trim();

  if (!team1 || !team2) {
    return json({ error: 'Both team1 and team2 are required' }, { status: 400 });
  }
  if (team1.length > 64 || team2.length > 64) {
    return json({ error: 'Invalid team name' }, { status: 400 });
  }
  if (team1 === team2) {
    return json({ error: 'Pick two different teams' }, { status: 400 });
  }

  // The key is the alphabetically-ordered pair; try both orders so we don't
  // depend on JS vs Python sort parity.
  const entry = matchups[`${team1}|${team2}`] ?? matchups[`${team2}|${team1}`];
  if (!entry) {
    return json({ error: 'No prediction available for those teams' }, { status: 404 });
  }

  setHeaders({ 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' });
  return json({
    team1,
    team2,
    favored_team: entry.favored_team,
    margin: entry.margin,
    predicted_score_diff: entry.predicted_score_diff,
    model_season: data.season
  });
};
