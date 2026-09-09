# Heinrich Steev — Portfolio

A premium, animation-led portfolio site for Heinrich Steev (Graphic Designer, Video Editor,
Brand Designer). React + Vite, with three.js and OGL for the WebGL work, GSAP ScrollTrigger for
scroll choreography, and Lenis for smooth scrolling.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build it

```bash
npm run build      # outputs to dist/
npm run preview    # serves the production build locally
```

The build uses a relative base path (`base: './'` in `vite.config.js`), so `dist/` can be
dropped onto any static host — Netlify, Vercel, GitHub Pages, cPanel, or a plain folder — with
no path rewriting.

---

## Read this first: the uploaded ZIP files

Five ZIP files were described in the brief (WebGL shader, portfolio hover effect, global mouse
effect, menu animation, icon effects). **Only one file actually arrived**, repeated five times
in the upload: `code.zip`, containing `magnetic-button-main` — a Next.js demo of a magnetic
button built with GSAP `quickTo` and an elastic ease, plus a Framer Motion variant.

That code **is** integrated. Everything else was built from scratch in the same spirit.

| Brief item | Status | File |
|---|---|---|
| Magnetic button ZIP | **Uploaded code, adapted** | `src/animations/Magnetic.jsx` |
| Global WebGL shader | Written from scratch | `src/components/GradientWaves.jsx`, `src/components/Loader.jsx` |
| Portfolio hover effect | Written from scratch | `src/components/PortfolioCard.jsx` |
| Global mouse effect | Written from scratch | `src/components/
.jsx` |
| Menu animation | Written from scratch | `src/components/Menu.jsx` |
| Icon effects | Written from scratch | inline SVG + `Magnetic` throughout |

If you re-upload the four missing ZIPs, those are the only files that need swapping. Nothing
else depends on their internals.

### What changed in the magnetic button code

The original cloned its child with `React.cloneElement` and attached listeners that were never
removed. The adapted version keeps the exact animation technique — `gsap.quickTo` on `x`/`y`
with `elastic.out(1, 0.3)` — and adds:

- its own wrapper element, so it works with buttons, links, icons and cards without ref forwarding
- listener cleanup and tween cancellation on unmount
- a configurable `strength` prop
- automatic opt-out on touch pointers and under `prefers-reduced-motion`

It drives the hero buttons, the menu close button, the floating WhatsApp button, the footer
links and the contact cards.

---

## Content is locked to the resume

`src/data/site.js` is the single source of truth. Every professional string in it — the About Me
paragraph, both education entries, all five roles with their exact titles, companies, dates and
bullet wording, the software list and the interests — is transcribed verbatim from
`Heinrich_Steev_Creative_Resume.pdf`. Nothing was rewritten, shortened or invented.

Services are **derived**, not invented: each one carries a `source` field naming the role and
responsibility line in the resume it comes from. If a service isn't backed by a line in the
experience section, it isn't there.

Portfolio titles and categories were taken from the headline copy visible in each artwork
("Success Begins With A Conversation", "Undo The Ordinary", and so on). The five categories are
only those actually represented in the uploaded work.

To change any copy, edit `src/data/site.js`. Nothing else needs touching.

## Adding or removing work

The portfolio, the circular gallery and the accordion are all driven by the same `PROJECTS`
array. To add a piece:

1. Drop the image into `public/portfolio/`
2. Add an entry to `PROJECTS` in `src/data/site.js`

The grid, the filter chips, the category accordion, the WebGL gallery and the lightbox
navigation all pick it up automatically. Nothing is hardcoded to a fixed count.

## The scroll-controlled motion section

The uploaded video (`Horizontal_dark_motion_gr_gwr_video_mvp.mp4`, 10s at 24fps) was decoded
with ffmpeg into a 120-frame JPEG sequence at 1152×648, stored in `public/frames/`:

```bash
ffmpeg -i input.mp4 -vf "fps=12,scale=1152:-2" -q:v 7 public/frames/frame_%03d.jpg
```

`ScrollSequence.jsx` paints those frames to a canvas, with scroll position mapped straight onto
the frame index — scroll down and it plays forward, scroll up and it plays backward. There is no
`<video>` element anywhere in the project, so no player chrome can appear. Frames stream in
progressively and the nearest decoded frame is drawn while later ones arrive, so the section is
usable immediately.

Frame scrubbing was chosen over seeking `video.currentTime` because `currentTime` seeking
stutters badly on iOS Safari and cannot be relied on for smooth scrubbing.

To regenerate at a different density, change `fps=` above and update `SEQUENCE.frameCount` in
`src/data/site.js`.

## Structure

```
src/
├── animations/     BlurText, ShinyText, TrueFocus, RotatingText,
│                   GlareHover, BorderGlow, Magnetic
├── components/     Loader, Cursor, GradientWaves, TopBar, Menu, LineSidebar,
│                   ScrollSequence, CircularGallery, PortfolioCard, Lightbox,
│                   AccordionGallery, DepthCarousel, FloatingWhatsApp, Footer
├── sections/       Hero, About, Services, SelectedWork, Gallery, Experience,
│                   Portfolio, Showcase, Statement, Contact
├── hooks/          useDeviceProfile, useInView, useSmoothScroll
├── utils/          preload
├── styles/         global, animations, loader, nav, sections, work
└── data/site.js    all content
public/
├── images/hero.jpg
├── portfolio/      12 works
├── frames/         120 frames
└── resume/         Heinrich_Steev_Creative_Resume.pdf
```

## Where each animation is used

Animations are art-directed rather than applied everywhere:

- **Blur Text** — section introductions and key paragraphs only
- **Shiny Text** — small labels, accents, CTA copy
- **True Focus** — the closing creative statement and the contact heading
- **Rotating Text** — the About headline
- **Glare Hover** — portfolio cards, service cards, resume and portfolio buttons, contact cards
- **Border Glow** — the primary WhatsApp contact card and two featured service cards
- **Magnetic** — hero actions, menu close, WhatsApp, footer links
- **Line Sidebar** — desktop section navigation; a top progress bar below 900px

## Performance and device handling

`useDeviceProfile` is the single place that decides how expensive the experience is allowed to
be. It reports touch, reduced-motion, viewport size, WebGL availability, a capped device pixel
ratio, and a low-power flag derived from `hardwareConcurrency` and `deviceMemory`.

- Device pixel ratio is capped at 1.4 on low-power devices, 2 elsewhere
- Particle counts and shader geometry segments drop on low-power devices
- The ambient background pauses on `visibilitychange`; the circular gallery pauses when it
  scrolls out of view via IntersectionObserver
- Every WebGL surface disposes its geometries, materials, textures and context on unmount, and
  every GSAP ScrollTrigger is created inside a `gsap.context` that reverts on cleanup
- The circular gallery falls back to a static image grid where WebGL is unavailable
- The loader has a 12-second hard timeout so a slow connection can never trap a visitor
- `React.StrictMode` is deliberately not used — its double-invoked effects would create two
  WebGL contexts per surface in development. Production behaviour is unaffected.

On touch devices the custom cursor is removed entirely, card tilt and parallax are disabled,
and the gallery switches to swipe.

## Accessibility

Semantic landmarks, a skip link, visible gold focus rings, keyboard-operable lightbox (Escape to
close, arrow keys to move) with focus containment and focus restoration, `aria-current` on the
active section, alt text on every image, and full `prefers-reduced-motion` support — under which
pinning and scrubbing are disabled, the sequence holds a single frame, and text animations
resolve instantly.

## Links

- WhatsApp: `https://wa.me/919487306712` (opens a conversation with a prefilled message)
- Email: `mailto:heinrichsteev47@gmail.com`
- Behance: `https://www.behance.net/heinrichsteev`
- Resume: `public/resume/Heinrich_Steev_Creative_Resume.pdf` — View opens in a new tab, Download
  uses the `download` attribute

## Fonts

Anton (display) and Inter / Archivo (body and UI) load from Google Fonts via `index.html`. The
CSS declares Impact and system sans-serif fallbacks, so the site remains readable offline or if
Google Fonts is blocked.

## Testing performed

- Production build compiles clean (475 modules, no errors or warnings)
- All 9 GLSL shaders parse without syntax errors
- Full app server-renders without throwing; all resume content, all 12 portfolio images, and
  zero `<video>` elements present in the output markup
- All 44 resume fields verified against the source PDF text
- Every asset path resolves over HTTP from the production build
- No TODOs, placeholders or stub assets anywhere in the source

Runtime rendering of the WebGL surfaces has not been visually verified — no browser was
available in the build environment. Run `npm run dev` and check the console on first load.

---

## Fix pass — what changed and why

This round was a repair pass only. No section was redesigned, no palette value
changed, and every WebGL surface, shader, hover effect and text animation is
still mounted and wired exactly as before (verified by import count after the
changes).

### Custom cursor

The cursor was mounting, but `cursor: none` was applied to `<html>` on mount
while the loader sat **above** the cursor in z-order (`--z-loader: 120` vs
`--z-cursor: 100`). During the entire loading sequence there was therefore no
visible pointer at all. Fixes:

- `--z-cursor` raised to 140, above the loader, the lightbox and the menu
- the native cursor is now hidden only after the custom one has confirmed it is
  tracking, so a visitor is never left with no pointer
- the label was positioned by GSAP `x`/`y`, which overwrote its CSS
  `translate(-50%, -50%)` and left it offset down-right of the pointer; all
  three layers are now centred with `xPercent`/`yPercent`, and the matching
  negative margins on the dot and ring were removed (they were double-centring)
- hover state is re-read from the live hit test on move and on scroll, so it
  stays correct when content moves under a stationary pointer
- state resets on window blur and on genuinely leaving the window, so a stale
  ring is never stranded mid-screen
- listener count is balanced 6 added / 6 removed on unmount

### Cropped and collapsed text

Two root causes, both real:

1. **`ch` measured in the wrong font.** `.services__head` had `max-width: 22ch`
   and `.sequence__copy` had `34ch`. `ch` resolves against the *element's own*
   font, and both are body-font containers (16px), so those boxes were ~176px
   and ~272px wide while the heading inside them rendered at up to 96px. That is
   what forced one word per line. Every measure now sits on the heading itself,
   where `ch` resolves against Anton.
2. **Rotating Text mask sized to the first word.** Items after the first were
   `position: absolute; inset: 0`, so the mask measured `brands` and clipped
   `SCREENS`. The items now share a single `inline-grid` cell, so the mask
   measures the widest word. Vertical padding inside the overflow box keeps caps
   and descenders off the clip edge, and the slide animation is unchanged.

Display `line-height` went from `0.88` to `0.94`, which is what was letting the
comma in "FIVE ROLES," collide with the line beneath it.

### Layout and spacing

Section heads now use a consistent `clamp()` label-to-heading gap and
`align-items: flex-start`; heading-to-body rhythm in service cards and the
sequence copy was opened slightly. Accordion titles step down from `display--m`
to their own clamp and are allowed to wrap, since the new labels are longer.

Heading wrap was simulated at 1920 / 1440 / 1280 / 1024 / 768 / 480 / 375 using
the real clamp and gutter values; no heading produces one-word lines at any of
them. The Services heading resolves to:

```
WHAT I ACTUALLY DO,
TAKEN STRAIGHT FROM THE
WORK.
```

### Email

All three mail actions (contact card, menu, footer) now use `PERSON.mailto`,
a composed `mailto:heinrichsteev47@gmail.com?subject=Project%20enquiry`.

The likely blocker was `.topbar`: a full-width `position: fixed` bar with no
`pointer-events: none`, so anything scrolled beneath its band was unclickable.
It is now transparent to pointer events except for its two actual controls.
`.contact__link` was also given an explicit stacking position so no decorative
wrapper can sit over it.

### Accordion panel titles

The five panels now read exactly:

| Panel | Title |
|---|---|
| 1 | Creative Poster Design - 2 |
| 2 | Creative Poster Design - 3 |
| 3 | Creative Poster Design - 3 |
| 4 | Creative Poster Design - 2 |
| 5 | Creative Poster Design - 2 |

These are **display labels only**, held in `CATEGORY_LABELS` in
`src/data/site.js`. The underlying project categories are untouched, so the
portfolio filter chips and card captions still read Campaign Design, Poster
Design, Social Media Creative, Brand Design and Advertising. Images, panel
structure and hover behaviour are unchanged.

### Other

`overflow-x: hidden` on `html, body` was turning `<body>` into a scroll
container, which silently breaks `position: sticky` (the Experience year rail).
It is now `overflow-x: clip` on the root only, which propagates to the viewport
and stops sideways scrolling without that side effect.

No `!important` was added; the only four in the project are the pre-existing
`prefers-reduced-motion` overrides. Duplicate rules introduced during the pass
were merged.
