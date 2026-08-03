# Austin Spurs — brand and architecture reference

The purpose of this file is to stop the site drifting. Anyone (or any Claude
session) making changes should read it first and treat the reasoning as binding
unless Joe says otherwise.

---

## 1. The one-line positioning

**Austin's official Tottenham Hotspur supporters club.** Not a watch party, not
a bar promotion. Everything on the site should read like it was written by
someone who goes, for other people who might go.

---

## 2. Voice

The site went through one full de-cheesing pass. These rules came out of it and
are the ones most likely to get violated by accident.

**Do:**
- Plain, concrete, specific. "Nine in the morning on Research Boulevard" beats
  "matchday magic."
- Describe by what things *do* — the pub opens early, the sound is on the right
  game, there's room to sit.
- Short sentences. Let facts carry the weight.

**Don't:**
- No Americans-performing-Englishness. No "the lads," no "proper football," no
  invented terrace slang.
- No hype adjectives: passionate, vibrant, ultimate, unforgettable, epic.
- No em-dash-heavy dramatic constructions. No triads ("faster, simpler, better").
- Don't oversell. If a match isn't confirmed, say it isn't confirmed.

**Exception:** "COYS" is allowed and used exactly once — the green pub-light
status. It earns it by being rare.

---

## 3. Colour

All tokens live in `assets/css/site.css` under `:root`. **Change them there, never
inline.**

### Core palette

| Token | Value | Use |
|---|---|---|
| `--navy-900` | `#050C1E` | Header, footer, dark sections |
| `--navy-800` | `#0A1733` | Section backgrounds |
| `--navy-700` | `#0E2049` | Secondary buttons |
| `--navy-600` | `#16305F` | Accents |
| `--brass` | `#C8A24A` | Primary buttons, rules, the site's one warm colour |
| `--brass-lt` | `#E6CD8B` | Focus rings, eyebrows on dark |
| `--brass-dk` | `#7A5E1E` | Eyebrows on light |
| `--bone` | `#F5F2EA` | Page background |
| `--bone-2` | `#E8E3D6` | Alternate section background |
| `--ink` | `#12151C` | Body text |
| `--muted` | `#585F6D` | Secondary text |

### Violet — hero gradient only

`--violet` `#4B2A7B`, `--violet-lt` `#6E43A8`

Justified by Tottenham's 2026/27 "Psychic Purple" third kit. It is an accent with
a reason. **Do not spread it into buttons, links or section backgrounds** — the
moment it becomes a third brand colour, the navy-and-brass identity collapses.

### Coast to Coast — event scoped

`--c2c-navy` `#000A3D`, `--c2c-orange` `#F75E09`, `--c2c-red` `#ED5300`,
`--c2c-yellow` `#F8E906`, `--c2c-amber` `#F7C806`

Sampled directly from the Premier League's official Tottenham poster. Used **only**
on `coast-to-coast.html` (via `<body class="c2c-page">`) and the event hero on
`events.html`. It's loud, and it earns that by being temporary and singular.

**When the August 22 event passes, this palette retires with it.**

### Status lights

`--go` `#2FA05C` · `--wait` `#E2A72A` · `--stop` `#C9372E`

Never signal status by colour alone — every lamp is paired with a text label.

---

## 4. Type

| | Family | Notes |
|---|---|---|
| Display | **Saira Condensed** | 500/600/700/800. Set via `--font-display`. |
| Body | **Barlow** | 400/600/700/800 + italic. Set via `--font-body`. |

Tottenham's own typeface is a custom F37 Foundry family — proprietary, not
licensable. Saira Condensed was chosen as a deliberate cousin: same squared,
slightly condensed, upright caps temperature, without the beak-and-spur terminal
detailing that makes theirs theirs. It sits about 20% away from the original,
which was a conscious choice for legitimacy over distance.

`type-options.html` in this folder compares five candidates in the real lockup if
that decision ever gets revisited.

**Two variables control all display type:** `--display-weight` (700) and
`--display-track` (.02em). Every heading, the wordmark and the fixture dates read
from them. Tune there, not per-element.

---

## 5. The lockup

Crest at 66px tall → hairline brass rule → **AUSTIN SPURS**.

The crest is portrait (405 × 569) and sized by height with `width: auto`, so a
squarer mark could drop in without touching CSS.

The crest already contains "AUSTIN SPURS" arced under the ball, so the name
technically appears twice. At 66px the arc reads as texture, not text, so it
doesn't compete. **If the crest is ever used large — a shirt, a banner, a poster —
use it alone, without the wordmark beside it.**

### Logo files

| File | Use |
|---|---|
| `assets/img/logo.png` | White crest. Header and footer, on navy. |
| `assets/img/logo-navy.png` | Navy recolour, for light backgrounds. |
| `assets/img/crest.svg` / `crest-hero.svg` | Vector trace. Used for the oversized hero watermark, where a raster would go soft. |
| `assets/img/favicon.png` | Crest on a navy plate — white alone vanishes on a light browser tab. |
| `assets/img/tramps-logo.png` | Mister Tramps wordmark, cleaned and background-removed. Their property, credited in the pub page footer. |

---

## 6. Motion

Hero parallax lives in `initParallax()` in `assets/js/site.js`.

- `SCROLL_TRAVEL = 520` — pixels a depth-1.0 layer moves across one full pass
- `POINTER_TRAVEL = 70` — drift from one edge of the viewport to the other
- Layer depth comes from `data-depth` in the HTML

Current homepage depths: crest `0.85`, halftone dots `1.15`, hairlines `0.45`.

The hairlines are deliberately *slower* despite being foreground — vertical lines
moving vertically is a change nobody can perceive, so they earn their keep on the
horizontal pointer drift instead.

`.hero__stage` is inset `-45% -14%` to give layers room to travel without their
edges sliding into frame. **If you increase travel, increase that inset too.**

All motion is disabled under `prefers-reduced-motion`.

### Hover

Every hover effect on the site is guarded by `@media (hover: hover)`. On touch,
a tap latches the hover state and leaves the element stuck mid-effect — this
already happened once with the Coast to Coast poster.

The pub photos (`.media-row .figure`) zoom to `scale(1.05)` inside their frame
while the shadow deepens. **The zoom is on the `img`, not the `figure`, and that
is not arbitrary:** `.reveal` owns the figure's transform for the scroll-in
animation, and putting a hover transform on the same element makes the photo
jump when it reveals.

That block also restates `opacity` and `transform` in its `transition`. A
`transition` declaration replaces rather than merges, and `.media-row .figure`
outranks `.reveal` — drop them and the scroll-in fade dies silently.

---

## 7. Accessibility — non-negotiable

These were audited and fixed once. Don't regress them.

- **Contrast:** every text/background pair clears 4.5:1. `--muted` and
  `--brass-dk` were specifically darkened to pass. Re-check with a contrast
  calculator before changing any colour token.
- Skip link on every page, `<main id="main">` landmark
- Hamburger has `aria-label` that updates on toggle, closes on Escape
- Visible focus rings on *everything* interactive, not just buttons
- Decorative SVGs and arrows carry `aria-hidden="true"`
- Images have `width`/`height` to prevent layout shift
- Status never communicated by colour alone

---

## 8. Architecture

Static HTML, CSS and vanilla JS. **No build step, no framework, no dependencies.**
This is deliberate — it means the site can't break in a way that requires tooling
to diagnose, and anyone can edit it.

```
index.html            Home — parallax hero, social band, next three, pub section
events.html           Coast to Coast hero + full fixture list with pub lights
tramps.html           Our Pub — painted-wall banner, story, map
coast-to-coast.html   Event landing page, fully C2C-themed
join.html             Email signup — routes out to the official club page
data/site-data.js     ← all content that changes regularly
assets/css/site.css   All styling, tokens at the top
assets/js/site.js     Nav, parallax, reveals, fixture rendering, social
```

`data/site-data.js` is the content layer. Fixtures, pub status, the featured
event, venue details and social links all live there. **Prefer editing it over
touching HTML.**

---

## 9. Live setup

- **Repo:** github.com/jhprovil/atx-spurs-site (public — required for free Pages)
- **Host:** GitHub Pages, `main` / root
- **Domain:** atx-spurs.com, DNS at Wix, A records → GitHub's four IPs
- **Deploy:** any commit to `main` publishes within a minute or two

---

## 10. The name collision — read before adding anything external

**"Austin Spurs" is also the San Antonio Spurs' G League affiliate.** They are a
much larger account holder and they own some of the obvious handles. This will
keep coming up as features and integrations get added.

What's true today, verified:

| Platform | Ours | Theirs |
|---|---|---|
| Instagram | `@austinspurs` ✅ | `@austin_spurs` |
| X | `@austinspurs` ✅ | `@austin_spurs` |
| Facebook | `facebook.com/groups/austinspurs` ✅ | `facebook.com/austinspurs` ⚠️ |

**Note the reversal.** On Instagram and X the plain handle is ours. On Facebook
the plain handle is the basketball team and ours is the *group* URL. Pattern-
matching from one platform to another gets it wrong — that's exactly how the
wrong Facebook link shipped.

**Rule: verify every new handle, link, listing or API result actually points at
the supporters club before using it.** Don't infer from another platform.

Also affected:
- **Search results** — "Austin Spurs" alone returns the basketball team first
- **Any future API or directory listing** — check the sport before trusting a match
- **TikTok, YouTube, Threads** — unclaimed by us so far; check before assuming
- **Google Business / maps listings** — likely to surface them, not us

When in doubt, the disambiguator that works is "Austin Spurs Tottenham" or
"Austin Spurs supporters club."

---

## 11. Signing up runs through Tottenham

Austin Spurs is an **official** supporters club, which changes how signup works.
There is no form on this site. `join.html` explains the route and sends people to:

```
https://www.tottenhamhotspur.com/supporters-clubs/872970/austin-spurs
```

That URL lives in `settings.officialClubUrl` in `site-data.js`. `initForm()` in
`site.js` has three states, in order: club URL → Google Form embed → plain email.
Only the first is in use; the other two exist so the page can never be a dead end.

**Copy consequences, all deliberate:**

- **No cadence is promised.** "One email a week" was removed. A weekly promise is
  one that gets broken in January. The page says "we send when there's something
  worth sending."
- **The privacy line names Tottenham.** It used to say "we keep the list to
  ourselves," which stopped being true the moment signup moved to the club.

### How a signup actually reaches us

```
Someone hits "Join Club" on the Tottenham page
   ↓
Tottenham emails austinspurs@gmail.com with the new member
   ↓
Somebody on our side adds them to the Austin Spurs list   ← manual
   ↓
They start getting our emails
```

So we do hold the addresses and we do send the emails. The copy on `join.html`
is accurate as written.

**The middle step is manual, and that's the fragile part.** Nothing on the
website can tell whether it happened. If nobody is watching austinspurs@gmail.com,
signups sit in the inbox and the person hears nothing — having done everything
right and, from their side, joined successfully. That failure is silent and the
person who suffers it has no way to report it.

**Logan, the chair, watches austinspurs@gmail.com and does the adding.** Joe has
suggested he automate it; whether that happens is Logan's call, so assume it is
manual until told otherwise.

Still unrecorded: **where "the list" physically lives** — Mailchimp, a
spreadsheet, Gmail contacts? It matters for whoever picks this up next.

Coast to Coast on 22 Aug 2026 is the first real load test of the manual step:
one event driving more signups in a weekend than the usual trickle, all needing
hand entry, during the weekend everyone is busy running the event.

---

## 12. Club crests — what we can and can't use

Being an official Tottenham supporters club covers **Tottenham's** marks. It
covers nothing belonging to any other club.

On `events.html` the fixture chip shows two roundels. Neither is a real crest:

- **Brentford** — red with white stripes, their colours, staying that way
- **Tottenham** — white over navy, the shirt-and-shorts split

Joe has approved using Tottenham's official crest once he supplies the file
(`assets/img/crest-tottenham.png`, transparent, 128px+). Until then the roundel
stands. **Don't extract a crest from the Coast to Coast poster** — it's the
Premier League's composite artwork, the badge is ~77px on a 960px JPEG, and it
has no transparency.

---

## 13. Known open items

- **Two pub videos** — waiting on YouTube URLs from a third party. A section is
  planned for the bottom of `tramps.html`; still unclear whether they're short
  atmosphere clips or something longer, which changes the layout.
- **Tottenham crest file** — see §12.
- **`type-options.html` is publicly reachable.** Harmless, nothing links to it,
  delete whenever.
- **TikTok** greyed as "coming soon" until a URL is added.
- **Retire Coast to Coast after 22 Aug 2026** — set `featuredEvent.active: false`.
  The event palette retires with it (§3). The homepage mention is already
  self-retiring: it lives in the Aug 22 fixture note, which drops off the list
  once the date passes.

### Closed since first build

Signup form (superseded, §11) · pub photo placeholders (real photos in, matched
to a shared 3:2 frame) · Facebook link pointing at the basketball team (§10) ·
contrast audit · mobile hero crest bleed · Home/Away chip padding.
