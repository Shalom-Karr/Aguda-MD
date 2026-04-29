/* ============================================================================
 * SITE CONFIG
 * ----------------------------------------------------------------------------
 * Edit this file to rebrand the site. Live values can also be overridden
 * from the admin "Site Settings" tab — those are merged on top of these
 * defaults at page load.
 *
 * For Supabase connection: fill in `supabase.url` and `supabase.anonKey`.
 * If both are empty, the site runs in DEMO MODE using localStorage + seed
 * data, so you can click around without any backend setup.
 * ========================================================================== */

window.SITE_CONFIG = {
  /* Public-facing name and tagline */
  name:      'Baltimore Community Resource Network',
  shortName: 'BCRN',
  tagline:   'Connecting You to Resources That Matter.',

  /* Contact / booking */
  calendlyUrl:  'https://calendly.com/merlbaum-ahavasyisrael/30min',
  contactEmail: 'info@baltcrn.org',
  phone:        '410-775-8525',
  address:      '115 Sudbrook Lane Suite E, Baltimore, MD 21208',

  /* How the "Book a Call" button on the homepage behaves.
   *   'external' — clicking the button opens Calendly in a new tab.
   *   'inline'   — Calendly is embedded directly on the /book page. */
  bookingMode: 'inline',

  /* Master switch for the *general* FAQ section (the site-wide one with
   * questions about language/cost/religion/etc).
   *   true  — FAQ link in header, FAQ teaser on homepage, /faq page live.
   *   false — link removed everywhere, teaser hidden, /faq returns 404.
   * Per-program FAQs (the FAQ tab on each guide) are not affected. */
  faqEnabled: true,

  /* Web3Forms access key for the /contact form. The destination email
   * (where submissions get delivered) is configured in the Web3Forms
   * dashboard, not here — change it there if BCRN wants a different
   * inbox. Not a secret: the key is rate-limited and only sends to the
   * inbox already verified for this account. */
  web3formsKey: '7f3ed223-aa3b-4cd6-bc07-e6470f680bd6',

  /* Hero copy (homepage) */
  hero: {
    eyebrow:  'A project of Ahavas Yisrael & Agudah Maryland',
    heading:  'Connecting You to Resources That Matter',
    subhead:  'We help Maryland residents apply for SNAP, Medicaid, WIC, energy assistance, and more — free, fast, and step-by-step.',
    ctaPrimary:   { label: 'Browse programs', href: '#programs' },
    ctaSecondary: { label: 'Book a free call', href: '#book' },
  },

  /* Programs grid section heading and subhead */
  programsSection: {
    heading: 'Support starts here',
    subhead: 'Helping you navigate the programs you are eligible for',
  },

  /* Book-a-call section copy (shown after the programs grid) */
  book: {
    heading: 'Not sure where to start?',
    subhead: "Book a free 20-minute call. We'll figure out which programs you qualify for and walk you through the next steps.",
    buttonLabel: 'Book a Call',
  },

  /* FAQ page (/faq) copy — heading at the top, then the bottom CTA card */
  faqPage: {
    heading:    'Frequently asked questions',
    subhead:    "Can't find your question? Book a call below.",
    ctaHeading: 'Still stuck?',
    ctaSubhead: "Talk to a real person — it's free.",
    ctaButton:  'Book a free call',
  },

  /* Footer copy — every value here is editable from the admin Site Settings tab.
   * Logo image files (assets/logo-ay.png and assets/logo-aimd.png) are
   * referenced fixed paths; replace those files to change the actual
   * partner logo images. */
  footer: {
    copyright:    '© 2026 Baltimore Community Resource Network. A non-profit organization, not affiliated with any government agency. All guides are for informational purposes only.',
    aboutLabel:   'A project of',
    contactLabel: 'Contact',
    linksLabel:   'Site',
    partner1Name: 'Ahavas Yisrael Charity Fund',
    partner1Url:  'https://ahavasyisrael.org',
    partner2Name: 'Agudath Israel of Maryland',
    partner2Url:  'https://agudathisrael-md.org',
  },

  /* Supabase connection. */
  supabase: {
    url:     'https://qvoxpfigbukidlmshiei.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b3hwZmlnYnVraWRsbXNoaWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyOTM2OTEsImV4cCI6MjA2NTg2OTY5MX0.CEbyeIw6QiMxbLBhU7x7Re7SL_unWJMyaJQPS9y-k60',
  },

  /* Categories shown in the admin dropdown and used for card colors. */
  categories: ['Food', 'Health', 'Housing', 'Energy', 'Family', 'Income', 'Transportation', 'Utilities'],
};
