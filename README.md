# Austin Spurs — website

Static site. No build step, no server, no dependencies. Open `index.html` in a browser
and it works. Upload the whole folder to any host and it works there too.

```
austin-spurs/
├── index.html            Home
├── events.html           Fixtures + Mister Tramps status lights
├── tramps.html           Mister Tramps
├── coast-to-coast.html   Aug 22 event
├── join.html             Mailing list signup
├── data/site-data.js     ← THE ONLY FILE YOU EDIT REGULARLY
├── assets/css/site.css
├── assets/js/site.js
└── assets/img/           logo.svg, photo-placeholder.svg
```

---

## The one file you'll actually edit

`data/site-data.js`. Everything the site displays comes from it.

### Turning the pub light green

Find the fixture, change `tramps`:

```js
{ date: "2026-08-29", opponent: "Newcastle United", venue: "H", ...
  tramps: "open" }
```

| value | light | what it says on the site |
|---|---|---|
| `"open"` | green | Tramps is on. Turn up. |
| `"closed"` | red | No group showing for this one. |
| `"tbd"` | amber | Not decided yet. |

Add an optional one-line `note:` to any fixture and it appears under the match.

### Hiding the Coast to Coast banner after August 22

In `featuredEvent`, set `active: false`. Or replace the whole block with the next
thing you want to promote.

---

## Connecting the signup form (5 minutes)

Right now `join.html` shows setup instructions plus an email fallback, so nothing
looks broken to a visitor. To swap in the real form:

1. Sign in to Google as **austinspurs@gmail.com** → create a Form.
   Suggested fields: name, email, "how did you hear about us".
2. In the Form, **Responses** → three-dot menu → turn on email notifications.
   Submissions then land in the Gmail inbox as they come in.
3. **Send** → the `< >` embed tab → copy just the `src="..."` URL.
4. Paste it into `googleFormEmbedUrl` in `data/site-data.js`. Save, refresh.

---

## Swapping in real artwork

Every placeholder is labelled in the HTML with a comment telling you what to replace it with.

- **Logo** — replace `assets/img/logo.svg` with your mark. Keep it square; the header
  box is 52×52 and the file scales to fit.
- **Home hero** — in `index.html`, delete the `<div class="hero__stage">` SVG block and use:
  ```html
  <div class="hero__stage">
    <img src="assets/img/hero.jpg" alt="" data-depth="0.4"
         style="width:100%;height:100%;object-fit:cover">
  </div>
  ```
  The `data-depth` attribute is what makes it move on scroll. Higher number, more movement.
  Anything between `0.2` and `0.6` looks right for a photo.
- **Tramps banner** — same idea in `tramps.html`, inside `.page-hero__art`. Wide and short,
  roughly 1600×360.
- **Mister Tramps logo** — in `tramps.html`, the `.tramps-badge` div. Replace the `<span>`
  with an `<img>`.
- **Matchday photo** — `assets/img/photo-placeholder.svg`, used on `tramps.html`. Around 4:3.

---

## Hosting it

Free options, all of which take a drag-and-drop of this folder:

- **Netlify Drop** — netlify.com/drop. Fastest. Gives you a URL immediately, custom
  domain later.
- **Cloudflare Pages** — same idea, also free, good performance.
- **GitHub Pages** — free, but you need a repo first.

Any of them will serve this without configuration.

---

## About the fixtures

The 2026/27 schedule in `site-data.js` was transcribed from Tottenham Hotspur's official
fixture list, with UK kickoff times converted to US Central. Two matches sit at an unusual
hour because the UK and US change clocks on different weekends — those are flagged with
notes on the site.

Fixtures move. Broadcast selections shift matches to Sundays and Mondays, and cup rounds
depend on the draw. Update `date`, `uk`, and `ct` in the data file when the club confirms
changes.

**Wiring it to a live feed later:** the fixture list renders from `DATA.fixtures` in
`assets/js/site.js`. To pull from an API instead, fetch the data, map it into the same
object shape (`date`, `opponent`, `venue`, `comp`, `uk`, `ct`, `tramps`), and assign it
to `DATA.fixtures` before `initFixtureList()` runs. Nothing else needs to change.
[football-data.org](https://www.football-data.org/) has a free tier that covers the
Premier League. Note the `tramps` status still has to come from you either way — no
feed knows whether the pub is opening.

---

## A note on the design

Tottenham's own site is navy, white, and flat. This one keeps the navy but adds brass and
warm paper — recognisably the same family, clearly not a copy. Worth keeping that
distinction if the club ever looks at it.

### Typography

Tottenham's typeface is a custom family F37 Foundry built for the club. It is proprietary,
all rights reserved, and not licensable — so a cousin is the only legitimate route.

- **Display / lockup:** Saira Condensed. Same squared, slightly condensed, upright caps
  temperature as the club's display cut, without the beak-and-spur terminal detailing that
  makes theirs theirs.
- **Body:** Barlow.

Open `type-options.html` in a browser to compare five candidates side by side, each shown
in the actual lockup, hero headline, and fixture row. To switch:

1. Change `--font-display` in `assets/css/site.css`.
2. Change the Google Fonts `<link>` in the five HTML pages.

`--display-weight` and `--display-track` in the same block let you tune weight and letter
spacing without hunting through the file — every heading, the wordmark, and the fixture
dates all read from those two variables.

### The lockup

Crest at 66px tall, hairline brass rule, then **AUSTIN SPURS**.

The crest is portrait (405 × 569), so it's sized by height with `width: auto` — it finds
its own width and the wordmark never shifts. Swapping in a squarer mark later needs no CSS
change.

### Logo files

All generated from `Austin_Spurs_Logo_white_transparent.png`, trimmed of its transparent
padding so the crest fills its box:

| file | what it's for |
|---|---|
| `logo.png` | White crest. Header and footer, both on navy. |
| `logo-navy.png` | Same crest recoloured navy, for any light background. Not currently used. |
| `favicon.png` | Crest on a navy plate. The white crest alone would vanish on a light browser tab. |

`logo.svg` is the old placeholder crest and is no longer referenced anywhere. Safe to delete.

One thing worth knowing: the crest already carries "AUSTIN SPURS" arced under the ball, so
the name technically appears twice in the lockup. At 66px that arc reads as texture rather
than text, so it doesn't fight the wordmark. If you ever use the crest large — a shirt, a
banner, a poster — use it on its own without the wordmark beside it.
