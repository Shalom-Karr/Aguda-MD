-- =============================================================================
-- migration1.sql
-- -----------------------------------------------------------------------------
-- Run this on an existing database that was set up with the original
-- schema.sql, to add:
--
--   1. agudah_md_ga_settings table  (editable site-wide copy)
--   2. agudah-md-ga-images bucket   (admin-uploadable images)
--   3. RLS policies for both
--   4. Six sample Maryland program guides as DRAFTS (not published)
--
-- Idempotent — safe to re-run.
-- =============================================================================


-- =============================================================================
-- 0. ADD `icon` COLUMN TO PROGRAMS
-- -----------------------------------------------------------------------------
-- Lets each program override the default category emoji shown on its homepage
-- card. Empty string / null means "use the category default".
-- =============================================================================
alter table public.agudah_md_ga_programs
  add column if not exists icon text;


-- =============================================================================
-- 1. SETTINGS TABLE
-- =============================================================================
create table if not exists public.agudah_md_ga_settings (
  id          uuid primary key default gen_random_uuid(),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Ensure exactly one settings row exists.
insert into public.agudah_md_ga_settings (data)
select '{}'::jsonb
where not exists (select 1 from public.agudah_md_ga_settings);

-- Reuse the updated_at trigger function from schema.sql
drop trigger if exists agudah_md_ga_settings_set_updated_at
  on public.agudah_md_ga_settings;
create trigger agudah_md_ga_settings_set_updated_at
  before update on public.agudah_md_ga_settings
  for each row execute function public.agudah_md_ga_set_updated_at();

alter table public.agudah_md_ga_settings enable row level security;

drop policy if exists "Public can read settings" on public.agudah_md_ga_settings;
create policy "Public can read settings"
  on public.agudah_md_ga_settings for select
  using (true);

drop policy if exists "Admins can update settings" on public.agudah_md_ga_settings;
create policy "Admins can update settings"
  on public.agudah_md_ga_settings for update
  to authenticated
  using (public.agudah_md_ga_is_admin())
  with check (public.agudah_md_ga_is_admin());


-- =============================================================================
-- 2. STORAGE BUCKET — agudah-md-ga-images
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('agudah-md-ga-images', 'agudah-md-ga-images', true)
on conflict (id) do nothing;

drop policy if exists "agudah_md_ga_images_public_read" on storage.objects;
create policy "agudah_md_ga_images_public_read"
  on storage.objects for select
  using (bucket_id = 'agudah-md-ga-images');

drop policy if exists "agudah_md_ga_images_admin_insert" on storage.objects;
create policy "agudah_md_ga_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'agudah-md-ga-images' and public.agudah_md_ga_is_admin());

drop policy if exists "agudah_md_ga_images_admin_update" on storage.objects;
create policy "agudah_md_ga_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'agudah-md-ga-images' and public.agudah_md_ga_is_admin())
  with check (bucket_id = 'agudah-md-ga-images' and public.agudah_md_ga_is_admin());

drop policy if exists "agudah_md_ga_images_admin_delete" on storage.objects;
create policy "agudah_md_ga_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'agudah-md-ga-images' and public.agudah_md_ga_is_admin());


-- =============================================================================
-- 3. SAMPLE PROGRAM GUIDES — inserted as DRAFTS (is_published = false)
-- -----------------------------------------------------------------------------
-- These give the admin something to click around on without showing up on the
-- public homepage. Edit them, publish them, or delete them as you see fit.
-- =============================================================================
insert into public.agudah_md_ga_programs (slug, title, summary, category, is_published, content_md)
values
('snap-food-supplement-program',
 'SNAP (Food Supplement Program)',
 'Monthly benefits to help pay for groceries for low-income Maryland households.',
 'Food', false, $md$## What is SNAP?

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

Book a free call with us and we'll walk through the application together.$md$),

('medicaid-medical-assistance',
 'Medicaid (Medical Assistance)',
 'Free or low-cost health insurance for eligible children, adults, pregnant women, and seniors.',
 'Health', false, $md$## What is Medicaid?

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

Every year you must **renew** your Medicaid. Watch for the red envelope from DHS and respond within 30 days or your coverage will end.$md$),

('wic-women-infants-children',
 'WIC (Women, Infants & Children)',
 'Nutrition support, healthy food, and formula for pregnant women, new mothers, and kids under 5.',
 'Family', false, $md$## What is WIC?

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
- You can use your eWIC card at **most major grocery stores** in Maryland.$md$),

('ohep-energy-assistance',
 'OHEP (Energy Assistance)',
 'Help paying electric, gas, and heating bills through Maryland''s Office of Home Energy Programs.',
 'Energy', false, $md$## What is OHEP?

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

Apply **early in the season** (October/November). Funds are limited and the program sometimes runs out by spring.$md$),

('section-8-housing-choice-voucher',
 'Section 8 Housing Choice Voucher',
 'Federal rental assistance that lets you choose your own apartment or house. Long waitlists — apply as early as possible.',
 'Housing', false, $md$## What is Section 8?

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
- [Prince George''s County Housing](https://www.princegeorgescountymd.gov/Housing)
- ...and ~20 more

## What you''ll need

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

**Need help navigating the waitlists?** Book a call — we help people apply strategically to multiple authorities.$md$),

('tca-temporary-cash-assistance',
 'Temporary Cash Assistance (TCA)',
 'Monthly cash benefit for families with children who have very low income, with job-readiness support.',
 'Income', false, $md$## What is TCA?

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

## What you''ll need

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

After approval, you''ll be assigned to **Family Investment Program (FIP)** activities — typically 20-30 hours per week of:

- Job search
- Training or GED classes
- Work experience placement

**Missing activities without a good reason = sanctions** (reduced benefits or case closure).

## Time limits

- Federal lifetime limit: **60 months** of TCA across your lifetime.
- Some exemptions exist (domestic violence, disability) — ask during your interview.

## What comes with TCA

When you''re approved for TCA, you''re **automatically screened** for:
- SNAP (food assistance)
- Medicaid (health)
- Child care vouchers

So you usually don''t need to apply separately for those.$md$)
on conflict (slug) do nothing;

-- =============================================================================
-- DONE.
-- -----------------------------------------------------------------------------
-- Verify with:
--   select count(*) from public.agudah_md_ga_settings;     -- should be >= 1
--   select * from storage.buckets where id = 'agudah-md-ga-images';
--   select slug, title, is_published from public.agudah_md_ga_programs
--     order by created_at desc;                            -- should show 6 drafts
-- =============================================================================
