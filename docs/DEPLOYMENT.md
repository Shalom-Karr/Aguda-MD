# Deployment — going to production

The demo runs out of the box with no backend. To deploy for real users, you need two things:

1. **Supabase** — so content is shared across visitors and devices, and survives browser clearing.
2. **A hosting provider** — Cloudflare Pages and Netlify both offer free tiers that work perfectly for this site.

Plan on ~30 minutes for a first-time setup.

---

## 1. Set up Supabase

### 1a. Create the project

1. Go to [supabase.com](https://supabase.com) → sign up → **New project**.
2. Pick any name, a strong database password (save it), and a region near your users (US East for Maryland).
3. Wait ~2 minutes for provisioning.

### 1b. Run the schema

1. In the Supabase dashboard, click **SQL Editor** → **New query**.
2. Copy the entire contents of `supabase/schema.sql` from this repo.
3. Paste and click **Run**. You should see "Success. No rows returned".

This creates the `programs` table, enables Row-Level Security, and inserts 2 sample programs.

### 1c. Get your connection keys

1. Dashboard → **Settings** (gear icon) → **API**.
2. Copy the **Project URL** (e.g. `https://abcdxyz.supabase.co`).
3. Copy the **anon public** key (a long JWT string — safe to expose in the browser).

### 1d. Wire it up in `config.js`

Open `assets/config.js` and fill in:

```js
supabase: {
  url:     'https://abcdxyz.supabase.co',
  anonKey: 'eyJhbGci...',
},
```

Refresh the site. The **Demo mode** banner disappears and the site now reads from Supabase.

---

## 2. Add authentication to the admin page

**This step is mandatory before deploying.** Without it, anyone could edit your content.

### 2a. Enable email auth in Supabase

1. Dashboard → **Authentication** → **Providers**.
2. Make sure **Email** is enabled (it is by default).
3. Optionally disable "Confirm email" if you don't want the signup confirmation step — cleaner for a single admin account.

### 2b. Create your admin user

1. Dashboard → **Authentication** → **Users** → **Add user**.
2. Enter the admin's email + a strong password. Send them the credentials separately.

### 2c. Add a login gate to `admin.html`

Paste this block **just after** the `<script src="assets/supabase-client.js"></script>` line in `admin.html`, and before the main `<script>` block:

```html
<script>
(async function authGate() {
  if (window.PROGRAMS_MODE !== 'supabase') return;   // demo mode doesn't need auth
  const { data: { session } } = await window.supabase.auth.getSession();
  if (session) return;

  // Replace the page with a login form
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#f1f5f9;font-family:Inter,sans-serif">
      <form id="auth-form" style="background:white;padding:2rem;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.1);min-width:320px">
        <h1 style="font-size:1.5rem;font-weight:800;margin-bottom:1rem">Admin Login</h1>
        <input type="email"    id="email"    placeholder="Email"    required
               style="display:block;width:100%;padding:.5rem .75rem;margin-bottom:.5rem;border:1px solid #cbd5e1;border-radius:6px">
        <input type="password" id="password" placeholder="Password" required
               style="display:block;width:100%;padding:.5rem .75rem;margin-bottom:1rem;border:1px solid #cbd5e1;border-radius:6px">
        <button type="submit" style="width:100%;background:#0f766e;color:white;font-weight:700;padding:.5rem;border:0;border-radius:6px;cursor:pointer">Sign in</button>
        <p id="err" style="color:#dc2626;font-size:.85rem;margin-top:.5rem;height:1rem"></p>
      </form>
    </div>`;
  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { error } = await window.supabase.auth.signInWithPassword({
      email:    document.getElementById('email').value,
      password: document.getElementById('password').value,
    });
    if (error) document.getElementById('err').textContent = error.message;
    else location.reload();
  });
})();
</script>
```

Now refreshing `/admin` shows a login form. Only authenticated users can hit the Supabase write endpoints (enforced by Row-Level Security in `schema.sql`).

### 2d. (Optional) Add a logout button

Add this to the top bar in `admin.html`, near the Save button:

```html
<button onclick="window.supabase.auth.signOut().then(() => location.reload())"
        class="text-sm text-slate-400 hover:text-slate-700">Sign out</button>
```

---

## 3. Deploy to Cloudflare Pages (recommended)

Cloudflare Pages is free, fast, and integrates with GitHub.

### 3a. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Shalom-Karr/Aguda-MD.git
git push -u origin main
```

### 3b. Connect Cloudflare

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com).
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the `Aguda-MD` repo.
4. **Build settings**: leave everything blank (no build command, no output directory — this is a pure static site, the repo root IS the output).
5. Click **Save and Deploy**.

After ~30 seconds, you'll get a URL like `https://aguda-md.pages.dev`. The `_redirects` file in this repo already configures clean URLs on Cloudflare Pages.

### 3c. Custom domain

In the Cloudflare Pages project → **Custom domains** → add the client's domain. Cloudflare walks you through the DNS setup.

---

## Alternative: Netlify

Same story, different dashboard:

1. [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**.
2. Pick the repo.
3. **Build command**: empty. **Publish directory**: `.` (or leave blank).
4. Click **Deploy**.

The same `_redirects` file is supported by Netlify too.

---

## 4. After deploying

- **Test everything** on the real URL — admin login, saving a post, viewing it from incognito.
- **Book-a-call**: replace the placeholder Calendly URL in `config.js` with the client's real one.
- **Delete seed data**: in Supabase dashboard → Table Editor → `programs` → delete the two sample rows. Or edit the `schema.sql` to remove the seed block before running (if you haven't already).

---

## Ongoing — updating the site

- **Content changes** (new program, edit an existing guide): do this in the admin panel. No deploy needed.
- **Structural changes** (new page, layout tweak, color change): edit the HTML → `git commit` → `git push`. Cloudflare/Netlify auto-deploys within ~30 seconds.

---

## Cost estimate

- **Supabase free tier**: 500 MB database, 5 GB bandwidth/month, 50K monthly active users. A resource site like this will not exceed this.
- **Cloudflare Pages free tier**: unlimited requests, unlimited bandwidth.
- **Domain**: ~$10-15/year if purchased through Cloudflare or Namecheap.

Realistically, **$15/year total** until the site gets thousands of users.
