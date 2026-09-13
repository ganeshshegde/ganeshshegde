# Sahyadri Cashews — landing page

A single-page marketing site for an **integrated cashew processing company** — one that
owns every stage from farm-gate procurement through cooking, shelling, drying, peeling,
grading, value addition, packing and by-product recovery.

Static HTML, CSS and vanilla JavaScript. No build step, no framework, no runtime
dependencies.

## Run it

Open `index.html` directly, or serve the folder:

```bash
npx http-server . -p 8080
# or
python3 -m http.server 8080
```

## Structure

```
index.html            # all page markup
assets/css/styles.css # design tokens + layout
assets/js/main.js     # nav, scroll reveal, counters, tabs, form
```

## Sections

| Section | What it covers |
| --- | --- |
| Hero | Positioning: one unbroken chain of custody, orchard to carton |
| Stats | Daily capacity, farmer network, export markets, whole-kernel recovery |
| Why integrated | Traceability, provable food safety, zero-waste by-product recovery |
| Value chain | The nine owned stages, plus CNSL / shell cake / testa / cashew apple |
| Products | AFI kernel grades (W180–W450, SW, splits, pieces), value-added lines, industrial |
| Quality | In-house lab, HACCP, retained samples, certification grid |
| Sourcing | Farmer network terms, sustainability on both sides of the farm gate |
| Facility | Capacity, storage, packing lines, logistics, export markets |
| Working with us | Enquiry → samples → contract → production → dispatch |
| Contact | Enquiry form with grade, volume and destination |

## What's implemented

- Sticky header with a shadow that appears on scroll; slide-down mobile nav
- `IntersectionObserver` scroll reveals with staggered siblings
- Count-up statistics that fire once when scrolled into view
- Accessible product tabs (`role="tab"`, arrow-key navigation, `aria-selected`)
- Client-side form validation that composes a pre-filled `mailto:` enquiry
- Responsive from 360px up; no horizontal scroll at any width
- `prefers-reduced-motion` honoured — all animation is disabled, reveals stay visible
- Skip link, visible focus rings, semantic landmarks, and a print stylesheet

## Customising

Colours, fonts, spacing and shadows are CSS custom properties at the top of
`styles.css` — change the palette there rather than hunting through rules.

The contact form has no backend. `main.js` builds a `mailto:` link from the field
values so nothing is silently dropped on a static host. To post to a real endpoint,
replace the `window.location.href = href` block in the submit handler with a `fetch`
to your form service.

> **Note:** company name, address, phone, figures, certifications and the testimonial
> are illustrative placeholders. Replace them with real details before this goes live —
> certification claims in particular.
