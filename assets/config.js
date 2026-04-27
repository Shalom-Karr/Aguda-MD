/* ============================================================================
 * SITE CONFIG
 * ----------------------------------------------------------------------------
 * Edit this file to rebrand the site. No other files should need changes
 * for basic customization (name, colors, Calendly link, contact info).
 *
 * For Supabase connection: fill in `supabase.url` and `supabase.anonKey`.
 * If both are empty, the site runs in DEMO MODE using localStorage + seed
 * data, so you can click around without any backend setup.
 * ========================================================================== */

window.SITE_CONFIG = {
  /* Public-facing name and tagline */
  name:      'Agudath Israel of Maryland',
  shortName: 'Agudath Israel of Maryland',
  tagline:   'Protecting • Advocating • Serving — free help applying for government programs in Maryland.',

  /* Contact / booking */
  calendlyUrl:  'https://calendly.com/your-organization',
  contactEmail: 'hello@example.com',
  phone:        '',

  /* How the "Book a Call" button on the homepage behaves.
   *   'external' — clicking the button opens Calendly in a new tab.
   *   'inline'   — Calendly is embedded directly on the homepage.
   * The header "Book a Call" link adapts: scrolls to the embed when inline,
   * or jumps straight to Calendly when external. */
  bookingMode: 'external',

  /* Hero copy (homepage) */
  hero: {
    eyebrow:  'Free assistance',
    heading:  "Applying for government programs shouldn't be this hard.",
    subhead:  'Clear, plain-language guides for food, healthcare, housing, and energy programs — plus a real person you can call if you get stuck.',
    ctaPrimary:   { label: 'Browse programs',    href: '#programs' },
    ctaSecondary: { label: 'Book a free call',   href: '#book' },
  },

  /* Book-a-call section copy */
  book: {
    heading: 'Still have questions?',
    subhead: "Book a free 20-minute call and we'll walk you through your application, step by step.",
    buttonLabel: 'Schedule on Calendly',
  },

  /* Footer copy */
  footer: {
    copyright: '© 2026 Agudath Israel of Maryland. All guides are for informational purposes only.',
  },

  /* Supabase connection.
   * Leave BOTH blank for demo mode (localStorage + seed data).
   * Fill both in for production. The anon key is safe to expose — row-level
   * security on the Supabase side is what protects writes. See docs/DEPLOYMENT.md. */
  supabase: {
    url:     'https://qvoxpfigbukidlmshiei.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b3hwZmlnYnVraWRsbXNoaWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTM2OTEsImV4cCI6MjA2NTg2OTY5MX0.CEbyeIw6QiMxbLBhU7x7Re7SL_unWJMyaJQPS9y-k60',
  },

  /* Categories shown in the admin dropdown and used for card colors.
   * To add a new category, add it here and in the CATEGORY_COLORS maps
   * in index.html / posts.html (or extract those into this config later). */
  categories: ['Food', 'Health', 'Housing', 'Energy', 'Family', 'Income'],
};
