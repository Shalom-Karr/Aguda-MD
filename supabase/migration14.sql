-- =============================================================================
-- migration14.sql
-- -----------------------------------------------------------------------------
-- 1. Adds an is_listed column to programs so admins can publish a guide to a
--    real URL without it cluttering the homepage grid. Used for cross-
--    reference / supplementary guides like the combined SNAP+Energy guide
--    added below.
-- 2. Inserts the SNAP + Energy Assistance combined-application guide,
--    published but unlisted.
-- 3. Prepends a highlighted callout to the SNAP and Energy Assistance
--    program guides linking visitors to the combined guide. Idempotent
--    via a marker check.
--
-- Safe to re-run.
-- =============================================================================

-- 1. ----- is_listed column ---------------------------------------------------
alter table public.agudah_md_ga_programs
  add column if not exists is_listed boolean not null default true;

create index if not exists agudah_md_ga_programs_listed_idx
  on public.agudah_md_ga_programs (is_listed, sort_order)
  where is_published = true;


-- 2. ----- The combined SNAP + Energy Assistance guide ------------------------
-- Dollar-quoted ($md$ ... $md$) so the markdown body can be pasted in
-- verbatim with no quote escaping.
insert into public.agudah_md_ga_programs
  (slug, title, summary, category, content_md, is_published, is_listed, sort_order)
values (
  'snap-and-energy-assistance',
  'SNAP + Energy Assistance (combined application)',
  'Apply for both SNAP and Energy Assistance through a single application — saves time and avoids submitting the same paperwork twice.',
  'Food',
  $md$## Overview

The **SNAP** (Supplemental Nutrition Assistance Program, formerly known as food stamps) and **Energy Assistance** programs provide financial aid to eligible Maryland residents. These programs help cover essential needs, such as groceries and utility bills.

You can apply for both programs at the same time using a single application through the [MyMDTHINK portal](https://mymdthink.maryland.gov/).

- **SNAP**: Provides monthly funds via an EBT card (similar to a debit card) for groceries.
- **Energy Assistance**: Helps with heating, cooling, and electricity bills through programs like MEAP (Maryland Energy Assistance Program) and EUSP (Electric Universal Service Program). The credit will be automatically applied to your account.

> **Note:** Do not apply for Medical Assistance through this portal. For that, use [Maryland Health Connection](https://www.marylandhealthconnection.gov/).

## Eligibility Requirements

To qualify, applicants must:

- Be a Maryland resident.
- Provide a Social Security number for every household member included in the application.
- Meet work requirements: Able-bodied adults (18–49 years old) without dependents must be employed or enrolled in a training program, unless exempt.
- Meet income eligibility: Check eligibility for [SNAP here](https://dhs.maryland.gov/supplemental-nutrition-assistance-program/) and [Energy Assistance here](https://dhs.maryland.gov/office-of-home-energy-programs/).

## Application Process

### Step 1: Gather Required Documents

Before starting your application, gather the following documents:

1. **Photo ID** for yourself (and spouse if applicable), e.g., driver's license or passport.
2. **Birth certificates** for all household members, or other proof of ID (e.g., Naturalization Certificate, Report of Birth Abroad).
3. **Social Security Cards** for each household member.
4. **Proof of residency** (e.g., utility bill or rental agreement if your address is not listed on your driver's license).
5. **Proof of income**: Include pay stubs from the last 4 weeks, proof of self-employment, etc.
6. **Proof of other government benefits** received (e.g., WIC card).
7. **Proof of housing expenses**: Rent, mortgage, or property tax statements, and childcare costs.
8. **Utility bills** (heating, cooling, electricity).
9. **Proof of Disability** (if applicable).

> **Tip:** Scan and save all documents before starting. Use [iLovePDF](https://www.ilovepdf.com/) for document conversion, merging, and compressing.

### Step 2: Create an Account

1. Visit [Maryland Benefits](https://mymdthink.maryland.gov/).
2. Create an account with your email address (this will be your username).
3. Set a password and fill in your personal details.
4. Check your email and click the link to activate your account.

### Step 3: Complete the Application

1. Log in to the Maryland Benefits portal at [Maryland Benefits](https://mymdthink.maryland.gov/).
2. Navigate to **Applications** and select **Start a New Application**.
3. When asked which programs you're interested in, select **SNAP (Food)** and **Utilities Assistance (OHEP)**. If you would like to automatically apply for **Energy Assistance**, click **Yes, check utility programs**.

> **Tip:** Skip general information screens by clicking **Next**. If needed, click **Go Back** to return to the previous page.

4. Fill in your personal information and continue to the household status section.
5. Add household members by clicking **Add someone**. For each member, select "I am applying for benefits for myself" and enter their information.
6. After adding everyone, continue to the **Income and Expenses** section.

> **Note:** Enter each income source separately; the system doesn't allow you to select multiple members at once.

7. Choose whether you have available assets. If unsure, skip the question (learn more about asset/resource eligibility rules and select dropdown #7 and #8).
8. **Energy Assistance Programs**: Select:
   - **USPP**: No
   - **EUSP**: Yes
   - **Energy Efficiency Improvements**: No
   - **MEAP**: Yes
9. Upload required documents for each household member.
10. Answer the legal questions.
11. Electronically sign the application and submit.

### Step 4: Schedule an Interview

- After submission, you'll be prompted to schedule an interview.
- Choose **"On The Phone"** for the interview (instead of "On Site").
- During the interview, your application and documents will be reviewed.

## After Submission

- **If approved for SNAP:** You'll receive a notification with the approval decision and monthly benefits amount. Your EBT card will be mailed to you, and funds will be automatically loaded each month.
- **If approved for Energy Assistance:** The credit will be applied directly to your utility account.

Both SNAP and Energy Assistance require recertification every 6–12 months. Be sure to update income and household details by completing the benefit review form, which will be uploaded to your account when needed.$md$,
  true,
  false,
  35
)
on conflict (slug) do update
  set title       = excluded.title,
      summary     = excluded.summary,
      category    = excluded.category,
      content_md  = excluded.content_md,
      is_published = excluded.is_published,
      is_listed   = excluded.is_listed,
      sort_order  = excluded.sort_order,
      updated_at  = now();


-- 3. ----- Callout on SNAP and Energy Assistance pages -----------------------
-- Marker is the slug of the combined guide — if the existing content_md
-- already contains a link to it, we assume the callout is already in place
-- and skip the prepend. So this UPDATE is idempotent.
do $$
declare
  callout text := E'> **Applying for both SNAP and Energy Assistance?** You can submit a single combined application for both programs at once — saves time and avoids submitting nearly the same paperwork twice. [See the combined how-to guide →](posts.html?title=snap-and-energy-assistance)\n\n';
begin
  update public.agudah_md_ga_programs
    set content_md = callout || coalesce(content_md, ''),
        updated_at = now()
    where slug in ('snap', 'energy-assistance')
      and (content_md is null or content_md not like '%snap-and-energy-assistance%');
end $$;


-- Verify with:
--   select slug, is_published, is_listed, sort_order
--     from public.agudah_md_ga_programs
--    order by sort_order;
--
--   select slug, left(content_md, 200) from public.agudah_md_ga_programs
--    where slug in ('snap', 'energy-assistance');
