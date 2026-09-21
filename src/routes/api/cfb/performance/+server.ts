import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rateLimit } from '#lib/utils/rateLimit';
import performance from '#lib/data/cfb/performance.json';

/** Serve the precomputed model performance (regenerated weekly by the Action). */
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
  return json(performance);
};
