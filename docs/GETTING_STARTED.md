# Getting Started

This page walks through running the site locally and making your first edit.

---

## Run it locally

**Option 1 — just open the file:**

Double-click `index.html`. It'll open in your default browser and work immediately with seed data. This is the fastest way to preview.

> Some browsers block `file://` URLs from loading scripts with certain CORS restrictions. If something doesn't work, use Option 2.

**Option 2 — run a local server (recommended):**

```bash
# Python 3 (comes pre-installed on Mac / most Linux)
python -m http.server 8000

# OR Node.js
npx serve .

# OR VS Code: install the "Live Server" extension and click "Go Live"
```

Then open <http://localhost:8000>.

---

## Make your first change

Let's change the site name.

1. Open `assets/config.js` in any text editor.
2. Find the `name` field near the top. Change it to anything you want.
3. Save the file and refresh your browser.

Everything that uses that name — the navbar, the page title, the footer — updates automatically because every page reads from `config.js` on load.

---

## Add your first program (demo mode)

1. Click **Admin** in the top-right of the homepage.
2. Type a title, e.g. "School Meals Program".
3. The slug auto-fills as `school-meals-program` — this is what goes in the URL (`/posts?title=school-meals-program`).
4. Pick a category, write a summary, then write the guide in the left-hand markdown pane. The right pane updates live.
5. Click **Save**. Toggle the **Draft/Published** switch in the top bar to make it visible on the homepage.
6. Click the site logo to go back to the homepage and see your program in the grid.

In demo mode this is saved in your browser. To persist across visitors (and devices), follow [DEPLOYMENT.md](DEPLOYMENT.md) to hook up Supabase.

---

## Folder structure

```
Agudah-MD/
├── index.html         ← home page
├── posts.html         ← program guide (uses ?title=slug)
├── admin.html         ← markdown editor
├── faq.html           ← FAQ page
├── assets/
│   ├── config.js      ← ALL branding/config lives here
│   └── supabase-client.js
├── supabase/
│   └── schema.sql     ← run this in Supabase to set up your DB
├── docs/              ← you are here
├── _redirects         ← clean URL rules
├── .gitignore
└── README.md
```

There's no `package.json`, no `node_modules`, no build step. Every page is a plain HTML file you can edit and refresh.

---

## Next steps

- **Rebrand** → [CUSTOMIZATION.md](CUSTOMIZATION.md)
- **Connect Supabase + deploy** → [DEPLOYMENT.md](DEPLOYMENT.md)
- **Teach the client to use the admin** → [ADMIN_GUIDE.md](ADMIN_GUIDE.md)
