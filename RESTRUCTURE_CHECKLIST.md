# Non-PHP Restructure Checklist (Current Working Phase)

This keeps your project fully static for now, while preparing it for later WordPress conversion.

## 1) Keep current structure working
- Do not move `*.html`, `style.css`, `nutra.css`, `surgical.css`, `vitantra.css`, or `js/*` yet.
- Continue building new pages from `page-template.html`.

## 2) Create new pages fast (2-4 pages)
1. Copy `page-template.html`.
2. Rename (example):
   - `certifications.html`
   - `manufacturing.html`
   - `our-team.html`
   - `why-choose-us.html`
3. Replace placeholders:
   - `{{PAGE_TITLE}}`
   - `{{PAGE_DESCRIPTION}}`
   - `{{PAGE_LABEL}}`
   - `{{PAGE_HEADING}}`
   - `{{PAGE_SUBHEADING}}`
4. Add nav/footer links once each page is final.

## 3) Safe cleanup now (manual)
These are commonly safe to remove if you no longer need them:
- `.DS_Store` files
- `style.css.backup`
- old docs not needed at runtime:
  - `HOMEPAGE_IMPROVEMENTS.md`
  - `INSTALLATION-GUIDE.md`

## 4) Cleanup after content freeze
After all new pages are done, run a full used-vs-unused audit for:
- `images/`
- extra `vitantra-*.html` category pages
- old docs and source files

Then remove only confirmed-unused files.

## 5) Later WordPress step (when ready)
When you say go, we will convert to:
- shared header/footer templates
- enqueue CSS/JS correctly
- page templates from your final HTML pages
- asset folder standardization in one pass
