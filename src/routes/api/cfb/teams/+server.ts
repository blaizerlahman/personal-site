import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rateLimit } from '#lib/utils/rateLimit';
import teams from '#lib/data/cfb/teams.json';

/** Serve the precomputed team list (regenerated weekly by the CFB Action). */
export const GET: RequestHandler = async ({ request, setHeaders }) => {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('cf-connecting-ip') ??
      'unknown';
    rateLimit(ip);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 429 });
  }

  setHeaders({ 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' });
  return json(teams);
};
