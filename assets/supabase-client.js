/* ============================================================================
 * PROGRAMS DATABASE LAYER
 * ----------------------------------------------------------------------------
 * Exposes `window.ProgramsDB` with these methods:
 *
 *   listPublished()      → Promise<Program[]>   (only is_published = true)
 *   listAll()            → Promise<Program[]>   (includes drafts)
 *   getBySlug(slug)      → Promise<Program|null>
 *   save(program)        → Promise<Program>     (insert or update)
 *   remove(id)           → Promise<void>
 *
 * Behavior:
 *   - If SITE_CONFIG.supabase is filled in, uses Supabase.
 *   - Otherwise runs in DEMO MODE with localStorage + 6 seed programs.
 *
 * The `Program` shape:
 *   { id, slug, title, summary, content_md, category, is_published,
 *     created_at, updated_at }
 * ========================================================================== */
(function () {
  const cfg = (window.SITE_CONFIG && window.SITE_CONFIG.supabase) || {};
  const USE_SUPABASE = !!(cfg.url && cfg.anonKey);

  window.PROGRAMS_MODE = USE_SUPABASE ? 'supabase' : 'demo';

  /* ------------------------------------------------------------ SEED DATA */
  const SEED = [
    {
      id: 'seed-snap',
      slug: 'snap-food-supplement-program',
      title: 'SNAP (Food Supplement Program)',
      category: 'Food',
      summary: 'Monthly benefits to help pay for groceries for low-income Maryland households.',
      content_md: `## What is SNAP?

The **Food Supplement Program (FSP)** is Maryland's name for SNAP — federal food assistance benefits loaded onto an EBT card each month.

## Who qualifies?

You may qualify if your household's gross monthly income is at or below **200% of the federal poverty level**. For example:

- Household of 1: about $2,510/month
- Household of 2: about $3,408/month
- Household of 4: about $5,200/month

> These limits change yearly. Check the [current MD DHS limits](https://dhs.maryland.gov) before applying.

## What you'll need

1. Photo ID for the head of household
2. Social Security numbers for everyone in the home (or proof of application)
3. Proof of income (last 30 days of pay stubs, benefit letters)
4. Proof of housing costs (rent receipt, mortgage, utility bills)
5. Bank statements (last month)

## How to apply

1. **Online** at [mydhrbenefits.dhr.state.md.us](https://mydhrbenefits.dhr.state.md.us) — fastest option, 20-30 min to complete.
2. **In person** at your local Department of Social Services office.
3. **By phone** — call 1-800-332-6347 to have an application mailed.

## After you apply

- You'll be contacted for an **interview** within a few days (usually by phone).
- If approved, your EBT card arrives within **30 days** of application.
- **Emergency SNAP** may be available within 7 days for households with very low income or resources — ask during your interview.

## Common mistakes to avoid

- **Don't skip the interview** — missing it means automatic denial.
- **Report all income**, including cash side jobs — under-reporting is fraud.
- **Keep copies** of everything you submit.

## Need help?

Book a free call with us and we'll walk through the application together.`,
      is_published: true,
      sort_order: 10,
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-04-10T14:30:00Z',
    },
    {
      id: 'seed-medicaid',
      slug: 'medicaid-medical-assistance',
      title: 'Medicaid (Medical Assistance)',
      category: 'Health',
      summary: 'Free or low-cost health insurance for eligible children, adults, pregnant women, and seniors.',
      content_md: `## What is Medicaid?

Maryland Medicaid (also called **Medical Assistance**) covers doctor visits, hospital care, prescriptions, dental, vision, and mental health — at **no cost** to most eligible people.

## Who qualifies?

Income limits vary by category:

- **Children under 19**: up to 317% of poverty (~$98,000 for a family of 4)
- **Pregnant women**: up to 264% of poverty
- **Adults 19-64**: up to 138% of poverty (~$20,120 for 1 person)
- **Seniors and people with disabilities**: special rules — contact us for help

## What you'll need

- Photo ID and Social Security numbers
- Proof of Maryland residency (lease, utility bill, mail)
- Proof of income (pay stubs, tax return)
- Immigration documents if applicable

## How to apply

1. **Online** at [marylandhealthconnection.gov](https://marylandhealthconnection.gov) — you can apply anytime, not just during open enrollment.
2. **By phone**: 1-855-642-8572
3. **In person**: local Department of Social Services or a certified Navigator.

## After you apply

- Decisions usually come within **45 days** (90 days if disability-based).
- You'll get a letter and a member ID card in the mail.
- Pick an **MCO (Managed Care Organization)** — we recommend comparing what's near you.

## Keep your coverage

Every year you must **renew** your Medicaid. Watch for the red envelope from DHS and respond within 30 days or your coverage will end.`,
      is_published: true,
      sort_order: 20,
      created_at: '2026-02-20T11:00:00Z',
      updated_at: '2026-04-05T09:15:00Z',
    },
    {
      id: 'seed-wic',
      slug: 'wic-women-infants-children',
      title: 'WIC (Women, Infants & Children)',
      category: 'Family',
      summary: 'Nutrition support, healthy food, and formula for pregnant women, new mothers, and kids under 5.',
      content_md: `## What is WIC?

WIC provides **healthy food, infant formula, nutrition counseling, and breastfeeding support** for pregnant women, new mothers, and children up to age 5.

## Who qualifies?

- **Pregnant, postpartum, or breastfeeding women**
- **Infants and children under 5**
- Household income at or below **185% of poverty** (about $57,720 for a family of 4)
- If you get SNAP, Medicaid, or TCA — **you automatically qualify** (income-wise)

## What you'll need at your appointment

1. Photo ID
2. Proof of Maryland residency
3. Proof of income (last 30 days)
4. The child or pregnant woman must be **present** at the first visit for a health screening (height, weight, blood test)

## How to apply

1. Find your nearest WIC clinic at [health.maryland.gov/wic](https://health.maryland.gov/wic).
2. Call to schedule an appointment.
3. Attend the appointment and get your **eWIC card** that day.

## What you get

- Monthly benefits loaded on your eWIC card for specific foods: milk, eggs, bread, cereal, fruits, vegetables, peanut butter, and infant formula.
- **Nutrition counseling** and **breastfeeding support** at every visit.
- **Referrals** to Medicaid, SNAP, and immunization programs.

## Tips

- WIC is NOT counted as public charge for immigration purposes.
- Kids age out at their **5th birthday** — renew every 6-12 months until then.
- You can use your eWIC card at **most major grocery stores** in Maryland.`,
      is_published: true,
      sort_order: 30,
      created_at: '2026-02-25T13:00:00Z',
      updated_at: '2026-04-01T10:00:00Z',
    },
    {
      id: 'seed-ohep',
      slug: 'ohep-energy-assistance',
      title: 'OHEP (Energy Assistance)',
      category: 'Energy',
      summary: "Help paying electric, gas, and heating bills through Maryland's Office of Home Energy Programs.",
      content_md: `## What is OHEP?

The **Office of Home Energy Programs** helps low-income Maryland households pay electric, gas, and heating bills. There are three main programs:

- **MEAP** — Maryland Energy Assistance Program (bill credit)
- **EUSP** — Electric Universal Service Program (arrears + monthly discount)
- **Utility Service Protection Program** — protects against shutoff during winter

## Who qualifies?

Income at or below **175% of poverty** (about $54,600 for a family of 4).

## What you'll need

1. Photo ID for all adults
2. Social Security numbers for everyone in the home
3. **All utility bills** from the past 30 days (electric, gas, propane, oil)
4. Proof of income (last 30 days)
5. Proof of rent or mortgage
6. Proof of Maryland residency

## How to apply

1. **Online**: [dhs.maryland.gov/ohep](https://dhs.maryland.gov/ohep) — fastest.
2. **By mail**: download the application and send to your local OHEP office.
3. **In person**: your local Department of Social Services.

## When to apply

- **Regular heating season**: October through April (priority).
- **Cooling assistance**: available June through September for some households.
- **Crisis**: if you've gotten a shutoff notice, apply **immediately** — same-week help is possible.

## After you apply

- Processing takes **30-50 days** for non-crisis applications.
- Benefits are paid **directly to the utility company** — you'll see the credit on your next bill.
- One application per heating season; come back next year.

## Tip

Apply **early in the season** (October/November). Funds are limited and the program sometimes runs out by spring.`,
      is_published: true,
      sort_order: 40,
      created_at: '2026-03-01T09:00:00Z',
      updated_at: '2026-04-12T15:00:00Z',
    },
    {
      id: 'seed-section8',
      slug: 'section-8-housing-choice-voucher',
      title: 'Section 8 Housing Choice Voucher',
      category: 'Housing',
      summary: "Federal rental assistance that lets you choose your own apartment or house. Long waitlists — apply as early as possible.",
      content_md: `## What is Section 8?

The **Housing Choice Voucher program** pays a portion of your rent directly to your landlord. You pay about **30% of your income** toward rent; the voucher covers the rest.

## Who qualifies?

- Household income **at or below 50% of Area Median Income (AMI)** for your county.
- For example in Baltimore County, 50% AMI for a family of 4 is about $55,000.
- Must pass criminal background check (some felonies disqualify).
- Must be a US citizen or have eligible immigration status.

## The waitlist reality

> **Most Maryland Section 8 waitlists are 2-5 years long.** Some are closed entirely. This is the single most important thing to know.

**Strategy**: apply to **multiple housing authorities** across Maryland when they open. You can be on many waitlists at once.

## Where to apply

Each county/city has its own housing authority. Check openings at:

- [Housing Authority of Baltimore City](https://www.habc.org)
- [Baltimore County Housing](https://www.baltimorecountymd.gov/departments/housing)
- [Montgomery County Housing](https://www.mchousing.org)
- [Prince George's County Housing](https://www.princegeorgescountymd.gov/Housing)
- ...and ~20 more

## What you'll need

1. Photo ID and Social Security numbers for all household members
2. Birth certificates for children
3. Proof of income for the past 12 months
4. Rental history (landlord contacts for the past 5 years)
5. Immigration documents if applicable

## While you wait

- **Keep your address updated** with the housing authority. If they can't reach you, you get dropped from the waitlist.
- Respond to any letters within **10 days** or you may lose your spot.
- Explore other programs: **public housing**, **rapid rehousing**, or **emergency rental assistance** (ERAP).

## Once you get a voucher

- You have **60-120 days** to find a landlord who accepts vouchers.
- The unit must pass an **inspection**.
- You sign a lease with the landlord; the housing authority signs a separate contract.

**Need help navigating the waitlists?** Book a call — we help people apply strategically to multiple authorities.`,
      is_published: true,
      sort_order: 100,
      created_at: '2026-03-05T10:00:00Z',
      updated_at: '2026-04-15T11:30:00Z',
    },
    {
      id: 'seed-tca',
      slug: 'tca-temporary-cash-assistance',
      title: 'Temporary Cash Assistance (TCA)',
      category: 'Income',
      summary: 'Monthly cash benefit for families with children who have very low income, with job-readiness support.',
      content_md: `## What is TCA?

**Temporary Cash Assistance** is Maryland's name for TANF — a monthly cash benefit for families with at least one child under 18 (or under 19 if still in high school).

## Who qualifies?

- Have **at least one dependent child** in the home
- Very low income and limited resources (under $2,000 in most cases)
- Be a Maryland resident and a US citizen or eligible non-citizen
- Participate in **work or job-training activities** (unless exempt)

## How much you get

Monthly amounts depend on family size and income. Example maximums (2026):

- Family of 2: ~$517/month
- Family of 3: ~$656/month
- Family of 4: ~$787/month

## What you'll need

1. Photo ID for all adults
2. Birth certificates for all children
3. Social Security numbers for everyone
4. Proof of Maryland residency
5. Proof of income (all sources, last 30 days)
6. Bank statements
7. Child support orders if applicable

## How to apply

1. **Online** at [mydhrbenefits.dhr.state.md.us](https://mydhrbenefits.dhr.state.md.us).
2. **In person** at your local Department of Social Services.

## The work requirement

After approval, you'll be assigned to **Family Investment Program (FIP)** activities — typically 20-30 hours per week of:

- Job search
- Training or GED classes
- Work experience placement

**Missing activities without a good reason = sanctions** (reduced benefits or case closure).

## Time limits

- Federal lifetime limit: **60 months** of TCA across your lifetime.
- Some exemptions exist (domestic violence, disability) — ask during your interview.

## What comes with TCA

When you're approved for TCA, you're **automatically screened** for:
- SNAP (food assistance)
- Medicaid (health)
- Child care vouchers

So you usually don't need to apply separately for those.`,
      is_published: true,
      sort_order: 50,
      created_at: '2026-03-10T12:00:00Z',
      updated_at: '2026-04-08T16:00:00Z',
    },
  ];

  /* --------------------------------------------------------- DEMO BACKEND */
  const LS_KEY = 'agudah_md_programs_v1';

  function demoLoad() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* fall through */ }
    localStorage.setItem(LS_KEY, JSON.stringify(SEED));
    return SEED.slice();
  }
  function demoSave(list) { localStorage.setItem(LS_KEY, JSON.stringify(list)); }
  function slugify(s) {
    return (s || '')
      .toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  const sortBySortOrder = (a, b) => {
    const sa = (a.sort_order ?? 999), sb = (b.sort_order ?? 999);
    if (sa !== sb) return sa - sb;
    return (b.updated_at || b.created_at || '').localeCompare(a.updated_at || a.created_at || '');
  };

  const demoDB = {
    async listPublished() {
      return demoLoad()
        .filter(p => p.is_published && p.is_listed !== false)
        .sort(sortBySortOrder);
    },
    async listAll() {
      return demoLoad().sort(sortBySortOrder);
    },
    async getBySlug(slug) {
      const list = demoLoad();
      return list.find(p => p.slug === slug && p.is_published) || null;
    },
    async getBySlugAny(slug) {
      const list = demoLoad();
      return list.find(p => p.slug === slug) || null;
    },
    async save(program) {
      const list = demoLoad();
      const now = new Date().toISOString();
      if (program.id) {
        const idx = list.findIndex(p => p.id === program.id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...program, updated_at: now };
          demoSave(list);
          return list[idx];
        }
      }
      const fresh = {
        ...program,
        id: 'local-' + Date.now(),
        slug: program.slug || slugify(program.title),
        created_at: now,
        updated_at: now,
      };
      list.push(fresh);
      demoSave(list);
      return fresh;
    },
    async remove(id) {
      const list = demoLoad().filter(p => p.id !== id);
      demoSave(list);
    },
  };

  /* ----------------------------------------------------- SUPABASE BACKEND */
  async function makeSupabaseDB() {
    // Dynamic import so the CDN script tag doesn't need to be present when unused.
    if (!window.supabase) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    // Persist session only on admin page — public pages don't need auth storage
    // and Edge/Safari tracking prevention blocks localStorage on third-party origins.
    const isAdmin = window.location.pathname.includes('admin');
    const client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: isAdmin, autoRefreshToken: isAdmin, storageKey: 'agudah-md-ga-auth' }
    });
    window.__supabaseClient = client;  // expose for admin auth flow

    const TABLE          = 'agudah_md_ga_programs';
    const ADMINS_TABLE   = 'agudah_md_ga_admins';
    const SETTINGS_TABLE = 'agudah_md_ga_settings';
    const FAQS_TABLE     = 'agudah_md_ga_faqs';
    const IMAGES_BUCKET  = 'agudah-md-ga-images';

    return {
      async listPublished() {
        // is_listed=false hides supplementary guides (e.g. the combined
        // SNAP+Energy guide) from the homepage grid while keeping them
        // accessible by direct URL.
        const { data, error } = await client.from(TABLE)
          .select('*').eq('is_published', true).neq('is_listed', false)
          .order('sort_order', { ascending: true })
          .order('updated_at', { ascending: false });
        if (error) throw error;
        return data || [];
      },
      async listAll() {
        const { data, error } = await client.from(TABLE)
          .select('*')
          .order('sort_order', { ascending: true })
          .order('updated_at', { ascending: false });
        if (error) throw error;
        return data || [];
      },
      async getBySlug(slug) {
        const { data, error } = await client.from(TABLE)
          .select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
        if (error) throw error;
        return data || null;
      },
      async getBySlugAny(slug) {
        const { data, error } = await client.from(TABLE)
          .select('*').eq('slug', slug).maybeSingle();
        if (error) throw error;
        return data || null;
      },
      async save(program) {
        const payload = { ...program, updated_at: new Date().toISOString() };
        if (!program.id) delete payload.id;
        const { data, error } = await client.from(TABLE)
          .upsert(payload, { onConflict: 'id' }).select().single();
        if (error) throw error;
        return data;
      },
      async remove(id) {
        const { error } = await client.from(TABLE).delete().eq('id', id);
        if (error) throw error;
      },

      /* -------- Auth helpers (Supabase mode only) ------------------------ */
      async getCurrentUser() {
        const { data: { session } } = await client.auth.getSession();
        return session ? session.user : null;
      },
      async signIn(email, password) {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
      },
      async signOut() {
        await client.auth.signOut();
      },
      async isAdmin(email) {
        if (!email) return false;
        const { data, error } = await client.from(ADMINS_TABLE)
          .select('email').ilike('email', email).maybeSingle();
        if (error) return false;
        return !!data;
      },

      /* -------- Settings (key/value JSONB) ------------------------------- */
      async getSettings() {
        const { data, error } = await client.from(SETTINGS_TABLE)
          .select('id, data').limit(1).maybeSingle();
        if (error) throw error;
        return data ? { id: data.id, ...(data.data || {}) } : null;
      },
      async saveSettings(settingsData) {
        // Strip the synthetic `id` we added in getSettings()
        const { id: _id, ...rest } = settingsData || {};
        const { data: existing } = await client.from(SETTINGS_TABLE)
          .select('id').limit(1).maybeSingle();
        if (existing) {
          const { error } = await client.from(SETTINGS_TABLE)
            .update({ data: rest }).eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await client.from(SETTINGS_TABLE)
            .insert({ data: rest });
          if (error) throw error;
        }
        return rest;
      },

      /* -------- FAQs ----------------------------------------------------- */
      async listPublishedFaqs() {
        const { data, error } = await client.from(FAQS_TABLE)
          .select('*').eq('is_published', true).is('program_slug', null)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data || [];
      },
      async listHomepageFaqs() {
        const { data, error } = await client.from(FAQS_TABLE)
          .select('*').eq('is_published', true).eq('show_on_homepage', true)
          .is('program_slug', null)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data || [];
      },
      async listFaqPageFaqs() {
        const { data, error } = await client.from(FAQS_TABLE)
          .select('*').eq('is_published', true).eq('show_on_faq_page', true)
          .is('program_slug', null)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data || [];
      },
      async listProgramFaqs(programSlug) {
        const { data, error } = await client.from(FAQS_TABLE)
          .select('*').eq('is_published', true).eq('program_slug', programSlug)
          .order('sort_order', { ascending: true });
        if (error) throw error;
        return data || [];
      },
      async listAllFaqs() {
        const { data, error } = await client.from(FAQS_TABLE)
          .select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        return data || [];
      },
      async saveFaq(faq) {
        const payload = { ...faq, updated_at: new Date().toISOString() };
        if (!faq.id) delete payload.id;
        const { data, error } = await client.from(FAQS_TABLE)
          .upsert(payload, { onConflict: 'id' }).select().single();
        if (error) throw error;
        return data;
      },
      async removeFaq(id) {
        const { error } = await client.from(FAQS_TABLE).delete().eq('id', id);
        if (error) throw error;
      },

      /* -------- Image upload --------------------------------------------- */
      /* -------- Analytics --------------------------------------------------- */
      async trackView(page, pageType, tab, url, screenSize, state) {
        const payload = { page, page_type: pageType };
        if (tab)        payload.tab         = tab;
        if (url)        payload.url         = url;
        if (screenSize) payload.screen_size = screenSize;
        if (state)      payload.state       = state;
        await client.from('agudah_md_ga_page_views').insert(payload);
      },
      async getAnalytics() {
        const todayUTC = new Date().toISOString().slice(0, 10);
        const [siteRes, articleRes, todayRes, pagesRes, byDayRes, rawSiteRes, rawArticleRes] = await Promise.all([
          client.from('agudah_md_ga_page_views').select('*', { count: 'exact', head: true }).eq('page_type', 'site'),
          client.from('agudah_md_ga_page_views').select('*', { count: 'exact', head: true }).eq('page_type', 'article'),
          client.from('agudah_md_ga_page_views').select('*', { count: 'exact', head: true }).gte('viewed_at', todayUTC),
          client.rpc('agudah_md_ga_view_counts'),
          client.rpc('agudah_md_ga_views_by_day', { days_back: 30 }),
          client.from('agudah_md_ga_page_views')
            .select('page, page_type, tab, url, screen_size, state, viewed_at')
            .eq('page_type', 'site')
            .order('viewed_at', { ascending: false })
            .limit(100),
          client.from('agudah_md_ga_page_views')
            .select('page, page_type, tab, url, screen_size, state, viewed_at')
            .eq('page_type', 'article')
            .order('viewed_at', { ascending: false })
            .limit(100),
        ]);
        return {
          siteTotal:    siteRes.count        || 0,
          articleTotal: articleRes.count     || 0,
          today:        todayRes.count       || 0,
          pages:        pagesRes.data        || [],
          byDay:        byDayRes.data        || [],
          raw:          rawSiteRes.data      || [],
          rawArticles:  rawArticleRes.data   || [],
        };
      },

      async uploadImage(file) {
        const ext  = (file.name.split('.').pop() || 'png').toLowerCase();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
        const { error: upErr } = await client.storage
          .from(IMAGES_BUCKET)
          .upload(path, file, { cacheControl: '31536000', upsert: false });
        if (upErr) throw upErr;
        const { data } = client.storage.from(IMAGES_BUCKET).getPublicUrl(path);
        return data.publicUrl;
      },
    };
  }

  /* --------------------------------------------------------------- EXPORT */
  if (USE_SUPABASE) {
    // Lazy init: resolve on first call
    let dbPromise;
    const lazy = (method) => async (...args) => {
      if (!dbPromise) dbPromise = makeSupabaseDB();
      const db = await dbPromise;
      return db[method](...args);
    };
    window.ProgramsDB = {
      mode: 'supabase',
      listPublished:  lazy('listPublished'),
      listAll:        lazy('listAll'),
      getCurrentUser: lazy('getCurrentUser'),
      signIn:         lazy('signIn'),
      signOut:        lazy('signOut'),
      isAdmin:        lazy('isAdmin'),
      getBySlug:      lazy('getBySlug'),
      getBySlugAny:   lazy('getBySlugAny'),
      save:           lazy('save'),
      remove:         lazy('remove'),
      getSettings:    lazy('getSettings'),
      saveSettings:   lazy('saveSettings'),
      listPublishedFaqs: lazy('listPublishedFaqs'),
      listHomepageFaqs:  lazy('listHomepageFaqs'),
      listFaqPageFaqs:   lazy('listFaqPageFaqs'),
      listProgramFaqs:   lazy('listProgramFaqs'),
      listAllFaqs:    lazy('listAllFaqs'),
      saveFaq:        lazy('saveFaq'),
      removeFaq:      lazy('removeFaq'),
      uploadImage:    lazy('uploadImage'),
      trackView:      lazy('trackView'),
      getAnalytics:   lazy('getAnalytics'),
    };
  } else {
    // Demo mode — auth is a no-op (admin page is open in demo)
    demoDB.mode = 'demo';
    demoDB.getCurrentUser = async () => ({ email: 'demo@local' });
    demoDB.signIn  = async () => ({ email: 'demo@local' });
    demoDB.signOut = async () => {};
    demoDB.isAdmin = async () => true;
    const SETTINGS_LS_KEY = 'agudah_md_ga_settings_v1';
    demoDB.getSettings = async () => {
      try { return JSON.parse(localStorage.getItem(SETTINGS_LS_KEY) || 'null'); }
      catch (e) { return null; }
    };
    demoDB.saveSettings = async (data) => {
      const { id: _id, ...rest } = data || {};
      localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(rest));
      return rest;
    };
    demoDB.uploadImage = async (file) =>
      await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload  = () => resolve(r.result);   // data URL — works inline in markdown
        r.onerror = reject;
        r.readAsDataURL(file);
      });

    /* ---------- Demo FAQs (localStorage) ------------------------------- */
    const FAQS_LS_KEY = 'agudah_md_ga_faqs_v1';
    const FAQ_SEED = [
      { id:'faq-1', question:'Is this service really free?', answer:'Yes — 100% free. We never charge to help you apply for a government program. Our work is funded by community donations.', sort_order:10, is_published:true, show_on_homepage:true,  show_on_faq_page:true },
      { id:'faq-2', question:'Do I need to be Jewish or part of a specific community?', answer:'No. We help anyone in Maryland regardless of religion, background, or immigration status.', sort_order:20, is_published:true, show_on_homepage:true,  show_on_faq_page:true },
      { id:'faq-3', question:'Will applying for benefits affect my immigration status?', answer:'Most programs on this site (WIC, Medicaid for kids, school meals, emergency medical) do NOT count against you for public charge. SNAP and cash assistance can in some cases — we recommend booking a call before applying if you have concerns.', sort_order:30, is_published:true, show_on_homepage:true,  show_on_faq_page:true },
      { id:'faq-4', question:'How long do applications take to be approved?', answer:'<ul class="list-disc pl-5 space-y-1"><li>SNAP: 30 days (7 days for emergencies)</li><li>Medicaid: up to 45 days (90 for disability)</li><li>WIC: same-day at your appointment</li><li>Energy Assistance: 30-50 days</li><li>Section 8 vouchers: 2-5 year waitlists typically</li></ul>', sort_order:40, is_published:true, show_on_homepage:true,  show_on_faq_page:true },
      { id:'faq-5', question:'Can you submit the application for me?', answer:"We can't submit on your behalf, but we can sit with you (in person or on a video call) and walk through every question while you fill it out. Many people find that easier than doing it alone.", sort_order:50, is_published:true, show_on_homepage:true,  show_on_faq_page:true },
      { id:'faq-6', question:'What if I was denied?', answer:"You have the right to appeal. Most denials have a 30-90 day appeal window. Book a call and we'll review the denial letter and help you file an appeal.", sort_order:60, is_published:true, show_on_homepage:false, show_on_faq_page:true },
      { id:'faq-7', question:'How do I know my information is safe?', answer:"We don't store your personal information after a call. All application data goes directly to the agency you're applying with — never through us.", sort_order:70, is_published:true, show_on_homepage:false, show_on_faq_page:true },
      { id:'faq-8', question:'What languages do you support?', answer:'English and Yiddish. For other languages, Maryland 211 (dial 211) provides interpreters in 170+ languages for benefits applications.', sort_order:80, is_published:true, show_on_homepage:false, show_on_faq_page:true },
    ];
    function loadFaqs() {
      try {
        const raw = localStorage.getItem(FAQS_LS_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      localStorage.setItem(FAQS_LS_KEY, JSON.stringify(FAQ_SEED));
      return FAQ_SEED.slice();
    }
    function saveFaqs(list) { localStorage.setItem(FAQS_LS_KEY, JSON.stringify(list)); }
    const isSiteWide = (f) => !f.program_slug;
    demoDB.listPublishedFaqs = async () => loadFaqs().filter(f => f.is_published && isSiteWide(f)).sort((a,b) => a.sort_order - b.sort_order);
    demoDB.listHomepageFaqs  = async () => loadFaqs().filter(f => f.is_published && f.show_on_homepage && isSiteWide(f)).sort((a,b) => a.sort_order - b.sort_order);
    demoDB.listFaqPageFaqs   = async () => loadFaqs().filter(f => f.is_published && (f.show_on_faq_page !== false) && isSiteWide(f)).sort((a,b) => a.sort_order - b.sort_order);
    demoDB.listProgramFaqs   = async (slug) => loadFaqs().filter(f => f.is_published && f.program_slug === slug).sort((a,b) => a.sort_order - b.sort_order);
    demoDB.listAllFaqs       = async () => loadFaqs().sort((a,b) => (a.program_slug || '').localeCompare(b.program_slug || '') || (a.sort_order - b.sort_order));
    demoDB.saveFaq = async (faq) => {
      const list = loadFaqs();
      const now  = new Date().toISOString();
      if (faq.id) {
        const idx = list.findIndex(f => f.id === faq.id);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...faq, updated_at: now };
          saveFaqs(list);
          return list[idx];
        }
      }
      const fresh = { ...faq, id: 'local-faq-' + Date.now(), created_at: now, updated_at: now };
      list.push(fresh);
      saveFaqs(list);
      return fresh;
    };
    demoDB.removeFaq = async (id) => {
      saveFaqs(loadFaqs().filter(f => f.id !== id));
    };
    demoDB.trackView   = async () => {};
    demoDB.getAnalytics = async () => ({ siteTotal: 0, articleTotal: 0, today: 0, pages: [] });

    window.ProgramsDB = demoDB;
  }

  window.slugify = slugify;
})();
