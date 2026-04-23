# Customization

The goal: make basic rebrands a 2-minute config change, not a code hunt.

---

## The 90% case: edit `assets/config.js`

One file controls:

- Site name & tagline
- Hero section copy + CTAs
- Book-a-call section copy
- Calendly URL
- Footer copyright
- Supabase connection
- Program categories list

Open `assets/config.js`, change what you need, save, refresh. No other files should need touching for basic branding.

---

## Changing the color theme

Colors are defined in two places, in this order of priority:

1. **Tailwind config `<script>` tag** at the top of each HTML file (`index.html`, `posts.html`, `admin.html`, `faq.html`). Each has a `brand:` palette:

   ```js
   colors: {
     brand: {
       50:  '#f0fdfa',
       100: '#ccfbf1',
       500: '#14b8a6',
       600: '#0d9488',
       700: '#0f766e',   // ← main buttons, headings
       800: '#115e59',
       900: '#134e4a',
     }
   }
   ```

   Replace these hex values to shift the whole palette. The default is teal; easy swaps:

   - Navy: `#1e40af / #1e3a8a / #1e3a8a` family
   - Forest green: `#15803d / #166534 / #14532d`
   - Warm plum: `#a21caf / #86198f / #701a75`

2. **CSS accent colors** scattered in the `<style>` blocks (gradients, prose link color). Search each HTML file for the hex code `#0f766e` and replace.

> For production, you might consolidate these into a single CSS variables file. For now, find-and-replace is enough.

---

## Changing the logo

The house-icon SVG is inline in each HTML file's navbar:

```html
<svg class="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" ...>
  <path ... d="M3 9.75L12 3l9 6.75V20a1..."/>
</svg>
```

**To use an image file instead:**

1. Drop your logo into `assets/logo.svg` (or `.png`).
2. Replace the `<svg>...</svg>` block in each HTML file with:

   ```html
   <img src="assets/logo.svg" alt="Logo" class="w-7 h-7">
   ```

---

## Changing category emojis / colors

Each card's emoji and badge color come from two maps near the top of the `<script>` block in `index.html` and `posts.html`:

```js
const CATEGORY_COLORS = {
  Food:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  Housing: 'bg-blue-50 text-blue-700 border-blue-200',
  // ...
};
const iconFor = (cat) => ({ Food: '🍎', Housing: '🏠', /* ... */ })[cat];
```

To add a new category:

1. Add it to `categories` in `assets/config.js` (so it appears in the admin dropdown).
2. Add entries to `CATEGORY_COLORS` and `iconFor` in `index.html` and `posts.html`.

---

## Changing the FAQ

Edit the `FAQS` array near the bottom of `faq.html`:

```js
const FAQS = [
  { q: 'Is this service really free?', a: 'Yes — ...' },
  ...
];
```

Answers support HTML (useful for lists and links).

---

## Changing the homepage hero illustration

The hero is currently just gradient + text. If the client wants an image or illustration, add it inside the `<section>` with class `bg-gradient-to-br from-brand-700 to-brand-900`:

```html
<div class="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
  <div class="max-w-3xl">
    <!-- existing heading/subhead/buttons -->
  </div>
  <img src="assets/hero.png" alt="" class="hidden md:block max-w-md">
</div>
```

---

## Fonts

The site uses [Inter](https://rsms.me/inter/) via Google Fonts. To swap:

1. Replace the Google Fonts link in each HTML `<head>`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YOUR_FONT..." rel="stylesheet">
   ```
2. Change the `fontFamily` in each Tailwind config block:
   ```js
   fontFamily: { sans: ['YOUR_FONT', 'sans-serif'] }
   ```

---

## Adding a new page

1. Duplicate `faq.html` as a starting template — it has the nav, footer, and config-loading already wired up.
2. Add a link to it in the nav of `index.html`, `posts.html`, `admin.html`, and `faq.html`.
3. Add a redirect rule to `_redirects` if you want a clean URL (`/yourpage` → `/yourpage.html`).
