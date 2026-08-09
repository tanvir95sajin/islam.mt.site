# tanvir95sajin.github.io

Source for Md. Tanvirul Islam's research site — plain HTML/CSS/JS, no build step, no framework. Designed to be pushed straight to GitHub Pages.

## 1. Put this on GitHub

```bash
cd website          # this folder
git init
git add .
git commit -m "Initial site"
```

**Option A — personal site at `tanvir95sajin.github.io`** (recommended, matches the links already wired into this site):
1. On GitHub, create a new repository named exactly `tanvir95sajin.github.io`.
2. `git remote add origin https://github.com/tanvir95sajin/tanvir95sajin.github.io.git`
3. `git push -u origin main`
4. In the repo, go to **Settings → Pages** and confirm the source is the `main` branch, root folder. A repo named this way is published automatically at `https://tanvir95sajin.github.io/` with no further config.

**Option B — a project repo** (e.g. `github.com/tanvir95sajin/research-site`):
1. Create the repo, push the same way.
2. Go to **Settings → Pages**, set source to the `main` branch, `/ (root)` folder, and save.
3. Site publishes at `https://tanvir95sajin.github.io/research-site/`.

Either way, first deploys can take 1–2 minutes.

## 2. Fill in the placeholders

Open `assets/js/config.js` and replace anything marked `REPLACE_ME`:
- `linkedin` — your LinkedIn URL
- `scholar` — your Google Scholar profile URL
- `twitter` — your X/Twitter URL
- `website` — update if you go with Option B above

Your GitHub and email links are already filled in from your CV.

A phone number was intentionally left off the public site — add one to `config.js` and the footer markup yourself if you want it listed.

## 3. Add a new blog post

1. Write the post as Markdown in `blog/posts/your-slug.md` (no front matter needed — just start writing).
2. Add one entry to the **top** of the array in `blog/posts.json`:
   ```json
   {
     "slug": "your-slug",
     "title": "Your title",
     "date": "2026-08-09",
     "excerpt": "One or two sentences for the list view."
   }
   ```
3. Commit and push. That's it — no build step.

## 4. Preview locally before pushing

The blog fetches JSON/Markdown files at runtime, which browsers block over `file://`. Serve the folder instead:

```bash
cd website
python3 -m http.server 8000
# then open http://localhost:8000
```

## Structure

```
website/
├── index.html            # home / about
├── research.html
├── publications.html
├── projects.html
├── blog/
│   ├── index.html        # post list (reads posts.json)
│   ├── post.html          # single post viewer (?post=slug)
│   ├── posts.json         # one entry per post, newest first
│   └── posts/*.md         # post content
├── assets/
│   ├── css/style.css
│   ├── js/{config,nav,blog}.js
│   └── cv.pdf
└── favicon.svg
```

## Notes

- Publications currently mirror the CV exactly. If newer papers (e.g. anything still in review) should go public, add a `pub` block to `publications.html` — happy to help wire that up when it's ready to be public.
- Design language: a dark "control room" palette with a copper/teal single-line-diagram motif, Space Grotesk for headings, Source Serif 4 for body text, IBM Plex Mono for labels/data.
