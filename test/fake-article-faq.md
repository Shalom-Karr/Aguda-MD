## Is this article real?

No. This is a **test program** used to exercise the admin panel and the public guide page. The slug is `fake-article` and the program lives at `/posts.html?title=fake-article` until someone deletes it from the admin sidebar.

## How do I add a new program?

In the admin, open the **Programs** tab in the left sidebar and click **Create New Draft**. Fill in the Title, Category, and Short summary, write the guide in the editor, and flip the **Status** switch from Draft to Published when you're ready to put it on the public site.

## How do I bold or italicise text?

Highlight the text and press **⌘B** (Mac) or **Ctrl+B** (Windows) for bold, or **⌘I** / **Ctrl+I** for italic. You can also click the **B** and *I* buttons on the toolbar above the editor. Either way, Markdown asterisks (`**` for bold, `*` for italic) get inserted around your selection.

## How do I add a heading?

The toolbar's **H Section** button inserts `## ` at the start of the current line — that becomes a major section heading on the public page and a navigable entry in the floating "On this page" table of contents on the right. **h Subsection** inserts `### `. Don't use a single `#` — that's reserved for the program title, which is set automatically from the Title field above the editor.

## How do I add a link?

Highlight the words you want to link, press **⌘K** / **Ctrl+K**, and paste the URL into the prompt. The result looks like `[your text](https://...)` in the editor. External URLs (a different host than `baltcrn.org`) automatically open in a new tab on the public site; internal links stay in the same tab.

## How do I add an image?

Three ways, easiest first:

- Drag the image file from your desktop directly onto the editor pane.
- Copy an image from anywhere (a screenshot, a web page, the Photos app) and paste with **⌘V** / **Ctrl+V** while your cursor is in the editor.
- Click the **🖼 Image** button on the toolbar and pick a file.

The image is uploaded to Supabase Storage and the Markdown is inserted at your cursor. Edit the description in the brackets — that's the alt text for screen readers and SEO.

## What's the difference between Live and Draft?

A program with the **Status** switch off (Draft) is only visible to admins. The orange "Draft" badge in the sidebar tells you it's not published. Flip the switch to Published (green "Live" badge) and it shows up on the public homepage immediately.

You can save a draft as many times as you want without affecting the live site — only the publish flip changes what visitors see.

## How do I duplicate an existing program?

Hover the program in the sidebar; a **Duplicate** button appears at the bottom-right of the row. Click it, confirm in the modal, and a new Draft titled "Copy of …" is created and loaded into the editor. Useful for adding a similar program (e.g. a new utility-assistance one modelled on Energy Assistance) without retyping all the structure.

## How do I reorder the programs on the homepage?

Each program has an **Order** field at the top of the editor. Lower numbers appear first. The eight original BCRN programs are spaced 10/20/30/… so you can squeeze a new program between two existing ones by setting it to e.g. 15.

## How is the table of contents on the right side generated?

It's automatic. The article page picks up every `##` and `###` heading in your Markdown, generates a slug for each, and renders them in the floating navigation. So the more clearly you split your content into sections, the easier it is for visitors to skim. Below 1024px viewport width the sidebar disappears (there's no room) and the article reads as one continuous flow.

## How do I preview a draft before publishing?

Click the **Preview** button in the top bar of the admin. A new tab opens with the unsaved draft rendered exactly as visitors will see it — full page chrome, table of contents, "Need help?" CTA, footer — but nothing is written to the database. Close the tab when you're done.

## What happens if I close the browser tab with unsaved changes?

The browser asks before letting you leave. The admin also pre-loads the most recently saved version when you reopen, so half-finished edits are at most a tab-close away from being recovered if you remember what you were typing.

## Where do I edit the homepage hero text or the footer?

In the admin, switch to the **Settings** tab. The left sidebar in Settings has a section navigation: Identity, Contact &amp; Booking, Hero (Homepage), Book-a-Call Section, FAQ Page, Footer. Click any one to jump to that section's form.

## How do I turn off the general FAQ section sitewide?

In **Settings → FAQ Page**, uncheck **Enable the general FAQ section**. The FAQ link disappears from every page header, the homepage teaser hides, and `/faq` returns a "page not found" page. Per-program FAQs (this article's FAQ tab, for example) are not affected.

## I made a mistake — can I undo a delete?

No. Deletions are permanent — the row is removed from the database and there's no version history. The custom confirm modal that appears before any delete is the last line of defence. If you might want a guide back later, switch it to Draft instead of deleting it.

## What does the # number on each sidebar row mean?

That's the **sort order**. Lower numbers appear first on the public homepage. It's the same field as the Order input at the top of the editor.
