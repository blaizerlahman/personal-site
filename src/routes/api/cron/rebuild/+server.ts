import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, fetch }) => {

  // only allow endpoint to be used by cron job
  if (request.headers.get('x-vercel-cron') !== '1') {
    return new Response('Forbidden', { status: 403 });
  }

  const hookURL = process.env.DEPLOY_HOOK_URL;
  if (!hookURL) {
    return new Response('DEPLOY_HOOK_URL not set', { status: 500 });
  }

  const resp = await fetch(hookURL, { method: 'POST' });
  if (!resp.ok) {
    return new Response('Failed to trigger deploy hook', { status: 500 });
  }

  return new Response('Rebuild triggered', { status: 200 });
};
