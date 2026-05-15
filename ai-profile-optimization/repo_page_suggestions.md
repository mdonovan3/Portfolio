# Repositories Page — Suggestions
Generated 2026-05-08

---

## Missing repos worth adding

### 1. mdonovan3/InventoryCount (public, Kotlin)
Android inventory counting app — Kotlin. Predecessor to the React Native mobile counting app.
Worth adding as a historical entry showing the Android phase of the mobile tool.
URL: https://github.com/mdonovan3/InventoryCount

### 2. mdonovan3/ImportWineSales (public, R + Batch)
Contains: functions.R, processDBFs.R, wineimport.bat
This is the full Aloha POS ETL pipeline as a standalone repo — same code as the gist
(ev_r_aloha_etl / ev_r_aloha_import) but as a complete runnable project with the batch
file orchestrator. More substantial than the gist alone.
URL: https://github.com/mdonovan3/ImportWineSales

### 3. LHRC/WineListManager (private, Java)
The original Java/JavaFX desktop app (~21k lines, 113 files). Currently private so can't
link directly. Options: make public, or note "available on request" on the page.
URL: https://github.com/LHRC/WineListManager (private)

---

## Issues in current Repositories.jsx

### Bugs / broken links
- `soloRepos[0]` Analytics Engineering Pipeline: url is "#" — no public repo yet.
  Either remove from this page or keep with a note that repo is not yet public.

- `soloRepos[1]` Wine Inventory Analysis: url is "#" AND this is a Shiny app, not a repo.
  Belongs on the Shiny Apps page, not Repositories. Remove from here.

- `soloRepos[2]` Inventory Spot Check: url is "#" AND this is a Quarto gist, not a repo.
  Belongs on Gists page. Remove from here.

- Mobile Counting App (wlmFrontends[1]): url is "#" — no public repo. Fine, but should
  not be a clickable link. Consider removing href or marking explicitly as private.

### Duplicate text
- wlm-web description (line 42): "User authentication via Passport.js with bcrypt;
  PostgreSQL on AWS RDS for all domain data; Passport.js with bcrypt for authentication."
  Passport.js/bcrypt is mentioned twice. Second sentence is redundant.

### Inconsistent framing
- Header says "Most of the wine inventory system code lives in private repositories" but
  react-wine-app is listed with its GitHub URL and is actually private. A visitor clicking
  that link gets a 404. Either note it's private, or only link public repos.

---

## mdonovan3/WineSalesImport (public)
Empty repo (no languages detected). Probably a stale/unused repo. No action needed for
the portfolio page.
