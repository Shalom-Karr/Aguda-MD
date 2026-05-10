// Cloudflare Pages Function: dynamic sitemap.xml.
//
// Queries Supabase for all published programs and emits one <url> per
// program plus the static homepage / book / contact entries. Replaces
// the old hand-maintained sitemap.xml, so admins never need to update
// it when a new guide is published.
//
// Cached 5 minutes at the edge to keep traffic off Supabase.

const SUPABASE_URL  = 'https://qvoxpfigbukidlmshiei.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b3hwZmlnYnVraWRsbXNoaWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTM2OTEsImV4cCI6MjA2NTg2OTY5MX0.CEbyeIw6QiMxbLBhU7x7Re7SL_unWJMyaJQPS9y-k60';

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function onRequest(context) {
  const url    = new URL(context.request.url);
  const origin = url.origin;
  const today  = new Date().toISOString().slice(0, 10);

  // Fetch published programs (slug + updated_at) from Supabase REST.
  let programs = [];
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/agudah_md_ga_programs` +
      `?select=slug,updated_at&is_published=eq.true&order=updated_at.desc`,
      { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
    );
    if (r.ok) programs = await r.json();
  } catch (e) {
    // Fall through with empty list — sitemap still serves static URLs.
  }

  const entries = [
    { loc: `${origin}/`,             lastmod: today, changefreq: 'weekly',  priority: '1.0' },
    { loc: `${origin}/book.html`,    lastmod: today, changefreq: 'monthly', priority: '0.7' },
    { loc: `${origin}/contact.html`, lastmod: today, changefreq: 'monthly', priority: '0.7' },
    ...programs.map(p => ({
      loc: `${origin}/posts/${encodeURIComponent(p.slug)}`,
      lastmod: (p.updated_at || today).slice(0, 10),
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type':  'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
