# Admin guide

*Written for the person editing site content, not the developer.*

This site has a simple admin panel where you can add, edit, and remove program guides — no code or developer needed.

---

## Signing in

1. Go to your site's `/admin` page (e.g. `https://yoursite.org/admin`).
2. Enter the email and password provided to you.

> **Tip**: bookmark the admin URL. It's not linked from the main site.

---

## The layout

The admin has three areas:

```
┌──────────────┬──────────────────────────────────────┐
│              │  Title / Slug / Category / Summary   │
│  Post list   ├──────────────────────────────────────┤
│  (sidebar)   │  Toolbar: Bold, Italic, Lists, etc.  │
│              ├──────────────────┬───────────────────┤
│              │  Markdown edit   │  Live preview     │
│              │  (you type here) │  (visitors see)   │
└──────────────┴──────────────────┴───────────────────┘
```

- **Sidebar (left)**: every program in the system, drafts and published. Click one to load it.
- **Metadata bar (top)**: title, URL slug, category, summary.
- **Markdown editor (center-left)**: where you write the actual guide.
- **Live preview (center-right)**: exactly what visitors will see.

---

## Writing a new program

1. Click **+ New** in the top bar.
2. Type the program name in the big title field (e.g. `School Meal Program`).
3. The **slug** (the URL-friendly version) auto-fills to `school-meal-program`. You can edit it, but keep it lowercase-with-dashes.
4. Pick a **category** from the dropdown.
5. Write a one-line **summary** — this is what shows on the program card on the homepage.
6. Write the guide in the markdown pane. See [the markdown basics below](#markdown-basics).
7. Click **Save**. The post is saved as a draft — it's NOT live yet.
8. When you're ready, click the **Draft** button in the top bar. It'll turn green and say **● Published**. The program is now visible on the homepage.

You can flip between Draft and Published any time. Drafts stay in the admin sidebar but aren't shown on the public site.

---

## Editing an existing program

1. Click its name in the left sidebar.
2. Change whatever you need.
3. Click **Save**.

Changes go live immediately (if the program is published).

---

## Deleting a program

There's no delete button in this version of the admin — it's intentional, to prevent accidental loss. Ask the developer, or:

1. Open a SQL editor in your Supabase dashboard.
2. Run: `delete from programs where slug = 'slug-to-delete';`

If you want a delete button added to the admin, ask the developer — it's a 5-minute change.

---

## Markdown basics

Markdown is a simple way to format text. Here's what you'll use most:

| Type this          | Get this                |
|--------------------|-------------------------|
| `# Big heading`    | A level-1 heading       |
| `## Section`       | A section heading       |
| `### Subsection`   | A smaller heading       |
| `**bold**`         | **bold**                |
| `*italic*`         | *italic*                |
| `- item`           | A bullet point          |
| `1. item`          | A numbered list item    |
| `> quote`          | An indented quote block |
| `[link](url)`      | A clickable link        |
| `---`              | A horizontal divider    |

The toolbar above the editor inserts all of these for you — you can just click instead of memorizing the syntax.

**Pro tip**: select some text first, then click a toolbar button, and it'll wrap the selection (e.g. select a word then click **B** to make it bold).

---

## Keyboard shortcuts

- **Cmd/Ctrl + S** — save the current post
- **Tab** in the markdown editor — inserts 2 spaces

---

## What the URL looks like

Every program gets a URL based on its slug:

```
https://yoursite.org/posts?title=school-meal-program
```

You can share these URLs directly — visitors will land right on the guide.

---

## Tips for writing good guides

1. **Start with "What is this?"** — one sentence, plain language. Don't assume the reader knows what the acronym stands for.
2. **Use subheadings** for: "Who qualifies?", "What you'll need", "How to apply", "After you apply". The predictable structure helps people find what they need.
3. **Use numbered lists** for step-by-step instructions. Bullets for things that aren't in a specific order.
4. **Avoid jargon**. "Proof of income" is better than "income verification documentation".
5. **Link to the official application** when possible.
6. **Keep summaries short** — they go on the card on the homepage. Aim for under 20 words.

---

## If something breaks

- **I can't save / I get an error**: your internet might be down, or the Supabase database might be temporarily unavailable. Wait a minute and try again. If it keeps failing, tell the developer.
- **I lost my edits**: if you closed the tab without saving, the draft is gone. Always **Save** before navigating away. The system will warn you if you try to leave with unsaved changes.
- **The admin page won't load**: try a different browser or incognito window. If still broken, the site might be down — check the homepage.

---

## Questions?

Contact the developer.
