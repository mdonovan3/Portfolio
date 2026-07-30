# Portfolio — Next Session Notes

## TODO (priority order)

### 0. Consider merging DEPipeline + tipout-ops into one "data platform" project

2026-07-30 (Martin's observation): tipout-ops isn't really a separate pipeline from the
Analytics Engineering Pipeline (DEPipeline.jsx) — it's turning into the same underlying
ingestion+dbt platform on Aloha/restaurant data, with tip-out as the first vertical
application on top. Right now the portfolio tells two competing "Python + dbt on Aloha
data" stories at different maturity levels (DEPipeline's ad hoc ingestion + wine-COGS mart
vs. tipout-ops' dlt + SCD2 + IAM-scoped platform), which dilutes the signal instead of
compounding it. Reframing as one platform with tipout-ops as vertical #1 is a stronger
story (architecture/platform thinking, not a one-off pipeline).

Open questions to resolve next session:
- Does the wine-COGS mart (DEPipeline's other selling point) become vertical #2 on the
  same platform, or get cut/archived from the portfolio?
- Standardize ingestion on dlt (tipout-ops' approach) as the canonical pattern going
  forward, rather than carrying two ingestion styles?

Longer-term direction (not now — separate systems today): wine/inventory currently runs
on its own ETL system (R nightly ETL + Node/Express API + ReactWineApp, see WLM platform).
Martin's read (2026-07-30): eventually the whole thing — including ReactWineApp or
whatever succeeds it — moves onto this same ELT platform, ingesting *all* raw POS data
(not just the transformed wine-specific subset it gets today) and building wine as another
vertical on top, same as tip-out. Not a near-term project; just the direction this is
heading, worth keeping in mind when making platform-vs-pipeline naming/architecture
decisions now so we don't paint ourselves into a corner.
- Practically: merge `DEPipeline.jsx` and `TipoutOps.jsx` (+ its detail subpages) into one
  page/route, update `Repositories.jsx`, nav, and the AI profile docs (ai-profile.html,
  content.html, llms.txt, profile.json) to match — there are now two separate entries in
  each that would need consolidating.

(Prior note, now done: tipout-ops was added to the portfolio 2026-07-30 — overview page +
per-stage detail pages, nav, Repositories.jsx, and AI profile docs all updated. Repo is
still private; flip `is_public` in career DB `portfolio_items` id 37 once it's public.)

---

### 1. Gist code review fixes — Node.js gist (`132dbd29f68042ba9832476e8711fd90`)

Full review was done. Everything else is clean. These are the only actionable items:

**Node.js gist — fix these:**
| Issue | Where | Fix |
|-------|-------|-----|
| `console.log(req.body)` | POST `/` handler (insert product instance) | Delete the line |
| `console.log("Creating a large object with the oid", oid)` | `insertImageToDB` function | Delete the line |
| Empty stub route — `router.get("/forproductid/:pid", ...)` body is completely empty | Near bottom of file | Either implement it or delete the route; as-is it accepts requests and hangs the client |
| `numRemaining` used without `let`/`const` | `averagevaluation` GET handler, inside the `purchases.forEach` loop | Add `let numRemaining` before use |
| Unreachable `res.status(500).json({ success: true, ... })` after `throw error` (×2) | PUT handler callback | Delete the unreachable lines; also note `success: true` on an error response is wrong |

**Not flagged as issues (for reference):**
- All DB connections use `Sys.getenv()` — correct
- `manager@restaurant.com` in email gist is already a placeholder
- `martindonovan3@gmail.com` in author comments is fine — public profile
- `lhrc_data` / `"Bones"` in R gists — real names, but your LinkedIn already says "Blue Ridge Grill / Bones" publicly; low priority
- Java gist `//TODO` comments and `System.out.println` in catch blocks — old desktop app code, leave as-is
- R `message()` calls — appropriate for ETL scripts, not debug noise

**After fixing:** update the static mirror in `public/gists/132dbd29f68042ba9832476e8711fd90.html` to match.

---

### 2. `DataArchitecture.jsx` — add Portfolio Extension section

Currently describes only the operational system. The DEPipeline project extends it and that relationship isn't shown. Add a section or note referencing the dbt layer and linking to `/projects/de-pipeline`.

---

### 3. Write a dbt GitHub Gist + `GistsDbt.jsx` page

The Gists section has SQL, R, and Node.js. Add dbt. A staging model (e.g. `stg_aloha_sales`) or the COGS mart model with comments explaining `{{ source() }}` / `{{ ref() }}` / column tests would fit well. Then:
- Create `src/pages/GistsDbt.jsx` (same pattern as GistsSql/GistsR/GistsNode)
- Add route in `App.jsx`: `/projects/gists/dbt`
- Add nav item in `Layout.jsx` under GitHub Gists

---

### 4. Add GitHub URL for DEPipeline

Currently `url: "#"` in `Repositories.jsx`. Update once repo is public.

---

### 5. Resume experience paragraph

The intro paragraph doesn't mention the dbt/Python portfolio work. Consider adding: "Built an analytics engineering demo layer on top of the same data: Python ingestion to a typed raw schema, dbt staging and mart models, deployed to EC2 via Terraform."

---

### 6. Test portfolio in browser

`npm run dev` in `/home/mdonovan/Projects/career/portfolio`, verify DEPipeline page renders and nav works.

---

## What was done this session

- Replaced hard-coded role fit scores in `ai-profile.html` with a role→evidence matrix
- Added text-based signal boost for Internal Tool Developer and Research Data Support roles
- Added Finance/Ops Analyst and Data Infrastructure Engineer to role matrix
- Added Research Data Support / Lab Data Infrastructure role (Emory-type fit)
- Ran clean-room independent agent assessment of role fit from the evidence files
- Full gist code review: credentials, dead code, red flags (findings above)

## To run locally
```bash
cd /home/mdonovan/Projects/career/portfolio
npm run dev
# → http://localhost:5173
```
