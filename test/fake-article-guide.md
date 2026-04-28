## Welcome to the Fake Article

This is a **test program guide** intended only to exercise the admin panel and the public guide page. It walks through every Markdown feature the editor supports, plus a quick crash course on how to use the admin to add or update real programs.

> If you're seeing this on the public site by accident, ignore it — it'll be deleted before the next deploy.

![Friendly placeholder](https://picsum.photos/seed/bcrn-hero/1200/520)

## What this article tests

* All the heading levels you'll need (`##` and `###`)
* Bold, italic, links, lists, blockquotes
* Inline `code` and fenced code blocks
* Images and tables
* Tables of contents (auto-generated from the headings on the right side of the page)
* The "Last updated" timestamp at the top
* The **Need help with this application?** CTA card at the bottom

## A 60-second Markdown primer

Markdown is just plain text with a few special characters that the editor turns into formatted output. Each example below shows the **source** you'd type, then what it **renders as**. You don't have to memorize anything — the toolbar above the editor inserts each of these for you when you click a button.

### Bold and italic

Source:

```
This sentence has **bold words** and *italic words*.
```

Renders as: This sentence has **bold words** and *italic words*.

Shortcut: select the text and press **⌘B** for bold or **⌘I** for italic.

### Links

Source:

```
Visit [our homepage](https://baltcrn.org) for more info.
```

Renders as: Visit [our homepage](https://baltcrn.org) for more info.

Shortcut: select the link text, press **⌘K**, paste the URL into the prompt. External URLs (different host than `baltcrn.org`) automatically open in a new tab; internal links stay in the same tab.

### Headings

Source:

```
## Major section heading
### Sub-section heading
```

Use `##` for major sections — they show up in the floating "On this page" navigation on the right. Use `###` for sub-sections under them. **Don't use a single `#`** — that's reserved for the program title, which the page sets automatically from the Title field above the editor.

### Unordered lists

Source:

```
- First thing
- Second thing
- Third thing
```

Renders as:

- First thing
- Second thing
- Third thing

### Ordered lists

Source:

```
1. First, do this.
2. Then this.
3. Finally this.
```

Renders as:

1. First, do this.
2. Then this.
3. Finally this.

You don't have to keep the numbers correct — Markdown will renumber automatically. So `1. … 1. … 1.` works fine and is easier to edit when you reorder steps later.

### Blockquotes

Source:

```
> Use this for warnings, callouts, or anything that should
> stand out from the surrounding paragraph.
```

Renders as:

> Use this for warnings, callouts, or anything that should
> stand out from the surrounding paragraph.

### Inline code and code blocks

Use single backticks for inline code:

```
Apply at `mydhrbenefits.dhr.state.md.us`.
```

Renders as: Apply at `mydhrbenefits.dhr.state.md.us`.

For longer snippets — a phone script, a sample form answer, a multi-line URL — wrap them in a triple-backtick fence on its own line:

````
```
Hi, my name is [Your Name], and I'm calling about my SNAP application
submitted on [Date]. The case number is [Case #]. I haven't heard back
about the interview yet — could you check the status?
```
````

Renders as:

```
Hi, my name is [Your Name], and I'm calling about my SNAP application
submitted on [Date]. The case number is [Case #]. I haven't heard back
about the interview yet — could you check the status?
```

The opening and closing fences each go on their own line. Anything between them is shown literally — Markdown formatting inside is ignored, so you can write `**not bold**` in a code block without it turning bold.

### Images

Source:

```
![Description of the image](https://example.com/photo.jpg)
```

The text in the brackets is the **alt text** — shown if the image fails to load and read aloud by screen readers — so make it descriptive. The URL is whatever the upload returns; the toolbar's **🖼 Image** button (or paste / drag-drop) does this for you automatically.

Live example:

```
![A friendly placeholder city map](https://picsum.photos/seed/bcrn-map/900/400)
```

Renders as:

![A friendly placeholder city map](https://picsum.photos/seed/bcrn-map/900/400)

### Tables

Source:

```
| Document          | Where to get it    | Cost    |
|-------------------|--------------------|---------|
| Photo ID          | MVA                | $24     |
| SS card           | ssa.gov            | Free    |
| Birth certificate | mdcourts.gov       | $10–25  |
```

Renders as:

| Document          | Where to get it    | Cost    |
|-------------------|--------------------|---------|
| Photo ID          | MVA                | $24     |
| SS card           | ssa.gov            | Free    |
| Birth certificate | mdcourts.gov       | $10–25  |

The pipes (`|`) separate columns. The dashed line under the header tells Markdown which row is the header. Tables read awkwardly on narrow phone screens — use bullet lists when possible.

### Horizontal rule

Source:

```
---
```

Renders as a horizontal divider line. Useful for separating major sections within a guide.

---

## How to use the admin panel

You're already in the right place if you can see this article. Here's a tour of the rest.

### The three tabs

The left sidebar has three tabs at the top:

1. **Programs** — every guide on the site, including drafts. Click one to load it into the editor on the right.
2. **FAQs** — site-wide FAQs that appear on the homepage teaser and the `/faq` page. (Per-program FAQs are edited inside the Programs tab — see below.)
3. **Settings** — every editable string on the public site: site name, hero copy, contact info, Calendly URL, footer.

### Adding a new program

Click **Create New Draft** at the top of the Programs sidebar. Fill in:

- **Title** — what shows up at the top of the guide page and on the homepage card. Keep it short.
- **URL slug** — auto-fills from the title; only edit if you need a specific URL.
- **Category** — controls which generic icon appears on the homepage card if you don't pick a custom one.
- **Order** — lower numbers appear first on the homepage. New programs default to 100; squeeze a new one between SNAP (10) and Medicaid (20) by setting it to 15.
- **Short summary** — one or two lines shown on the homepage card and used as the SEO description. The counter under the field turns amber past 130 characters and red past 160 — Google truncates around 155.

When you're happy, flip the **Status** switch from Draft to Published. The program appears on the public site immediately.

### Guide vs FAQ tab inside a program

The big editor pane has a tab switcher at the top: **📝 Step-by-Step Guide** and **❓ FAQ**.

- The **Guide** content (`content_md` in the database) is what visitors see by default on the program page.
- The **FAQ** content (`faq_md`) is shown when they click the FAQ button on the program card or the FAQ tab on the guide page.

Each tab is independent — leaving the FAQ tab empty is fine; the FAQ button on the homepage card just won't appear for that program.

For the FAQ tab specifically, every `##` heading is treated as a question and the paragraph(s) below it as the answer. So the source pattern is:

```
## How long does it take to be approved?

Most applications are decided within 30 days. Emergency SNAP can be
approved within 7 for households with very low income.

## What if I'm denied?

You have 30–90 days to file an appeal — the exact window is on the
denial letter.
```

### Image uploads

Three ways to add an image, in order of how forgetful you can be:

1. Click the **🖼 Image** button on the toolbar and pick a file.
2. Drag a file from your Desktop / Finder / Downloads folder directly onto the editor pane.
3. Copy an image (Cmd+C / Ctrl+C from anywhere — a screenshot, a web page, the Photos app) and paste it into the editor with **⌘V** / **Ctrl+V**.

In all three cases the image is uploaded to Supabase Storage and the Markdown is inserted at the cursor as:

```
![placeholder name](https://...supabase.co/storage/v1/object/public/agudah-md-ga-images/...)
```

Edit the bracket text afterward to give the image a more descriptive alt-text.

### Previewing before you save

The right pane shows a live preview as you type. For an exact "what visitors will see" check including the page chrome (header, footer, "Need help" CTA, the auto-generated table of contents), click the **Preview** button in the top bar. A new tab opens with the unsaved draft rendered exactly like the public guide page — without writing anything to the database.

### Duplicating a program

Hover any row in the Programs sidebar and a **Duplicate** button appears at the bottom-right. Click it, confirm in the modal, and a new draft titled "Copy of …" is created and loaded into the editor.

### Filtering the sidebar

The three pills above the search box (**All / Live / Drafts**) filter what's shown in the sidebar. Useful when you have a dozen programs and only want to see what's still in draft.

## Keyboard shortcuts

The strip at the bottom of the editor lists them, but for the record:

- **⌘B** / **Ctrl+B** — bold the selection
- **⌘I** / **Ctrl+I** — italicize
- **⌘K** / **Ctrl+K** — insert a link (prompts for the URL)
- **⌘S** / **Ctrl+S** — save
- **Esc** — exit fullscreen editor mode (if you've opened it)

## When you get stuck

- The **?** button in the top bar opens a quick formatting reference.
- Settings → FAQ Page in the admin has a **Enable the general FAQ section** switch. Flip it off and the FAQ link disappears from every page header, the homepage teaser hides, and `/faq` becomes a 404.
- If you accidentally close the tab with unsaved changes, the browser asks before letting you leave.

That's the whole tour. Delete this fake program when you're done with it — its slug is **fake-article**, so it lives at `/posts.html?title=fake-article` until removed.
