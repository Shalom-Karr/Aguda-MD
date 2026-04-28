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

Markdown is just plain text with a few special characters that the editor turns into formatted output. You don't have to memorize anything — the toolbar above the editor inserts each of these for you when you click a button.

### Inline formatting

You write **bold** by wrapping a word in two asterisks (`**bold**`) or by selecting it and pressing **⌘B**. *Italic* is one asterisk on each side, or **⌘I**. You can [add a link](https://baltcrn.org) by selecting the link text and pressing **⌘K** — a prompt asks for the URL.

External links (anything starting with `http://` or `https://` to a different host) automatically open in a new tab. Internal links to `baltcrn.org` stay in the same tab.

### Headings

Use `##` for a major section heading and `###` for a sub-section. Don't use `#` (single hash) — that's reserved for the page title, which is set automatically from the program's Title field. Section headings appear in the floating "On this page" navigation that sits to the right on wide screens.

### Lists

Unordered lists use a leading dash:

- The first item
- The second item
- A third item with **bold** in it for flavour

Ordered lists use a number and a period:

1. First, do this.
2. Then this.
3. Finally this.

You don't have to keep the numbers in order — Markdown will renumber automatically when it renders. So `1. … 1. … 1.` works fine and is easier to edit.

### Blockquotes

> A blockquote is a great place to put a warning, a quote from an official source, or anything that should stand out from the surrounding text.
>
> It can run to multiple lines.

### Inline code and code blocks

Use single backticks for inline code like `mydhrbenefits.dhr.state.md.us`. For longer snippets — a phone script, a sample form answer — use a fenced code block:

```
Hi, my name is [Your Name], and I'm calling about my SNAP application
submitted on [Date]. The case number is [Case #]. I haven't heard back
about the interview yet — could you check the status?
```

### Images

Click the **🖼 Image** button on the toolbar, paste an image directly into the editor, or drag a file from your desktop onto the editor pane. The image is uploaded to Supabase Storage and inserted as Markdown:

```
![Description of image](https://...supabase.co/storage/v1/...)
```

The **description** part is the alt text — it's shown if the image fails to load and is read aloud by screen readers, so make it descriptive.

![Another placeholder showing a city map](https://picsum.photos/seed/bcrn-map/900/400)

### Tables

You can paste a Markdown table directly:

| Document | Where to get it | Cost |
|----------|-----------------|------|
| Photo ID | MVA            | $24  |
| SS card  | ssa.gov         | Free |
| Birth certificate | mdcourts.gov | $10–25 |

Most of the time you won't need tables — bullet lists read more clearly on phones.

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

### Image uploads

Three ways to add an image, in order of how forgetful you can be:

1. Click the **🖼 Image** button on the toolbar and pick a file.
2. Drag a file from your Desktop / Finder / Downloads folder directly onto the editor pane.
3. Copy an image (Cmd+C / Ctrl+C from anywhere — a screenshot, a web page, the Photos app) and paste it into the editor with **⌘V** / **Ctrl+V**.

In all three cases the image is uploaded to Supabase Storage and the Markdown is inserted at the cursor.

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
