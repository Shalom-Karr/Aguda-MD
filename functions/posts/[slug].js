// Cloudflare Pages Function: serve posts.html at /posts/<slug>
// while keeping /posts/<slug> in the URL bar (no redirect).
//
// We fetch /posts (the .html-stripped canonical path) instead of
// /posts.html — fetching the .html form triggers CF's auto-redirect
// to the stripped form, which would propagate back to the user as a
// 308 to /posts?title=<slug>. Fetching /posts directly returns the
// HTML body with no redirect, so the browser stays on /posts/<slug>.
//
// posts.html's inline SEO script reads the slug from the path
// (/posts/<slug>), so the title query param isn't actually needed
// on the rewritten fetch — but we pass it anyway as a fallback for
// any code that still reads from URLSearchParams.

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const slug = context.params.slug;

  const target = new URL('/posts', url.origin);
  target.searchParams.set('title', slug);
  for (const [k, v] of url.searchParams) {
    if (k !== 'title') target.searchParams.set(k, v);
  }

  const response = await context.env.ASSETS.fetch(new Request(target.toString(), context.request));
  // Strip any redirect status the asset server might still set.
  if (response.status >= 300 && response.status < 400) {
    return new Response('Not found', { status: 404 });
  }
  return response;
}
