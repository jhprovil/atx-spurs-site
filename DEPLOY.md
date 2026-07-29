	# Getting atx-spurs.com online

Start to finish, this is about 30 minutes of your time plus waiting on DNS.
No terminal required.

---

## Step 1 — Install GitHub Desktop

1. Download from **[desktop.github.com](https://desktop.github.com)** and install it.
2. Open it and sign in. If you don't have a GitHub account yet, create one at
   [github.com/signup](https://github.com/signup) first — free is fine.

---

## Step 2 — Turn this folder into a repository

1. In GitHub Desktop: **File → Add Local Repository**
2. Choose this folder:
   `Claude - Austin Spurs Folder/atx-spurs-site`
3. It will say *"This directory does not appear to be a Git repository."*
   Click **create a repository** in that message.
4. Fill in:
   - **Name:** `atx-spurs-site`
   - **Description:** Austin Spurs — Tottenham Hotspur supporters group
   - Leave "Git ignore" and "License" as None. There's already a `.gitignore` here.
5. Click **Create Repository**.

---

## Step 3 — Publish it

1. Click **Publish repository** at the top.
2. **Uncheck "Keep this code private."**

   This matters: GitHub Pages only serves public repos on the free plan. If you'd
   rather keep the code private, skip Pages and use Netlify or Cloudflare Pages
   instead — both serve private repos free and connect to GitHub the same way.
3. Click **Publish repository**.

Your code is now on GitHub. That alone gives you full version history and a backup.

---

## Step 4 — Switch on GitHub Pages

1. Go to your repo on github.com (GitHub Desktop → **Repository → View on GitHub**).
2. **Settings → Pages** in the left sidebar.
3. Under **Source**, choose **Deploy from a branch**.
4. Branch: **main**, folder: **/ (root)**. Click **Save**.
5. Wait a couple of minutes. The page will show a live URL like
   `https://yourusername.github.io/atx-spurs-site/`

Open it. The whole site should work — it's plain HTML, CSS and JavaScript with no
build step, which is exactly why this is so simple.

---

## Step 5 — Point atx-spurs.com at it

There's already a `CNAME` file in this folder containing `atx-spurs.com`, which is
how GitHub knows which domain to answer for.

**At your domain registrar** (wherever you bought atx-spurs.com), open the DNS
settings and add these records:

| Type  | Name / Host | Value                   |
|-------|-------------|-------------------------|
| A     | `@`         | `185.199.108.153`       |
| A     | `@`         | `185.199.109.153`       |
| A     | `@`         | `185.199.110.153`       |
| A     | `@`         | `185.199.111.153`       |
| CNAME | `www`       | `yourusername.github.io.` |

Replace `yourusername` with your actual GitHub username. Keep the trailing dot on
the CNAME value if your registrar shows one.

Then back in **Settings → Pages**:

1. Under **Custom domain**, enter `atx-spurs.com` and click **Save**.
2. Wait for the DNS check to pass — usually under an hour, occasionally up to 24.
3. Once it passes, tick **Enforce HTTPS**. GitHub issues the certificate free.

---

## Making changes after this

Every time you or I edit files in this folder:

1. Open GitHub Desktop. Changed files appear on the left.
2. Type a short summary in the box at the bottom left — "Update fixture status"
   or similar.
3. Click **Commit to main**, then **Push origin** at the top.

The live site updates within a minute or two. That's the whole loop.

---

## Before you go live — two things still open

Neither blocks deploying, but both should be closed before you promote the URL:

1. **The signup form isn't connected.** `join.html` currently shows setup
   instructions instead of a real form. See the "Connecting the signup form"
   section in `README.md` — about five minutes.
2. **Placeholder images.** The two photos on the pub page and the group photo are
   labelled placeholders. Everything else — crest, Tramps logo, Coast to Coast
   poster — is real artwork.

---

## Things worth knowing

- **`type-options.html` will be publicly reachable** at
  `atx-spurs.com/type-options.html`. It's the font comparison page I built for
  you, harmless but not meant for visitors. Delete it before launch if you'd
  rather it not exist, or leave it — nothing links to it.
- **The `data/site-data.js` file is public**, like everything else in the repo.
  That's fine — it holds fixtures and pub status, nothing sensitive. Never put
  passwords or API keys in this folder.
- **Your email address is on the site in plain text.** That's a deliberate
  trade-off: easy for supporters to reach you, and also visible to scrapers.
  Once the Google Form is connected, you could remove the `mailto:` links if the
  spam becomes a nuisance.
