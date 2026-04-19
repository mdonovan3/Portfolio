import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { ArrowDownward, Construction, Star } from "@mui/icons-material";

const t = {
  slate: "#2c3e50",
  grey: "#7f8c8d",
  greyLight: "#ecf0f1",
  python: "#3572A5",
  dbt: "#e67e22",
  pg: "#336791",
  node: "#1e8449",
};

const NodeCard = ({ title, subtitle, accent }) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      flex: "1 1 0",
      minWidth: 150,
      maxWidth: 230,
      borderLeft: `4px solid ${accent}`,
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 600, color: t.slate, lineHeight: 1.3 }}>
      {title}
    </Typography>
    <Typography variant="caption" sx={{ color: t.grey, lineHeight: 1.4 }}>
      {subtitle}
    </Typography>
  </Paper>
);

const LayerLabel = ({ label, color }) => (
  <Typography
    variant="overline"
    sx={{ color: color || t.grey, fontWeight: 700, letterSpacing: 1.5, mb: 1.5, display: "block" }}
  >
    {label}
  </Typography>
);

const FlowArrow = () => (
  <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
    <ArrowDownward sx={{ color: t.grey, fontSize: 32 }} />
  </Box>
);

const sources = [
  { title: "Aloha POS", subtitle: "DBF files — GNDSALE, GNDITEM, CAT, ITM, EMP", accent: t.python },
  { title: "Restaurant365", subtitle: "JSON files — transactions + GL details", accent: t.python },
];

const ingestionNodes = [
  { title: "ingest_aloha.py", subtitle: "DBF → Parquet + raw.aloha_*", accent: t.python },
  { title: "ingest_r365.py", subtitle: "JSON → Parquet + raw.r365_transactions_raw", accent: t.python },
  { title: "r365_fetch.py", subtitle: "Live OData API → raw (daily incremental)", accent: t.python },
];

const stagingNodes = [
  { title: "stg_aloha_sales", subtitle: "TYPE=1 rows · category + employee names", accent: t.dbt },
  { title: "stg_aloha_items", subtitle: "Item-level detail · menu item names", accent: t.dbt },
  { title: "stg_r365_transactions", subtitle: "Budget filtered · GL parent derived", accent: t.dbt },
];

const martNodes = [
  { title: "fct_daily_sales", subtitle: "Daily net sales by restaurant + category · rolling 7d / 28d avg", accent: t.dbt },
  { title: "fct_r365_wine_cogs", subtitle: "Monthly wine COGS + cost% via 3-part GL formula", accent: t.dbt },
];

const servingNodes = [
  { title: "GET /api/kpis", subtitle: "KPI snapshot per restaurant", accent: t.node },
  { title: "GET /api/sales/daily", subtitle: "Daily sales, filterable", accent: t.node },
  { title: "GET /api/costs/wine", subtitle: "Monthly COGS + cost%", accent: t.node },
];

const keyDecisions = [
  {
    heading: "Staged raw schema",
    body: "Data lands in raw.* exactly as ingested — no joins, no business logic. dbt staging models transform from there. If R365 changes a field name, only the staging model changes; the mart and API are unaffected.",
  },
  {
    heading: "Staging as views, marts as tables",
    body: "Staging models are views (zero storage cost, always current). Mart models are materialized tables — pre-aggregated and fast for the API to query. One dbt run rebuilds the entire chain in under 10 seconds.",
  },
  {
    heading: "Critical Aloha composite key",
    body: "All foreign keys in raw.aloha_* only resolve within the same grind_date. Every join in stg_aloha_* uses entity_id + grind_date as a composite key. Miss the date and you get a cross-join across all history.",
  },
  {
    heading: "Verified COGS formula",
    body: "Wine cost% = (AP Invoice purchases − AP Credit Memos + inventory asset adjustment) / wine sales — three GL accounts, cross-checked against manual R365 reports before encoding in SQL.",
  },
  {
    heading: "Idempotent ingestion",
    body: "Aloha: DELETE-then-INSERT per entity+date. R365: ON CONFLICT DO NOTHING on (transaction_id, gl_account_number). Both scripts can be re-run over the same files without duplicating data.",
  },
  {
    heading: "Portfolio isolation",
    body: "All pipeline writes go to new schemas (raw.*, dbt_staging.*, dbt_marts.*). No production tables — public.*, the operational app's schemas — are touched.",
  },
];

const DEPipeline = () => {
  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <Typography variant="h3" sx={{ color: t.slate }}>
            Analytics Engineering Pipeline
          </Typography>
          <Chip
            icon={<Construction sx={{ fontSize: "0.85rem !important" }} />}
            label="In Progress"
            size="small"
            sx={{ bgcolor: "#f59e0b", color: "white", fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
          A modern data engineering layer built on top of the same PostgreSQL database and source
          data that powers the operational wine management system. Demonstrates how the same
          business logic already running in R — POS sales aggregation, GL-based wine COGS — would
          be structured as a typed, tested, lineage-tracked analytics platform using current DE
          tooling.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          Source data is anonymized and randomized 2024 data from two restaurant locations. The Python
          ingestion layer replaces the R ETL scripts with an explicit raw landing schema and
          Parquet intermediates. dbt handles all transformations downstream.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2.5 }}>
          {["Python", "dbt", "SQL", "PostgreSQL", "Parquet", "Node.js", "Terraform", "AWS EC2", "AWS S3", "AWS RDS"].map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ backgroundColor: t.slate, color: "white", fontSize: "0.72rem" }} />
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
          {[{ color: t.python, label: "Python (ingestion)" }, { color: t.dbt, label: "dbt (transformation)" }, { color: t.node, label: "Node.js (serving)" }].map(({ color, label }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: color, borderRadius: "2px" }} />
              <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Sources */}
        <LayerLabel label="Data Sources (2024)" color={t.python} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {sources.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>

        <FlowArrow />

        {/* Ingestion */}
        <LayerLabel label="Ingestion Layer — Python" color={t.python} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1.5 }}>
          {ingestionNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 0.5 }}>
          Writes Parquet to <code>data/processed/</code> and loads to <code>raw.*</code> in PostgreSQL.
          Idempotent — safe to re-run over the same files.
        </Typography>

        <FlowArrow />

        {/* Raw DB */}
        <LayerLabel label="PostgreSQL — raw schema" color={t.pg} />
        <Paper elevation={3} sx={{ p: 2.5, backgroundColor: t.pg, color: "#fff", borderRadius: 2, mb: 1 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {["raw.aloha_gndsale", "raw.aloha_gnditem", "raw.aloha_cat", "raw.aloha_itm", "raw.aloha_emp", "raw.r365_transactions_raw", "raw.entities"].map((tbl) => (
              <Chip key={tbl} label={tbl} size="small"
                sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.68rem", fontFamily: "monospace" }} />
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block", mt: 1.5 }}>
            Data as-ingested. No joins, no business logic. Isolated from production tables.
          </Typography>
        </Paper>

        <FlowArrow />

        {/* dbt Staging */}
        <LayerLabel label="dbt Staging — views (dbt_staging.*)" color={t.dbt} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          {stagingNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 0.5 }}>
          Views — no storage cost. Resolve FK lookups, cast types, filter to 2024, exclude bad rows.
        </Typography>

        <FlowArrow />

        {/* dbt Marts */}
        <LayerLabel label="dbt Marts — materialized tables (dbt_marts.*)" color={t.dbt} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          {martNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, mb: 0.5,
          backgroundColor: "rgba(230,126,34,0.08)", border: "1px solid rgba(230,126,34,0.3)",
          borderRadius: 1, px: 2, py: 1 }}>
          <Star sx={{ color: t.dbt, fontSize: 18 }} />
          <Typography variant="caption" sx={{ color: t.dbt, fontWeight: 600 }}>
            dbt test runs after every build — not_null on key columns, warn on known source gaps
          </Typography>
        </Box>

        <FlowArrow />

        {/* Serving */}
        <LayerLabel label="Serving — Node.js Express API" color={t.node} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {servingNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
      </Paper>

      {/* dbt Concepts */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: t.slate, fontWeight: 700 }}>
          dbt Patterns Used
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[
            {
              label: "{{ source() }} vs {{ ref() }}",
              body: "source() references external tables (raw.*) that dbt reads but didn't create. ref() references other dbt models — dbt resolves the dependency graph and builds in the correct order automatically.",
            },
            {
              label: "Schema overrides",
              body: "dbt_project.yml sets +schema: dbt_staging for staging models and +schema: dbt_marts for marts, regardless of the target's default schema. Keeps outputs organized without per-model config.",
            },
            {
              label: "Source documentation",
              body: "_sources.yml declares every external table dbt reads from, including column descriptions. Feeds into dbt docs generate — a full data dictionary with lineage graph from a single command.",
            },
            {
              label: "Column-level tests",
              body: "_marts.yml defines not_null tests on every key column. category_name is set to severity: warn rather than error — known source gap, surfaced visibly rather than silently dropped.",
            },
          ].map(({ label, body }) => (
            <Grid item xs={12} sm={6} key={label}>
              <Box sx={{ borderLeft: `3px solid ${t.dbt}`, pl: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: t.slate, mb: 0.5, fontFamily: "monospace" }}>
                  {label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Key Design Decisions */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: t.slate, fontWeight: 700 }}>
          Key Design Decisions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
          {keyDecisions.map(({ heading, body }) => (
            <Box component="li" key={heading} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: t.slate, mb: 0.25 }}>
                {heading}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {body}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default DEPipeline;
