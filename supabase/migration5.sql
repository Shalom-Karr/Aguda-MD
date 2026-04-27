-- =============================================================================
-- migration5.sql
-- -----------------------------------------------------------------------------
-- BCRN program content. Run after migration4.sql.
--
-- Includes:
--   1. ALTER TABLE adds `faq_md` column to programs (separate FAQ content
--      per program, surfaced via posts.html?title=<slug>&view=faq)
--   2. Clears the legacy placeholder programs seeded in migration1
--   3. Inserts the 8 BCRN programs (SNAP, Medicaid, WIC, Energy Assistance,
--      TCA, Child Care Scholarship, Water4All, Transportation Benefits)
--      with both How-To Guide content and FAQ content, published.
--
-- Idempotent — uses ON CONFLICT (slug) DO NOTHING so re-running won't
-- overwrite content the admins have edited via the admin panel.
-- =============================================================================

alter table public.agudah_md_ga_programs
  add column if not exists faq_md text;

-- Drop the placeholder programs from migration1 (they used different slugs)
delete from public.agudah_md_ga_programs
  where slug in (
    'snap-food-supplement-program',
    'medicaid-medical-assistance',
    'wic-women-infants-children',
    'ohep-energy-assistance',
    'section-8-housing-choice-voucher',
    'tca-temporary-cash-assistance'
  );

-- =============================================================================
-- BCRN PROGRAMS
-- =============================================================================
insert into public.agudah_md_ga_programs
  (slug, title, summary, category, icon, content_md, faq_md, is_published)
values

-- ============================================================== 1. SNAP
('snap',
 'SNAP (Food Assistance)',
 'Monthly grocery benefits issued on an EBT card to help eligible Maryland households pay for food.',
 'Food', '🍎',
$md$## Overview

The Supplemental Nutrition Assistance Program (SNAP), formerly known as food stamps, helps eligible Maryland residents pay for groceries. Benefits are issued monthly on an EBT card, which works like a debit card at approved grocery stores and retailers.

You can apply for SNAP online through the [Maryland Benefits portal](https://mymdthink.maryland.gov/).

> **Important:** Do not apply for Medical Assistance through Maryland Benefits. Health coverage applications must be completed through [Maryland Health Connection](https://www.marylandhealthconnection.gov/).

## Eligibility Requirements

To qualify for SNAP, applicants generally must:

- Be a **Maryland resident**.
- Provide a **Social Security number** for every household member included in the application.
- Meet **work requirements** (if applicable): Able-bodied adults ages 18–49 without dependents may need to be working or enrolled in a training program unless exempt.
- Meet **income eligibility limits** based on household size and income.

Eligibility is determined by the local Department of Social Services (DSS) after reviewing your application and documents.

## Application Process

### Step 1: Gather Required Documents

Before starting your application, gather electronic copies of the following:

- **Photo ID** for yourself (and spouse if applicable) — driver's license, passport, etc.
- **Proof of identity** for all household members (birth certificate, naturalization certificate, report of birth abroad, etc.).
- **Social Security cards** (or proof of SSN) for each household member.
- **Proof of residency** (utility bill, lease, or mail showing your address if not listed on your ID).
- **Proof of income** — pay stubs from the last 4 weeks, self-employment records, unemployment, Social Security, child support, etc.
- **Proof of other benefits** received (example: WIC).
- **Housing expenses** — rent, mortgage statement, property taxes.
- **Childcare expenses** (if applicable).
- **Utility bills** (electric, gas, water, heating).
- **Proof of disability** (if applicable).

> **Tip:** Scan and save all documents before starting. Use [iLovePDF](https://www.ilovepdf.com/) for document conversion, merging, and compressing.

### Step 2: Create an Account

1. Visit [Maryland Benefits](https://mymdthink.maryland.gov/).
2. Create an account with your email address (this will be your username).
3. Set a password and fill in your personal details.
4. Check your email and click the link to activate your account.

### Step 3: Complete the Application

1. Log in to the Maryland Benefits portal.
2. Navigate to **Applications** and select **Start a New Application**.
3. When asked which programs you're interested in, select **SNAP**.
4. Fill in your personal information and continue to the household status section.
5. Add household members by clicking **Add someone**. For each member, select "I am applying for benefits for myself" and enter their information.
6. After adding everyone, continue to the **Income and Expenses** section.
7. Choose whether you have available assets. If unsure, skip the question.
8. Upload required documents for each household member.
9. Answer the legal questions.
10. Electronically sign the application and submit.

> **Tip:** Skip general information screens by clicking **Next**. If needed, click **Go Back** to return to the previous page. Enter each income source separately — the system doesn't allow you to select multiple members at once.

### Step 4: Schedule an Interview

- After submission, you'll be prompted to schedule an interview.
- Choose **"On The Phone"** for the interview (instead of "On Site").
- During the interview, your application and documents will be reviewed.

## After Submission

If approved for SNAP, you'll receive a notification with the approval decision and monthly benefits amount. Your EBT card will be mailed to you, and funds will be automatically loaded each month.

## Ongoing Responsibilities

- You must report certain changes (income, address, household size, etc.).
- SNAP requires **recertification every 6–12 months**. A renewal form will appear in your account when it is time to renew.
- Keep copies of all documents and notices for your records.$md$,
$md$## What is SNAP?

SNAP (Supplemental Nutrition Assistance Program) helps eligible households pay for groceries. Benefits are loaded monthly onto an EBT card, which works like a debit card at approved grocery stores.

## Who can apply for SNAP?

Anyone living in Maryland who meets income and household eligibility rules may apply. You do not need to be employed to apply, but some adults may need to meet work requirements.

## Do I need a Social Security number to apply?

You must provide a Social Security number for anyone you want benefits for. Household members who are not applying for benefits may be listed without an SSN.

## What documents do I need?

Common documents include:

- Photo ID
- Proof of identity for household members
- Social Security cards or proof of SSN
- Proof of income (last 4 weeks)
- Proof of address
- Rent or mortgage information
- Utility bills
- Proof of disability (if applicable)

You may submit the application even if you are missing documents, but delays may occur.

## Where do I apply?

Apply online through the [Maryland Benefits portal](https://mymdthink.maryland.gov/).

## Can I apply from my phone?

Yes. The website works on smartphones, tablets, and computers. We recommend you apply on a laptop or desktop to ensure a smooth application process.

## Do I need an interview?

Yes. SNAP applications require an interview which can be completed over the phone as long as you list your phone number in the application. A caseworker will review your application and may ask questions or request documents.

## How long does it take to get approved?

Most applications are processed within 30 days. Some households may qualify for **expedited SNAP** if income and resources are very low.

## How will I receive my benefits?

If approved, an EBT card will be mailed to you. Benefits are loaded automatically each month. The date your benefits get reloaded depends on your last name.

## What can I buy with SNAP?

You can buy most food items, including:

- Fruits and vegetables
- Meat, poultry, and fish
- Dairy products
- Bread and cereals

You **cannot** buy hot prepared foods, alcohol, tobacco, vitamins, or household supplies.

## What changes must I report?

You may need to report changes such as:

- Income changes
- Address changes
- Household size changes
- Employment changes

Always follow instructions in your notices.

## How often do I have to renew?

SNAP requires renewal **every 6–12 months**. A renewal form will appear in your Maryland Benefits account when it is time.$md$,
true),

-- ============================================================== 2. MEDICAID
('medicaid',
 'Medicaid (Medical Assistance)',
 'Free or low-cost health coverage for eligible Maryland residents — doctor visits, hospital care, prescriptions, pregnancy care, and more.',
 'Health', '🏥',
$md$## 1. Check If You Qualify for Medicaid

Medicaid provides free or low-cost health coverage for eligible Maryland residents with low income, including adults, children, pregnant people, and certain other groups. Eligibility depends on household size, income, and residency.

- **Children and pregnant individuals** can often qualify at higher income levels.
- **Non-citizen pregnant people** may be eligible even without a green card or lawful presence.
- **Coverage is year-round**, so you can apply any time of year.

## 2. Gather Needed Information

Before starting your application, collect:

- Names, birthdates, and Social Security Numbers for everyone in your household
- Citizenship or immigration status for each applicant
- Proof of income (pay stubs, employer info, tax returns)
- Proof of Maryland residency
- Any current health insurance information

## 3. Create an Account on Maryland Health Connection

To apply online, create an account at [marylandhealthconnection.gov](https://www.marylandhealthconnection.gov/) — the official site where you'll submit your Medicaid application, check eligibility, and manage your application status.

## 4. Start a Medicaid Application

Once logged in, complete the online application by entering your household, income, and other required information.

You may also:

- Use the Maryland Health Connection mobile app (Enroll MHC) on Apple or Android
- Call Maryland Health Connection at **1-855-642-8572** (TTY available) for phone assistance
- Visit a local health department or local Department of Social Services for in-person help

## 5. Submit Required Verification Documents

After you apply, you might be asked to verify information. You'll get a message telling you what's needed.

Documents you may be asked to submit include:

- Proof of income
- Proof of citizenship or immigration status
- Proof of identity
- Proof of residency
- Social Security Numbers

You can submit documents:

- Online through your Maryland Health Connection account
- Via the mobile app using your phone camera
- By mail with a bar-coded cover sheet (provided in your notice)

> **Important:** Submit documents as soon as requested — your coverage may be pending until they are approved.

## 6. Choose a Managed Care Organization (MCO)

If you are approved for Medicaid, you'll be asked to choose a **Managed Care Organization (MCO)** — the health plan that coordinates care and services for you.

- You can select an MCO based on the doctors you prefer or the coverage you need.
- If you don't choose an MCO, one may be assigned automatically.

## 7. Know When Your Coverage Starts

If you qualify, Medicaid coverage typically begins **on the first day of the month you applied** — even if you apply mid-month.

In some cases, you may be able to get retroactive coverage for medical bills from up to **three months before** you applied, especially for pregnant individuals or with certain requests.

## 8. Get Help If You Need It

If you want assistance:

- Call the Maryland Health Connection support line at **1-855-642-8572**
- Look for free local help such as navigators, certified application counselors, or consumer assistance workers
- Visit a local health department or social services office

## Quick Reminders

- ✓ You can apply online, by phone, or in person
- ✓ Enrolling in Medicaid is year-round — no waiting period like with private plans
- ✓ Respond promptly to requests for verification documents to avoid delays or denial$md$,
$md$## What is Medicaid?

Medicaid provides free health coverage for eligible Maryland residents with limited income. Coverage includes doctor visits, hospital care, prescriptions, pregnancy care, and more at no cost.

You can apply for Medicaid at any time of year through [Maryland Health Connection](https://www.marylandhealthconnection.gov/).

## Who can qualify for Medicaid?

You or your family members may qualify based on:

- Household size
- Household income
- Pregnancy status
- Whether children are in the household

If you are pregnant or have children, you may qualify at higher income levels.

## Can non-U.S. citizens qualify?

**Noncitizen pregnant individuals:** If you are pregnant and not a U.S. citizen, you may still qualify for free health coverage for you and your baby.

Coverage includes:

- Care during pregnancy
- Coverage through 4 months postpartum
- Retroactive coverage up to 3 months before your application (but not before pregnancy began)

## How do I calculate my income for Medicaid?

Eligibility is based on monthly household income and household size. You may be eligible for Medicaid if your monthly income is up to approximately:

| Household size | Adults | Children | Pregnant individuals |
|---:|---:|---:|---:|
| 1 | $1,801 | $4,202 | N/A |
| 2 | $2,433 | $5,677 | $4,654 |
| 3 | $3,065 | $7,152 | $5,863 |
| 4 | $3,698 | $8,630 | $7,075 |
| 5 | $4,330 | $10,104 | $8,284 |
| 6 | $4,962 | $11,579 | $9,493 |
| 7 | $5,596 | $13,057 | $10,705 |
| 8 | $6,228 | $14,532 | $11,914 |
| Each additional person, add | $632 | $1,475 | $1,209 |

## What does Medicaid cover?

Medicaid Managed Care Organizations (MCOs) cover:

- Doctor visits
- Pregnancy care
- Prescription medications
- Hospital care
- Emergency services
- Preventive care and more

## What is the Maryland Children's Health Program (MCHP)?

MCHP provides full health benefits for children under age 19. Children receive care through Managed Care Organizations under Maryland's HealthChoice Program.

## How to Enroll in Medicaid or MCHP

**Step 1: Apply** — Online at [Maryland Health Connection](https://www.marylandhealthconnection.gov/), via the Enroll MHC app (Apple or Android), by phone at **1-855-642-8572**, or by paper application (call 1-855-642-8572 to request one).

**Step 2: Get Free Help** — Free local assistance is available to help you apply and choose coverage.

**Step 3: Submit Documents** — You may be asked to submit verification documents.

**Step 4: Choose a Doctor and MCO** — After approval, select a Managed Care Organization and primary doctor.$md$,
true),

-- ============================================================== 3. WIC
('wic',
 'WIC (Women, Infants & Children)',
 'Healthy food, infant formula, and nutrition support for pregnant women, new mothers, and children under age 5.',
 'Family', '👶',
$md$## Step 1: See If You May Qualify

You may qualify for WIC if you:

- Live in Maryland
- Are pregnant, postpartum, or have a child under age 5
- Meet income guidelines
- Have a nutritional need (checked at your appointment)

*Many working families qualify, so it's worth applying even if you're unsure.*

## Step 2: Contact a WIC Office

Call your local WIC office to schedule an appointment. They will tell you what documents to bring and how to submit them.

The closest Baltimore WIC office is located at:

**4155 Patterson Ave, Baltimore, MD 21215**

Call WIC at **443-900-1135** to schedule your WIC appointment.

## Step 3: Gather Documents

Common documents include:

- Photo ID
- Proof of address
- Proof of income
- Proof of pregnancy or child's age (if applicable)

## Step 4: Attend Your Appointment

At your WIC appointment:

- Staff will review your documents
- Check height/weight or basic health info
- Talk with you about nutrition

## Step 5: Receive Benefits

If approved, you'll get a WIC card loaded monthly with healthy food benefits like:

- Milk, eggs, cereal, and whole grains
- Fruits and vegetables
- Baby formula or baby food (if applicable)

> Use your benefits each month — they do not roll over.$md$,
$md$## What is WIC?

WIC is a program that helps pregnant women, new moms, infants, and children under age 5 get healthy food and nutrition support.

## Who can qualify for WIC?

You may qualify if you:

- Live in Maryland
- Are pregnant, postpartum, or have a child under 5
- Meet income guidelines
- Have a nutritional need identified at your appointment

Many working families qualify.

## How do I apply for WIC?

Call your local WIC office to schedule an appointment. They will explain what documents you need and how to submit them.

## What documents do I need?

Common documents include:

- Photo ID
- Proof of address
- Proof of income
- Proof of pregnancy or child's age (if applying for a child)

Your WIC office will tell you exactly what to bring.

## What happens at the WIC appointment?

At your appointment, WIC staff will:

- Review your documents
- Check basic health info (like height/weight)
- Talk with you about nutrition
- Determine eligibility

## What benefits do I get with WIC?

If approved, you receive a WIC card loaded monthly with healthy food benefits such as:

- Milk, eggs, cereal, and whole grains
- Fruits and vegetables
- Baby formula or baby food (if applicable)

Benefits are reloaded monthly.

## Do WIC benefits roll over each month?

No. Benefits must be used each month or they expire.

## How do I know which foods I can buy?

You'll know your approved foods through:

- **Your WIC Food List** — shows what foods and amounts you can buy
- **The WIC App** — lets you check benefits and scan items to see if they're approved
- **Store Receipts** — show what you used and what remains
- **Your WIC Office** — they can explain and print your food list$md$,
true),

-- ============================================================== 4. ENERGY ASSISTANCE
('energy-assistance',
 'Energy Assistance',
 'Help paying electric, gas, and heating bills through Maryland''s Office of Home Energy Programs (OHEP).',
 'Energy', '⚡',
$md$## Overview

Maryland's Energy Assistance programs help eligible households pay their utility bills and avoid service shut-offs. Benefits are paid directly to the utility company as a credit on your account (you do not receive cash).

You can apply online through the [Maryland Benefits portal](https://mymdthink.maryland.gov/).

Common Energy Assistance programs include:

- **MEAP (Maryland Energy Assistance Program)** — Helps with heating and cooling costs.
- **EUSP (Electric Universal Service Program)** — Helps with electric bills.

> You may apply for Energy Assistance even if you do not receive other benefits.

## Eligibility Requirements

To qualify for Energy Assistance, applicants generally must:

- Be a Maryland resident.
- Be responsible for paying utility costs (electric, gas, heating, etc.).
- Provide a Social Security number for household members.
- Meet income eligibility limits based on household size and income.

Final eligibility is determined by your local Department of Social Services (DSS) after reviewing your application and documents.

## Application Process

### Step 1: Gather Required Documents

- **Photo ID** for yourself (and spouse if applicable).
- **Proof of identity** for household members (birth certificate, naturalization certificate, etc.).
- **Social Security cards** (or proof of SSN), if available.
- **Proof of residency** (lease, utility bill, or mail showing your address).
- **Proof of income** — pay stubs from the last 4 weeks, self-employment records, unemployment, Social Security, child support, etc.
- **Most recent utility bill(s)** showing the account number and service address.
- **Proof of housing costs** — rent or mortgage statement.
- **Proof of disability** (if applicable).

> **Tip:** Scan and save all documents before starting. Use [iLovePDF](https://www.ilovepdf.com/) for document conversion.

### Step 2: Create an Account

1. Visit [Maryland Benefits](https://mymdthink.maryland.gov/).
2. Create an account with your email address (this will be your username).
3. Set a password and fill in your personal details.
4. Check your email and click the link to activate your account.

### Step 3: Complete the Application

1. Log in to the Maryland Benefits portal.
2. Navigate to **Applications** and select **Start a New Application**.
3. When asked which programs you're interested in, select **Utilities Assistance (OHEP)** and click **Yes, check utility programs**.
4. Fill in your personal information and continue to the household status section.
5. Add household members by clicking **Add someone**. For each member, select "I am applying for benefits for myself" and enter their information.
6. After adding everyone, continue to the **Income and Expenses** section.
7. Choose whether you have available assets. If unsure, skip the question.
8. **Energy Assistance Programs** — Select:
   - USPP: No
   - EUSP: Yes
   - Energy Efficiency Improvements: No
   - MEAP: Yes
9. Upload required documents for each household member.
10. Answer the legal questions.
11. Electronically sign the application and submit.

### Step 4: Interview (If Required)

Some households may be contacted for a follow-up interview or clarification.

- Monitor your email, mail, and Maryland Benefits account for messages.
- Respond quickly if DSS requests additional documents.

## After You Apply

- If approved, your Energy Assistance benefit will be credited directly to your utility account.
- You will receive a notice showing the amount approved and which account it was applied to.
- Processing times can vary depending on application volume and document completeness.

## Ongoing Responsibilities

- Report changes such as income, address, or utility provider if requested.
- Energy Assistance is typically applied for **once per program year** (seasonal availability may apply).
- Keep copies of your approval notices and utility statements.$md$,
$md$## What is Energy Assistance?

Energy Assistance helps eligible households pay utility bills. Benefits are paid directly to the utility company as a credit on your account.

## What programs are included?

Common programs include:

- **MEAP (Maryland Energy Assistance Program)** — helps with heating and cooling costs.
- **EUSP (Electric Universal Service Program)** — helps with electric bills.

## Do I have to receive SNAP or other benefits to get Energy Assistance?

No. You can apply for Energy Assistance even if you do not receive SNAP or other benefits.

## Who can apply?

Households that live in Maryland, pay utility costs, and meet income guidelines may apply.

## What documents do I need?

Common documents include:

- Photo ID
- Proof of residency
- Proof of income
- Most recent utility bill showing account number
- Rent or mortgage statement
- Social Security numbers

## Where do I apply?

Apply online through the [Maryland Benefits portal](https://mymdthink.maryland.gov/).

## How will I receive the funds?

Approved benefits are sent directly to your utility company as a credit.

## Do I need an interview?

Some households may be contacted for clarification or additional documents. Not all applications require an interview.

## How long does processing take?

Processing times vary depending on volume and document completeness. Applying early in the season helps avoid delays.

## How often can I apply?

Energy Assistance is usually available once per program year.

## Do I need to have a shut-off notice in order to apply for Energy Assistance?

**No, you do not need and should not wait for a shut-off notice** before applying for Energy Assistance. If you meet the guidelines for applying, you should apply, even if you do not have a shut-off notice.

## What changes should I report?

Report changes if requested, including:

- Income changes
- Address changes
- Utility provider changes

## Can I reapply next year?

Yes. You must submit a new application each program year.$md$,
true),

-- ============================================================== 5. TCA
('tca',
 'Temporary Cash Assistance (TCA)',
 'Monthly cash benefit for Maryland families with children who need short-term financial support while working toward self-sufficiency.',
 'Income', '💵',
$md$## What is Temporary Cash Assistance (TCA)?

Temporary Cash Assistance (TCA) is Maryland's cash benefit program for families with dependent children who need short-term financial support to meet basic needs while working toward self-sufficiency through work activities.

## Step 1 — See If You Might Qualify

You may be eligible if your family has:

- **Dependent children** (typically under age 18), or a child under 19 who is a full-time student
- **Low income** — your household income must be below state limits
- You **live in Maryland** and are a U.S. citizen or qualified non-citizen

> **Please note:** Your TCA cash benefit amount depends on your household size and income. The state looks at how much money your household makes and compares it to a set limit for your family size. If your income is over the limit, you will not qualify. **The only way to know for sure if you qualify is to submit an application.**

## Step 2 — Gather Required Documents

When you apply, you'll need documents to verify your situation. Common documents include:

- Photo ID (driver's license, state ID)
- Proof of Maryland residency (lease, utility bill)
- Proof of income (pay stubs, employer letter, unemployment statements)
- Social Security Numbers for household members
- Proof of household composition (birth certificates, custody papers)
- Proof of employment or job search efforts (if already working)

> Local offices may ask for additional proofs — bring as much documentation as you have.

## Step 3 — Apply for TCA

You can apply for Temporary Cash Assistance in multiple ways:

### 1. Apply Online (Preferred Method)

Apply through the [Maryland Benefits Portal](https://mymdthink.maryland.gov/) — the main online application site for TCA and other public benefits.

Create or sign into your account, and start a new application for "Temporary Cash Assistance." Input all requested information, upload the required documents, and sign and submit your application.

### 2. Apply In Person

Visit your local Department of Social Services (DSS) office to submit your application and documents.

### 3. Apply by Mail, Fax, or Drop-Off

Some local DSS offices accept applications submitted by mail, fax, or dropped off in person.

### 4. Call for Help

If you need support with the application process, call **1-800-332-6347** (DHS Customer Service).

## Step 4 — Complete Your Interview

After you submit your application and documents, you will usually be scheduled for an interview with a caseworker. To ensure that your interview will be over the phone rather than in person, make sure you add your phone number to the application.

During the interview, topics will include:

- Household income and employment
- Work requirements and job readiness
- Cooperation with child support
- Household composition

Bring your documents with you, and be ready to explain your situation clearly.

## Step 5 — After You Apply

**Processing Time:** TCA applications may take several weeks to process. If you are eligible, you will be notified in writing.

**Benefit Payments:** If approved, you will receive benefits through an electronic benefit transfer (EBT) card or sometimes by check. You can ask for direct deposit if preferred.

## Step 6 — Follow Program Rules

To continue receiving benefits:

- Attend and participate in required work activities
- Report income or household changes promptly
- Cooperate with child support and substance screening requirements

> Failure to comply with program rules can result in sanctions or reduced benefits.

TCA benefits are usually limited to **60 months (five years) over a lifetime**, with some hardship exceptions.

## Step 7 — Know Your Rights

If your application is denied, or benefits are reduced or closed, you have the right to:

- Request a written notice explaining the decision
- Appeal the decision within the time frame listed on the notice
- Continue benefits in some cases if you request a hearing quickly after adverse action

Appeal instructions are included with your decision letter.$md$,
$md$## What is Temporary Cash Assistance (TCA)?

TCA is a Maryland program that provides cash assistance to families with children who need short-term financial help while working toward self-sufficiency.

## Who can get TCA?

You may qualify if:

- You have a dependent child under age 18 (or under 19 if the child is a full-time student)
- Your household has low income
- You live in Maryland
- You are a U.S. citizen or qualified non-citizen

## How does income affect eligibility?

- Your benefit depends on your household size and income
- The state compares your income to a limit for your family size
- If your income is over the limit, you will not qualify
- **The only way to know for sure is to apply**

## What documents do I need to apply?

Common documents include:

- Photo ID
- Proof of Maryland residency (lease or utility bill)
- Proof of income (pay stubs, unemployment letters, etc.)
- Social Security Numbers for household members
- Birth certificates or custody papers for children
- Proof of employment or job search (if working)

Local offices may ask for more, so bring what you have.

## How do I apply for TCA?

You can apply in several ways:

- **Online (best option):** [Maryland Benefits Portal](https://mymdthink.maryland.gov/)
- **In person:** at your local Department of Social Services (DSS)
- **By mail, fax, or drop-off:** some DSS offices allow this
- **By phone for help:** 1-800-332-6347

## Will I have an interview?

Yes. Most applicants have an interview with a caseworker. You can schedule a phone interview if you include your phone number on the application.

Topics may include:

- Income and employment
- Work requirements
- Child support cooperation
- Household members

Have your documents ready and be prepared to explain your situation.

## How long does it take to get approved?

- Processing can take several weeks
- You will get a written notice with the decision and will receive a response in the portal

## How are benefits paid?

If approved, benefits are usually given by:

- EBT card (similar to a debit card)
- Sometimes a check
- You may request direct deposit

## What do I need to do to keep getting TCA?

You must:

- Participate in required work activities
- Report income or household changes
- Cooperate with child support requirements
- Follow substance screening rules if required

Not following rules can lower or stop benefits.

## Is there a time limit for how long I can receive TCA?

Yes. TCA is usually limited to **60 months (5 years)** over your lifetime, though some hardship exceptions exist.

## What if my application is denied?

You have the right to:

- Get a written explanation
- Appeal the decision
- Request a hearing
- Possibly keep benefits during an appeal

Instructions will be in your decision letter.$md$,
true),

-- ============================================================== 6. CHILD CARE SCHOLARSHIP
('child-care-scholarship',
 'Maryland Child Care Scholarship (CCS)',
 'Helps eligible Maryland families pay for licensed child care and early education through subsidies paid directly to the provider.',
 'Family', '🎓',
$md$The Child Care Scholarship (CCS) — also known as **"vouchers"** — helps eligible Maryland families pay for licensed child care and early education.

Parents can take this subsidy to any licensed and registered provider that accepts CCS. Payments are made directly to the provider, and families are responsible only for their assigned co-pay (based on income) and any costs not covered by the scholarship.

## What CCS Covers

- Licensed childcare centers and family childcare providers
- Before and after-school care for children under 13
- Extended-hour Jewish schools (if registered with CCS) — in these cases, scholarships may offset tuition fees

> ⚠️ **Note:** The institution must be registered to accept CCS. Not all schools are, even if they are licensed.
>
> 💡 **Tip:** Ask your school whether the scholarship is applied in addition to a tuition break or instead of it.

## Who is Eligible?

To qualify, families must:

- Be Maryland residents
- Have parents/guardians who are working, in school, or in an approved training program
  - Both parents must qualify if they live in the same household
  - Kollel study now counts as an approved activity
- Have household income within CCS income guidelines
- Have children who are:
  - Under age 13 (or under 19 with qualifying disabilities)
  - U.S. citizens (parents do not need to be citizens)
  - Immunized per state standards (unless exempt with documentation)

**Notes:**

- Full-time work = 40 hrs/week (the maximum scholarship hours allowed).
- There's no minimum number of hours to apply, but your scholarship amount depends on the overlap of your work/school/training schedule with your child's childcare hours. If you are married, eligibility is based on the overlapping work hours of both parents.

## Application Process

### 1. Gather Documents

You'll need:

- Photo ID (primary caregiver)
- Proof of U.S. citizenship for each child (birth certificate, passport, etc.)
- Proof of ID for all household members
- Proof of Maryland residency (lease, utility bill, etc.)
- Proof of income:
  - Last 4 weeks of pay stubs, or
  - Employer letter with hours & pay rate
  - Self-employed: most recent tax return + Schedule C + attestation form
- Proof of approved activity (work schedule, school/training enrollment)
- Proof of government benefits (SNAP, WIC, SSI, etc.)

> 💡 **Tip:** Scan & save all documents before starting. Use free tools like [iLovePDF](https://www.ilovepdf.com/) to merge or compress files.

### 2. Create an Account

- Go to the **CCS Family Portal** and create an account (or log in if you have created an account before).
- Use your email (username format: `myemail@server.com.msde`).
- Enable text messages — it helps with reminders.

### 3. Fast Track Application

The first time you apply, you need to complete the fast track application which only requires the submission of proof of address and proof of activity/income. Once submitted you will have 15 days to complete the rest of the application.

- Submit proof of address + activity/income
- Processing takes about 3 business days
- If approved, you'll receive a temporary 60-day scholarship
- You must submit the full application within 15 days

> ⏱ **Time:** 45–50 minutes if documents are ready (you can save and return later).

After logging in, go to the **Application Dashboard** and select **Start a New Scholarship Application**.

- Enter all personal details
- After every page click **save and continue**
- If you are married, enter your spouse's details as a co-applicant by clicking **Add Co-Applicant**
- Select **Add Additional Household Member** to add other household members
- Click **Add Child to Request a Child Care Scholarship** for each child

**Provider type:** Unless you are sure that you need another option, choose **Licensed/Registered/Military/Letter of Compliance Facility**. You don't need to choose the specific provider yet.

> **Note:** For school-aged children: early/after care refers to the hours before and after a typical school day. When selecting school times, options are only available in 30-minute increments — always choose the earlier start or later end time.

- Enter the details of your household's assets and income
- Add work activities and edit each entry to add details
- For Kollel, select **Add Other Activity** → education (college)
- Add the child's care schedule
- Upload proof of address, proof of activity, and proof of income
- Electronically sign and submit

### 4. Co-Applicant Signature (if married)

- Spouse/co-applicant must create their own account using the email address that you used when entering the Co-Applicant details
- Log in → Press **Continue Application** → Review & Sign

### 5. Complete the Full Application

- Add household details for all members, children, and co-applicant
- Click the arrow on the right side of each name → choose **edit** → complete the required fields
- Upload: IDs, proof of relationship (birth certificates), proof of citizenship, benefit documentation, proof of income/activity
- Sign & submit again
- The co-applicant must log in and sign too

> 💡 **Tip:** You don't need to enter Social Security numbers unless you want CCS to use them for account lookup later.

### 6. Choose a Provider

- Log in → Select **Scholarship** → **Pending Scholarships** → **Select Child Care Provider**
- Search by provider name (no license number needed)
- Provider must accept your request
- Once approved, scholarship moves into **Approved Scholarships**

## After You're Approved

To keep your scholarship active, you must:

**Validate Attendance**

- Every 2 weeks, log in to confirm your child's attendance in the CCS portal
- Failure to validate on time may cause you to lose your scholarship

**Report Changes within 10 days**

- Income, job, school/training, family size, marital status, or address

**Redetermination (Annual Renewal)**

- Before expiration, submit your redetermination form
- Some families may be auto-renewed (you'll get an email if so)

> ✎ **Tip:** Absences are only recorded when school was in session. Weekends/holidays will not appear as absences.

## Contact Information

- **Online inquiry form:** CCS Contact Form (on the state portal)
- **Phone:** 1-877-227-0125 (better to request answers in writing when possible)$md$,
$md$## What is the Child Care Scholarship (CCS)?

The Child Care Scholarship (CCS), also called "vouchers," helps eligible Maryland families pay for licensed child care and early education. Payments go directly to the provider, and families pay only their assigned co-pay and any uncovered costs.

## What does CCS cover?

CCS may cover:

- Licensed child care centers
- Licensed family child care providers
- Before and after-school care for children under 13
- Extended-hour Jewish schools (if registered with CCS), where scholarships may offset tuition

The provider or school must be registered to accept CCS.

## Can I use CCS at any child care program?

You can use CCS at any licensed and registered provider that accepts CCS. Not all licensed programs accept it, so check with your provider.

## Who is eligible for CCS?

Families must:

- Be Maryland residents
- Have parents/guardians who are working, in school, or in an approved training program
  - If both parents live in the home, both must qualify
  - Kollel study counts as an approved activity
- Meet CCS income guidelines
- Have eligible children who:
  - Are under 13 (or under 19 with qualifying disabilities)
  - Are U.S. citizens (parents do not have to be citizens)
  - Meet immunization requirements (unless exempt with documentation)

## How do parent/legal guardian work hours affect CCS?

- If working full time, you're eligible to receive the maximum amount that CCS covers. **Full-time work is 40 hours/week.**
- There is no minimum hour requirement to apply
- Coverage is based on when parents are working, in school, or in an approved training
- **For married couples, care is covered only during overlapping work hours**

## What documents do I need to apply?

You may need:

- Photo ID for the primary caregiver
- Proof of citizenship for each child
- IDs for household members
- Proof of Maryland residency
- Proof of income (pay stubs, employer letter, or tax documents for self-employed)
- Proof of work/school/training
- Proof of benefits (SNAP, WIC, SSI, etc.)

## How do I apply for CCS?

**Step 1: Create an Account** — Create an account in the CCS Family Portal using your email.

**Step 2: Fast Track Application** — First-time applicants must complete Fast Track:

- Submit proof of address and activity/income
- Processing takes about 3 business days
- If approved, you receive a temporary 60-day scholarship
- You have 15 days to complete the full application

## How long does the application take?

About 45–50 minutes if documents are ready. You can save and return later.

## Do both parents need to sign?

Yes. If married:

- The co-applicant must create their own account
- Both must review and sign

## Do I need to enter Social Security numbers?

No. SSNs are optional and only used for account lookup if you choose.

## Do I need to choose a provider right away?

No. You only select the provider type during the application. After approval, you can search and choose a provider.

## How do I choose a provider after approval?

Log into the portal and search by provider name. You do **NOT** need the license number. The provider must accept your request.

## What do I need to do after approval?

To keep your scholarship:

**Validate attendance** — every 2 weeks in the CCS portal. Missing this may cause loss of benefits.

**Report changes within 10 days** — income, job, school, family size, marital status, or address.

**Complete annual renewal** — submit redetermination before your scholarship expires. Some families are auto-renewed.

## Do absences count against me?

Absences are only recorded when school is in session. Weekends and holidays do not count as absences.

If your child is absent for more than **60 days without a medical form** during the calendar year, an overpayment will be established to recover the funds.

## Who can I contact for help?

- **CCS Contact Form** (online)
- **Phone:** 1-877-227-0125
- Written communication is recommended when possible$md$,
true),

-- ============================================================== 7. WATER4ALL
('water4all',
 'Water4All Baltimore',
 'Discounts and financial assistance on water and sewer bills for eligible Baltimore City residents based on household income.',
 'Utilities', '💧',
$md$## What is Water4All?

Water4All is a program that helps eligible Baltimore City residents get discounts or financial assistance on their water and sewer bills based on household income.

## Who Can Apply?

You may be eligible if you:

- Live in **Baltimore City**, and
- Your household income is **below 200% of the federal poverty level**, and
- You are one of the following:
  - **Homeowner** with your name on the water bill
  - **Tenant with your name on the water bill** who pays the city directly
  - **Tenant not on the water bill** but can show a lease that says you pay water separately or a monthly invoice for water payments

## Step 1 — Gather Your Info

Before you start, collect:

- Your most recent water bill or lease showing water payment responsibility
- Photo ID for each adult in the household
- Proof of income (pay stubs, benefit letters) for adults
- If someone has no income, be ready to explain or provide a zero-income form

## Step 2 — Apply Online or Get a Paper Form

### Online (Recommended)

Visit the Water4All application portal on the Baltimore City website.

### Paper Application

- Call **410-396-5555** to request a paper copy
- Mail or drop off your completed form at:

> **Water4All Application**
> 3939 Reisterstown Rd
> Baltimore, MD 21215

## Step 3 — Submit Your Application

- Upload documents online if applying online
- If mailed, make sure to include all proof with your form
- If you applied before and have a reference ID, use it to check your status online

## Step 4 — What Happens Next

Your application will be reviewed to confirm eligibility.

If approved:

- **Homeowners or billholders** usually get a discount or credit applied to their water/sewer account
- **Tenants not on the bill** typically receive a one-time payment (check or deposit) — you may need to complete IRS Form W-9 if you will be getting a direct payment

## Step 5 — Reapply Each Year

- Water4All eligibility lasts for **one calendar year**
- Before your coverage expires, submit a new application so your assistance continues without a gap

## Where to Get Help

If you have questions or need assistance, call **410-396-5555** or visit the Water4All FAQ page on the city's site for more details.$md$,
$md$## What is Water4All and how does it work?

Water4All calculates the maximum amount a resident should pay for their yearly water and sewer use based on their income and household size. The program then credits the difference between this calculated amount and your estimated annual water bill.

## Who is eligible for Water4All?

You may qualify if you:

- Live in Baltimore City
- Have an income below **200% of the federal poverty level** (for example, less than $64,300/year for a 4-person household), or already participate in a state program with the same income limit
- Are either:
  - **Homeowners:** Your name is on the water bill
  - **Tenants with a billing account:** Your name is on the water bill and you pay the city directly
  - **Tenants without a billing account:** You do not pay the city directly, but can provide:
    - A lease showing you are responsible for water/sewer separate from rent
    - The amount you pay monthly for water/sewer or a copy of monthly invoices

Final eligibility is determined after your application is reviewed and verified.

## How do I apply for Water4All?

- **Apply online** through the Baltimore City Water4All Application portal
- Paper applications are also available
- Completed forms can be dropped off at: **3939 Reisterstown Rd, Baltimore, MD 21215**

## Is the Water4All application changing?

Yes, the application is being improved for a simpler process.

- Homeowner credits will continue as normal.
- Tenant credits will now be issued as one-time payments, which may take a little longer.

## How is the Water4All credit applied?

- **Account holders** (homeowners or tenants with billing accounts) receive a bill credit.
- **Tenants without accounts** will get a check or direct deposit within 90 days of approval.

## Can I apply if I don't have a Social Security Number (SSN)?

Yes, you can still apply.

## If my name isn't on the water bill, how can I get credit?

- **Tenants in single-unit rentals** can ask their landlord to add their name to the water account.
- Landlords can do this by:
  - Email: **dpw.billing@baltimorecity.gov** with the water account number, account holder's info (name, address, phone), and tenant's name
  - Or online: publicworks.baltimorecity.gov/water-billing-questions

## If I applied last year or mid-year, will my application still be processed?

Yes, all applications are processed regardless of submission date.

## How long does the Water4All credit last?

- Eligibility lasts one year
- Credits are applied during that year
- You must submit a new application each year, preferably before your expiration date

## When will I see the Water4All credit on my bill?

Credits may take **up to three months** after approval to appear on your water bill.

## Can the credit be used for rent or other bills?

- Water4All credits are meant to help with water bills.
- For tenants, funds may be sent directly to the landlord depending on your lease.

## Do tenants need to submit Form W-9?

- Yes, only **tenants without a billing account** who receive a direct payment must complete Form W-9.
- This verifies your identity and payment info.
- Form W-9 is **not** sent to the IRS — it's just for verification.

## Who can I contact from Water4All if I have questions?

Call **(410) 396-5555** for more information or clarification.$md$,
true),

-- ============================================================== 8. TRANSPORTATION
('transportation-disabilities',
 'Transportation Benefits for People With Disabilities',
 'Apply for MTA MobilityLink, Call-A-Ride, and UZURV — paratransit services for people who cannot use regular public transportation.',
 'Transportation', '🚌',
$md$This guide explains step-by-step how to apply for **MTA MobilityLink**, what happens during the process, and how to start using **Call-A-Ride** and **UZURV** once you're approved.

## 1. Step One: Apply for MTA MobilityLink

**MobilityLink** is Maryland's paratransit service for people with disabilities who are unable to use regular public transportation (buses, metro, etc.) due to a health or mobility condition.

### How to Get the Application

You can:

- Fill out the online version on the MDOT MTA website
- Or request a paper copy by calling the MTA Mobility Certification Office at **410-764-8181** (select option 6)

### What the Application Includes

The application has two parts:

- **Part A — Rider Information:** You fill out your contact information and describe how your condition affects your ability to travel.
- **Part B — Medical Verification:** Your doctor or healthcare professional must complete this section to confirm your disability and mobility limitations.

### Where to Submit It

You can mail, fax, or email your completed application to:

> **MTA Mobility Certification Office**
> 4201 Patterson Avenue, 1st Floor
> Baltimore, MD 21215
>
> **Fax:** 410-764-7526
> **Email:** MTACertification@mdot.maryland.gov

## 2. Step Two: Schedule and Attend Your Interview

Once the MTA receives your application, they will contact you to schedule an in-person interview or functional assessment.

This interview helps MTA understand your travel needs and determine eligibility.

> If you cannot get to the interview on your own, MobilityLink can arrange transportation for you.

### What to Bring

- A valid photo ID
- Any mobility devices you use (such as a cane, walker, or wheelchair)
- Any additional documents or medical information they request

## 3. Step Three: MobilityLink and Call-A-Ride Approval

When you submit your MobilityLink application and complete your interview, you are **automatically applying for Call-A-Ride** as well. You do not need to submit a separate application.

### If You Are Approved

- You will receive your **MobilityLink ID card** in the mail
- Your card will include your **Mobility ID number**, which you'll need for all paratransit services
- Shortly after, you'll receive a **Call-A-Ride brochure** in the mail listing all the participating transportation companies you can choose from

## 4. Step Four: Using Call-A-Ride

**Call-A-Ride** is a taxi or sedan service that partners with MTA to give Mobility riders more flexibility. Use it instead of a Mobility van when you prefer a faster or more direct ride.

### Cost and Fare Details

- Each ride costs a **flat rate of $3** for the rider
- MTA covers up to **$40** of the total ride cost
- If your trip exceeds $40, you pay the difference

**Example:** If your trip costs $53, you would pay $3 (flat rate) + $13 (amount over $40) = **$16 total**.

You pay your driver directly when you're picked up.

### How to Schedule a Ride

Once you have your brochure, you can call any of the listed transportation providers to schedule your ride. Most riders find that **UZURV** is the best and most convenient option.

## 5. Step Five: Using UZURV

**UZURV** is a specialized ride service that works with MTA's Call-A-Ride program. It functions like Uber or Lyft, but with added accessibility for people with mobility needs.

### How to Get Started

1. Download the **UZURV App** (available on iPhone and Android)
2. Create an account using your name, contact info, and Mobility ID number
3. Once your account is verified, you can start scheduling rides directly through the app

### Scheduling a Ride

- Enter your pickup and drop-off locations
- Choose your ride time and vehicle type (standard or wheelchair-accessible)
- Confirm your ride
- The driver will arrive within your scheduled window

### Paying for Your Ride

- Each ride costs $3, up to a $40 total fare
- If the fare goes over $40, you pay the difference directly through the app or to the driver

> Drivers are professional, trained, and often experienced in assisting passengers with mobility devices.

## 6. Step Six: Enjoying Your Mobility Benefits

Once you're approved and have your Mobility ID card, you can:

- Book rides through **MobilityLink vans**
- Use **Call-A-Ride** for shorter or more flexible trips
- Use **UZURV** through your phone for an on-demand or scheduled experience

You can mix and match these services depending on your needs and schedule.$md$,
$md$## What is MobilityLink?

MobilityLink is Maryland's paratransit service for people with disabilities who cannot use regular public transportation (like buses or metro) because of a health or mobility condition.

## Who should apply for MobilityLink?

Anyone with a disability or health condition that makes it hard or impossible to use regular public transit may apply.

## How do I apply for MobilityLink?

You can:

- Fill out the application online
- Request a paper application by calling **410-764-8181** (option 6)

The application has two parts:

- **Part A: Rider Information** — You complete your personal and travel information.
- **Part B: Medical Verification** — A doctor or healthcare professional must complete this section to verify your disability and mobility needs.

## How do I submit my application?

You can submit it by mail, fax, or email to the MTA Mobility Certification Office.

## What happens after I apply?

MTA will contact you to schedule an interview or functional assessment to better understand your travel needs and determine eligibility.

## What should I bring to the interview?

- A valid photo ID
- Any mobility devices you use (cane, walker, wheelchair, etc.)
- Any additional documents MTA requests

If you cannot get there on your own, MobilityLink can arrange transportation.

## Do I need to apply separately for Call-A-Ride?

No. When you apply for MobilityLink and complete your interview, you are automatically applying for Call-A-Ride.

## What happens if I am approved?

If approved:

- You will receive a **MobilityLink ID card** in the mail
- The card includes your **Mobility ID number**
- You will also receive a **Call-A-Ride brochure** with transportation providers

## What is Call-A-Ride?

Call-A-Ride is a taxi or sedan service for MobilityLink riders who want a faster or more flexible trip than a Mobility van.

## How much does Call-A-Ride cost?

- Flat rider cost: **$3 per ride**
- MTA pays up to **$40 per trip**
- If the trip costs more than $40, you pay the extra amount

**Example:** If a ride costs $53, you pay $3 + $13 = **$16 total**.

## How do I schedule a Call-A-Ride trip?

Call one of the providers listed in your brochure to schedule a ride. Many riders find UZURV to be the most convenient option.

## What is UZURV?

UZURV is a ride service similar to Uber or Lyft but designed for people with mobility needs. It works with the Call-A-Ride program.

## How do I start using UZURV?

1. Download the UZURV app (iPhone or Android)
2. Create an account using your Mobility ID number
3. Wait for account verification
4. Start scheduling rides

## How do I schedule a ride on UZURV?

- Enter pickup and drop-off locations
- Choose ride time
- Select vehicle type (standard or wheelchair-accessible)
- Confirm the ride

## How do I pay for UZURV rides?

- $3 per ride (up to $40 covered)
- Pay extra if over $40
- Payment can be made in the app or to the driver

Drivers are trained and experienced in assisting riders with mobility devices.

## Can I use more than one service?

Yes. Once approved, you can:

- Use MobilityLink vans
- Use Call-A-Ride
- Use UZURV

You can choose whichever works best for your needs and schedule.$md$,
true)

on conflict (slug) do nothing;

-- =============================================================================
-- DONE.
-- -----------------------------------------------------------------------------
-- Verify with:
--   select slug, title, category, is_published, length(content_md) as guide_len,
--          length(faq_md) as faq_len
--   from public.agudah_md_ga_programs order by slug;
-- =============================================================================
