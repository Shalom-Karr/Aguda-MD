// Cloudflare Pages Function: serve posts.html at /posts/<slug>
// while keeping the clean URL in the address bar.
//
// Why a Function instead of _redirects? Cloudflare Pages' built-in
// .html-stripping (which serves /posts.html at /posts) can intercept
// /posts/<slug> requests and strip the slug before _redirects ever
// runs. Functions sit above all of that.

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const slug = context.params.slug;

  const target = new URL('/posts.html', url.origin);
  target.searchParams.set('title', slug);
  for (const [k, v] of url.searchParams) {
    if (k !== 'title') target.searchParams.set(k, v);
  }

  return context.env.ASSETS.fetch(new Request(target.toString(), context.request));
}
