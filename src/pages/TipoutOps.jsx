import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Divider,
  Grid,
  Link,
} from "@mui/material";
import { ArrowDownward, ArrowForward, CheckCircle, Construction, Schedule, Star } from "@mui/icons-material";

const t = {
  slate: "#2c3e50",
  grey: "#7f8c8d",
  greyLight: "#ecf0f1",
  python: "#3572A5",
  dbt: "#e67e22",
  pg: "#336791",
  bash: "#4a5568",
  aloha: "#8e44ad",
  s3: "#e67e22",
};

const STATUS = {
  done: { label: "Complete", bg: "#c6f6d5", fg: "#276749", icon: <CheckCircle sx={{ fontSize: "0.8rem !important" }} /> },
  wip: { label: "In Progress", bg: "#fef3c7", fg: "#92400e", icon: <Construction sx={{ fontSize: "0.8rem !important" }} /> },
  todo: { label: "Not Started", bg: "#e2e8f0", fg: "#718096", icon: <Schedule sx={{ fontSize: "0.8rem !important" }} /> },
};

const NodeCard = ({ title, subtitle, accent, dimmed }) => (
  <Paper
    elevation={dimmed ? 0 : 2}
    sx={{
      p: 2,
      flex: "1 1 0",
      minWidth: 160,
      maxWidth: 260,
      borderLeft: `4px solid ${dimmed ? "#a0aec0" : accent}`,
      backgroundColor: dimmed ? "#f0f2f5" : "#fff",
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 600, color: dimmed ? "#718096" : t.slate, lineHeight: 1.3 }}>
      {title}
    </Typography>
    <Typography variant="caption" sx={{ color: dimmed ? "#909caa" : t.grey, lineHeight: 1.4 }}>
      {subtitle}
    </Typography>
  </Paper>
);

const LayerLabel = ({ label, color, status }) => {
  const s = STATUS[status];
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
      <Typography
        variant="overline"
        sx={{ color: status === "todo" ? "#b0bec5" : (color || t.grey), fontWeight: 700, letterSpacing: 1.5, display: "block" }}
      >
        {label}
      </Typography>
      <Chip
        icon={s.icon}
        label={s.label}
        size="small"
        sx={{ bgcolor: s.bg, color: s.fg, fontWeight: 600, fontSize: "0.65rem", height: 18, "& .MuiChip-icon": { color: `${s.fg} !important` } }}
      />
    </Box>
  );
};

const DimWrap = ({ dim, children }) => (
  <Box sx={{ opacity: dim ? 0.72 : 1, filter: dim ? "grayscale(0.2)" : "none" }}>
    {children}
  </Box>
);

const DetailLink = ({ to }) => (
  <Link
    component={RouterLink}
    to={to}
    sx={{
      display: "inline-flex", alignItems: "center", gap: 0.5, mt: 1,
      fontSize: "0.78rem", fontWeight: 600, color: t.dbt, textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    }}
  >
    Technical details <ArrowForward sx={{ fontSize: "0.9rem" }} />
  </Link>
);

const FlowArrow = () => (
  <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
    <ArrowDownward sx={{ color: t.grey, fontSize: 32 }} />
  </Box>
);

const sources = [
  { title: "Aloha POS", subtitle: "Nightly grind export (DBF) · GNDSALE, GNDITEM, GNDTNDR, GNDAUDIT", accent: t.aloha },
  { title: "OpenTable (planned)", subtitle: "Cover counts for auto-fill — table exists in DB, integration never built", accent: t.grey },
  { title: "Restaurant365 (planned)", subtitle: "Payroll ID cross-reference for employee matching", accent: t.grey },
];

const stagingNodes = [
  { title: "stg_alohadbf_*", subtitle: "79 typed staging models · one common Aloha model shared across both restaurants despite layout divergence", accent: t.dbt },
];

const intermediateNodes = [
  { title: "int_aloha_transfers", subtitle: "GNDITEM (origin) + GNDTNDR (destination) — more reliable than GNDAUDIT alone", accent: t.dbt },
];

const martNodes = [
  { title: "mart_tipout_calc (HVG)", subtitle: "Replaces the Excel formula tabs — blocked on nothing but time", accent: t.dbt },
  { title: "mart_tipout_calc (Ironstone)", subtitle: "Separate calc logic from HVG — blocked on Ironstone rule documentation", accent: t.dbt },
];

const designDecisions = [
  {
    heading: "Two machines, one pipeline",
    body: "poller.py is the only piece that has to run on the restaurant's own POS computer — it redacts PII from a copy of the nightly grind export, zips it, and uploads to S3 landing/. Everything downstream (loader, dbt, archiver) only ever touches S3 and Postgres, so it runs on a schedule in the cloud instead of depending on an always-on restaurant machine.",
  },
  {
    heading: "dlt + dbfread for the loader, not a hand-rolled parser",
    body: "The loader uses dlt with dbfread to turn raw Aloha DBF tables into typed staging tables (raw.alohadbf_*), dedupe-then-append on each nightly run. Tested against real grind data from HVG; S3-as-input path is written but untested — no scoped AWS key exists yet.",
  },
  {
    heading: "GNDITEM + GNDTNDR over GNDAUDIT for transfer detection",
    body: "GNDAUDIT alone isn't reliable ground truth for detecting transfers between employees mid-shift. Pairing GNDITEM (origin) with GNDTNDR (destination) gives a more trustworthy signal — a rule surfaced by reverse-engineering real historical tip-out spreadsheets against the raw POS export.",
  },
  {
    heading: "HVG and Ironstone are not one shared formula set",
    body: "The existing R import script already lands both restaurants' tip-outs in the same employee_tips table, which made it tempting to write one shared calc. Confirmed with the business owner that HVG and Ironstone tip-out rules genuinely diverge — separate mart models per restaurant, not a parameterized single model.",
  },
  {
    heading: "Job code alone can't derive role/section",
    body: "Aloha's JOBCODE field only gives a broad role category. Which section, which specific bar, and which team an employee worked still needs manual input for a given shift — it isn't derivable from POS data alone, which is why the portal (day-of assignment UI) is a required part of the system, not a nice-to-have.",
  },
  {
    heading: "Prototype before pipeline completion, for stakeholder buy-in",
    body: "Built a static interactive walkthrough (prototype/) from real HVG roster, job codes, and six weeks of historical tip totals — before the calc engine existed — so the manager could react to the intended UX (shift setup, next-day review, rate admin) early, without waiting on the dbt marts.",
  },
];

const TipoutOps = () => {
  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <Typography variant="h3" sx={{ color: t.slate }}>
            tipout-ops
          </Typography>
          <Chip
            icon={<Construction sx={{ fontSize: "0.85rem !important" }} />}
            label="Building"
            size="small"
            sx={{ bgcolor: "#f59e0b", color: "white", fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body2" sx={{
          color: "#1e40af", bgcolor: "#eff6ff", border: "1px solid rgba(37,99,235,0.3)",
          borderRadius: 1, px: 2, py: 1.25, mb: 2, fontWeight: 500,
        }}>
          AI-assisted build. The code (Python poller/loader/archiver, dbt models) is AI-authored —
          this project is a hands-on way to learn a modern DE toolchain (dlt, dbt, SCD2, IAM), not
          a demonstration of independent Python proficiency. What's genuinely mine: the domain
          knowledge driving requirements — which POS fields need redacting, what each
          restaurant's real tip-out formula is, and validating pipeline output against real data.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
          Replaces a manager's hand-transcribed Excel tip-out workbook with data pulled directly
          from Aloha POS. Today, sales and tip figures are transcribed by hand from POS printouts
          into a 14-tab workbook whose formulas compute each server/bartender's tip-out — this
          pipeline automates the POS-data-in side of that process, feeding the same downstream
          Postgres table (<code>employee_tips</code>) an existing R import script already writes to.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
          Two restaurants (Harborview Grille live, Ironstone next) with genuinely divergent tip-out
          rules — not a shared formula set. Runs across two machines: a poller on the restaurant's
          own POS computer, and a cloud-scheduled loader → dbt → archiver chain that only touches
          S3 and Postgres.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          The most current example of moving this restaurant group's data stack toward modern DE
          tooling: <b>dlt</b> for ingestion instead of hand-rolled parsing, an S3 landing/archive
          lake with lifecycle-style aging, full <b>SCD2</b> dimension history in dbt so historical
          pay is never misattributed after a POS reference-data change, least-privilege IAM/DB
          roles scoped per pipeline stage, and a nightly GitHub Actions orchestration layer —
          replacing a stack that, until now, has run on manual Excel and ad hoc R scripts.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2.5 }}>
          {["Python", "dlt", "dbt", "SQL", "PostgreSQL", "AWS S3", "AWS RDS", "IAM", "GitHub Actions", "React (planned)", "Aloha POS"].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ backgroundColor: t.slate, color: "white", fontSize: "0.72rem" }}
            />
          ))}
        </Box>
      </Paper>

      {/* Architecture Flow */}
      <Paper elevation={2} sx={{ p: 4, mb: 3, backgroundColor: "#f8f9fa" }}>
        <Typography variant="h5" gutterBottom sx={{ color: t.slate, fontWeight: 700, mb: 3 }}>
          Pipeline Architecture
        </Typography>

        {/* Legend */}
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
          {[
            { color: t.aloha, label: "Aloha POS data" },
            { color: t.bash, label: "on-prem (poller)" },
            { color: t.python, label: "Python (loader / archiver)" },
            { color: t.dbt, label: "dbt (transformation)" },
            { color: t.grey, label: "Planned" },
          ].map(({ color, label }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: color, borderRadius: "2px" }} />
              <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Sources */}
        <LayerLabel label="Data Sources" color={t.aloha} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {sources.map((n) => <NodeCard key={n.title} {...n} dimmed={n.title.includes("planned")} />)}
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mt: 1, mb: 0.5 }}>
          Aloha ingestion is the only source live today. OpenTable and Restaurant365 are planned
          enrichment sources, not yet wired in.
        </Typography>

        <FlowArrow />

        {/* Poller — on-prem */}
        <LayerLabel label="Poller — poller/poller.py (on-prem, POS box, every 15 min)" color={t.bash} status="done" />
        <Paper elevation={3} sx={{ p: 2.5, backgroundColor: t.bash, color: "#fff", borderRadius: 2, mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Redacts PII in a copy of each grind day-folder, zips it, uploads to S3 <code>landing/</code>
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block", mt: 1 }}>
            Working, tested against real grind data. Not yet packaged as a Windows service —
            deployment (PyInstaller + scheduled task) is the remaining gap.
          </Typography>
        </Paper>
        <DetailLink to="/projects/tipout-ops/poller" />

        <FlowArrow />

        {/* Loader */}
        <LayerLabel label="Loader — loader/ (dlt + dbfread, nightly)" color={t.python} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1.5 }}>
          <NodeCard
            title="dlt pipeline"
            subtitle="Raw POS export (DBF) → typed raw.alohadbf_* tables · dedupe-then-append"
            accent={t.python}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1,
          backgroundColor: "rgba(53,114,165,0.08)", border: "1px solid rgba(53,114,165,0.3)",
          borderRadius: 1, px: 2, py: 1 }}>
          <Star sx={{ color: t.python, fontSize: 18 }} />
          <Typography variant="caption" sx={{ color: t.python, fontWeight: 600 }}>
            Tested end to end against real S3 + Postgres (landing → load); a per-day batched run cut a 22-day, two-store reload from a projected ~2 hours to ~23 minutes
          </Typography>
        </Box>
        <DetailLink to="/projects/tipout-ops/loader" />

        <FlowArrow />

        {/* Raw DB */}
        <LayerLabel label="PostgreSQL — raw schema (lhrc_data)" color={t.pg} status="done" />
        <Paper elevation={3} sx={{ p: 2.5, backgroundColor: t.pg, color: "#fff", borderRadius: 2, mb: 1 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {["raw.alohadbf_gndsale", "raw.alohadbf_gnditem", "raw.alohadbf_gndtndr", "raw.alohadbf_gndaudit"].map((tbl) => (
              <Chip key={tbl} label={tbl} size="small"
                sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.68rem", fontFamily: "monospace" }} />
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block", mt: 1.5 }}>
            Data as-ingested. dbt reads from here. Least-privilege roles (<code>ingest_loader</code>,
            <code> ingest_dbt</code>) are scripted but not yet executed.
          </Typography>
        </Paper>

        <FlowArrow />

        {/* dbt Staging — complete */}
        <LayerLabel label="dbt Staging — views" color={t.dbt} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          {stagingNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 0.5 }}>
          One common Aloha model shared across HVG and Ironstone, despite the two restaurants'
          layout divergence in the raw export.
        </Typography>

        <FlowArrow />

        {/* dbt Intermediate — complete */}
        <LayerLabel label="dbt Intermediate — views" color={t.dbt} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          {intermediateNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>

        <FlowArrow />

        {/* dbt Marts — in progress */}
        <LayerLabel label="dbt Marts — the actual tip-out calc" color={t.dbt} status="wip" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          {martNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 1 }}>
          This layer is the point of the project — replacing the Excel formula tabs. HVG is
          unblocked; Ironstone is blocked on a filled-out tip-sheet documenting that restaurant's
          rules.
        </Typography>
        <DetailLink to="/projects/tipout-ops/dbt" />

        <FlowArrow />

        {/* Archiver — in progress */}
        <LayerLabel label="Archiver — archiver/ (S3 lifecycle, nightly)" color={t.python} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          <NodeCard title="archiver.py" subtitle="Ages a day's zip from landing/ to archive/ once past the 30-day reprocess window" accent={t.python} />
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 1 }}>
          Working, tested against real S3 data — a full mock-set run archived every day cleanly.
        </Typography>
        <DetailLink to="/projects/tipout-ops/archiver" />

        <FlowArrow />

        {/* Verify — done */}
        <LayerLabel label="Verify — verify/ (reconciliation, last step of the nightly run)" color={t.python} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          <NodeCard title="verify.py" subtitle="Reconciles S3 and Postgres ground truth per source / store / date / stage into ops.import_status" accent={t.python} />
          <NodeCard title="import-dashboard" subtitle="Local React + FastAPI view over ops.import_status: stat tiles, day-by-day landed / loaded / archived checklist, size and row-count timelines" accent={t.python} />
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 1 }}>
          Same discipline as the rest of my data work: an import isn't "done" until an independent
          check agrees. After a real landing → load → archive → verify pass, every row reconciled
          with zero outstanding issues. Dashboard is local dev only (no auth, not deployed).
        </Typography>

        <FlowArrow />

        {/* CI/CD — not started */}
        <LayerLabel label="Orchestration — GitHub Actions" color={t.python} status="wip" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          <NodeCard title="nightly workflow" subtitle="loader → dbt → archiver → verify on a schedule. Poller stays on-prem — GH runners can't reach the local Aloha file share." accent={t.python} />
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 1 }}>
          Written, but not yet run in GitHub Actions itself — needs repo secrets and the scoped
          DB roles it depends on.
        </Typography>

        <FlowArrow />

        {/* Portal — not started */}
        <DimWrap dim>
          <LayerLabel label="Portal — React app" color={t.grey} status="todo" />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <NodeCard dimmed title="Shift + rate admin UI" subtitle="Day-of station/role assignment, next-day review, rate admin — job code alone can't derive section/team assignment" accent={t.grey} />
          </Box>
        </DimWrap>
      </Paper>

      {/* Prototype callout */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: t.slate, fontWeight: 700 }}>
          Prototype — Stakeholder Buy-In
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Before the calc engine existed, a static interactive walkthrough was built from real
          HVG data — actual roster, real Aloha job codes, real shift assignments, and real
          historical tip totals across six recent weeks — to demo the intended UX (shift setup,
          next-day review, rate admin) to the manager early. It doesn't compute anything live;
          every figure shown is a real historical number, not output from a working calc engine.
        </Typography>
      </Paper>

      {/* Design Decisions */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: t.slate, fontWeight: 700 }}>
          Key Design Decisions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {designDecisions.map(({ heading, body }) => (
            <Grid item xs={12} sm={6} key={heading}>
              <Box sx={{ borderLeft: `3px solid ${t.dbt}`, pl: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: t.slate, mb: 0.5 }}>
                  {heading}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default TipoutOps;
