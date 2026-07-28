# Portfolio — Next Session Notes

## TODO (priority order)

### 0. Add tipout-ops to portfolio once built out

New repo `mdonovan3/tipout-ops` (private, cloned 2026-07-28 to `~/Projects/tipout-ops`) —
automates BRG/Bones weekly server tip-out calc from Aloha POS, replacing a manual Excel
workbook. Currently planning stage (prototype demo only, no production code). Once the
loader/dbt/portal pieces are real:
- Add a project page/section here (similar treatment to DEPipeline)
- Make the GitHub repo public, link it in `Repositories.jsx`
- Add to resume experience paragraph
- Logged in career DB `portfolio_items` id 37 (`is_public=false`, `in_progress=true`) —
  flip `is_public` there too once it's live

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
