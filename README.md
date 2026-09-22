# Ritika Mehndi Art — website

Single-page static site. HTML5, CSS3 and vanilla JavaScript only — no frameworks,
no build step. Drop the folder on GitHub Pages, Netlify, Vercel or Cloudflare
Pages as-is.

```
ritika-mehndi-art/
├── index.html          all page content
├── assets/
│   ├── css/style.css   all styling (design tokens at the top)
│   ├── js/script.js    nav, accordion, gallery, lightbox, reveals
│   └── images/         hero, about and gallery art + a README on replacing it
├── favicon/favicon.svg
├── robots.txt
└── sitemap.xml
```

## Before it goes live

1. **Domain** — replace `https://www.ritikamehndiart.com/` in `index.html`
   (canonical tag, Open Graph tags, JSON-LD), `robots.txt` and `sitemap.xml`.
2. **Photos** — swap the placeholder artwork. See `assets/images/README.txt`.
   Also add a real 1200×630 JPG for the `og:image` tag.
3. **Testimonials** — the three cards say "Your client testimonial will appear
   here." Replace them with real reviews or delete the cards. Nothing on the
   page currently claims a review, rating or result that hasn't happened.
4. **Map** — the embed is generated from the address text. Once Ritika has a
   Google Business Profile, use Google Maps → Share → Embed a map and paste
   that iframe in instead, so the pin lands exactly.
5. **Social links** — the Instagram and Facebook icons point at `#contact` until
   real profile URLs exist. Search `link to be added` in `index.html`.
6. **Prices** — every package says "Custom quote". Replace when Ritika confirms
   her pricing.

## Phone number

The site uses **+91 63944 88252**:

- WhatsApp links: `https://wa.me/916394488252?text=...` (21 occurrences)
- Call links: `tel:+916394488252` (5 occurrences)

`91` is the country code and `6394488252` is the number. The brief listed
`91916394488252` in the WhatsApp section, which repeats the `91` and would give
an invalid number — confirm with the client, and if it does need changing,
find-and-replace `916394488252` across `index.html`.

## Editing content

- Colours, fonts and spacing: the `:root` block at the top of `style.css`.
- Anything client-editable in the markup is flagged with `<!-- CLIENT: ... -->`.
- The gallery filter works off the `data-cat` attribute on each tile:
  `bridal`, `arabic`, `traditional`, `engagement`, `details`.

## Structured data

`index.html` ends with a JSON-LD `HealthAndBeautyBusiness` block containing only
the name, tagline, description, phone, address and service list supplied by the
client. Don't add `openingHours`, `aggregateRating` or `review` until those are
real — invented values are a Google penalty risk.

## Accessibility and performance notes

- Keyboard: skip link, visible focus rings, accordion and lightbox both operable
  by keyboard (Esc closes, arrow keys move between images).
- `prefers-reduced-motion` disables reveals, smooth scroll and transitions.
- All icons are one inline SVG sprite; all images are SVG line art under 70 KB.
- Every image below the fold is `loading="lazy"` with width/height set.
- The page works with JavaScript disabled — every WhatsApp and call link is a
  plain `<a href>`, and the FAQ answers stay readable.
