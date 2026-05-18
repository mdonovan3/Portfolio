import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Divider,
  Grid,
} from "@mui/material";
import { ArrowDownward, CheckCircle, Construction, Star } from "@mui/icons-material";

const t = {
  slate: "#2c3e50",
  grey: "#7f8c8d",
  greyLight: "#ecf0f1",
  r: "#276DC3",
  dbt: "#e67e22",
  pg: "#336791",
  bash: "#4a5568",
  cdc: "#c0392b",
  epa: "#27ae60",
};

const NodeCard = ({ title, subtitle, accent, dimmed }) => (
  <Paper
    elevation={dimmed ? 0 : 2}
    sx={{
      p: 2,
      flex: "1 1 0",
      minWidth: 160,
      maxWidth: 240,
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

const LayerLabel = ({ label, color, status }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
    <Typography
      variant="overline"
      sx={{ color: status === "todo" ? "#b0bec5" : (color || t.grey), fontWeight: 700, letterSpacing: 1.5, display: "block" }}
    >
      {label}
    </Typography>
    {status === "done" && (
      <Chip
        icon={<CheckCircle sx={{ fontSize: "0.8rem !important", color: "#276749 !important" }} />}
        label="Complete"
        size="small"
        sx={{ bgcolor: "#c6f6d5", color: "#276749", fontWeight: 600, fontSize: "0.65rem", height: 18 }}
      />
    )}
    {status === "todo" && (
      <Chip
        label="In Progress"
        size="small"
        sx={{ bgcolor: "#e2e8f0", color: "#718096", fontWeight: 600, fontSize: "0.65rem", height: 18 }}
      />
    )}
  </Box>
);

const TodoWrap = ({ children }) => (
  <Box sx={{ opacity: 0.72, filter: "grayscale(0.2)" }}>
    {children}
  </Box>
);

const FlowArrow = () => (
  <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
    <ArrowDownward sx={{ color: t.grey, fontSize: 32 }} />
  </Box>
);

const sources = [
  {
    title: "CDC PLACES",
    subtitle: "County health prevalence · 40 measures · 2019–2023",
    accent: t.cdc,
  },
  {
    title: "EPA AQS",
    subtitle: "Annual PM2.5 by monitor · parameter 88101 · 2019–2024",
    accent: t.epa,
  },
  {
    title: "CDC SVI (pending)",
    subtitle: "County vulnerability percentile · 2018/2020/2022",
    accent: t.grey,
  },
  {
    title: "USDA RUCC (pending)",
    subtitle: "Urban/rural classification · 9 codes · 2023",
    accent: t.grey,
  },
];

const ingestionNodes = [
  {
    title: "load_places.R",
    subtitle: "Clean names · rename · cast · county_fips pad · dbWriteTable",
    accent: t.r,
  },
  {
    title: "load_epa_pm25.R",
    subtitle: "Filter param 88101 · build county_fips · dbWriteTable",
    accent: t.r,
  },
];

const stagingNodes = [
  {
    title: "stg_places_county",
    subtitle: "Age-adjusted rows only · typed columns · FIPS as text",
    accent: t.dbt,
  },
  {
    title: "stg_epa_pm25",
    subtitle: "obs_pct ≥ 75 coverage filter · rename arithmetic_mean → pm25_mean",
    accent: t.dbt,
  },
];

const intermediateNodes = [
  {
    title: "int_places_epa_join",
    subtitle: "Aggregate PM2.5 to county-year · left join health measures",
    accent: t.dbt,
  },
];

const martNodes = [
  {
    title: "mart_epi_analysis",
    subtitle: "Pivoted health outcomes + PM2.5 · all dimensions · final analysis table",
    accent: t.dbt,
  },
];

const servingNodes = [
  {
    title: "quarto/epi_report.qmd",
    subtitle: "Static report · summary tables, prevalence, scatter",
    accent: t.r,
  },
  {
    title: "shiny/app.R",
    subtitle: "Interactive dashboard · county table, value boxes, scatter",
    accent: t.r,
  },
];

const datasets = [
  {
    name: "CDC PLACES",
    key: "locationid → county_fips",
    what: "Age-adjusted prevalence estimates for 40+ chronic disease and health behavior measures at the county level. Outcomes include OBESITY, DIABETES, CHD, STROKE, COPD, COPD, CASTHMA, DEPRESSION, CSMOKING, LPA, BINGE, SLEEP. Sourced from Socrata API — three dataset releases cover 2019–2023.",
    color: t.cdc,
  },
  {
    name: "EPA AQS",
    key: "state_code + county_code → county_fips",
    what: "Annual mean PM2.5 concentration (µg/m³) aggregated from individual monitor readings. Full source files contain all pollutants — pipeline filters to parameter code 88101 (PM2.5 FRM/FEM). Ozone (44201) and NO2 (42602) are available in the same files for future expansion. Monitors are averaged to county-year.",
    color: t.epa,
  },
  {
    name: "CDC SVI (pending)",
    key: "FIPS",
    what: "Composite social vulnerability percentile (RPL_THEMES 0–1) plus four theme scores: socioeconomic, household composition, minority status/language, housing/transportation. Releases 2018/2020/2022 — year-matched to PLACES data. Downloaded to data/source/_pending_svi/.",
    color: t.grey,
  },
  {
    name: "USDA RUCC (pending)",
    key: "FIPS",
    what: "9-category rural/urban classifier: codes 1–3 are metro, 4–6 are suburban/small city, 7–9 are rural. Static — does not change year to year. File is long format and needs pivot to wide before joining. Downloaded to data/source/_pending_rucc/.",
    color: t.grey,
  },
];

const designDecisions = [
  {
    heading: "File lifecycle — source → batches → raw → processed",
    body: "Full source files (data/source/) are split by year into data/source/batches/ by split_source_data.R. The simulate_drop.sh script copies a year's batch into data/raw/ to mimic an external delivery. The cron poller ingests from data/raw/ and moves files to data/processed/ on success.",
  },
  {
    heading: "Idempotent ingestion via already_loaded()",
    body: "The first run uses overwrite=TRUE to build the table. Subsequent runs check already_loaded(year) — a COUNT(*) WHERE year = ? query — and skip if data exists. Prevents double-loading when the cron job retries or simulate_drop.sh reruns.",
  },
  {
    heading: "Staging as views, mart as materialized table",
    body: "Staging models (stg_*) and the intermediate join are views — always current, zero storage. mart_epi_analysis is a materialized table so Shiny and Quarto query a pre-aggregated result without re-running joins on every page load.",
  },
  {
    heading: "county_fips as universal join key",
    body: "All datasets join on 5-digit zero-padded FIPS (state 2-digit + county 3-digit). PLACES provides it directly as locationid. EPA requires string concat of state_code and county_code with zero-padding. SVI provides it as FIPS. RUCC provides it as FIPS.",
  },
  {
    heading: "EPA coverage filter",
    body: "Monitors with obs_pct < 75 (fewer than 75% of expected observations in the year) are excluded in the staging model. Prevents counties with sparse monitor coverage from skewing the county-year mean.",
  },
  {
    heading: "SVI and RUCC as future enrichment layers",
    body: "Both are downloaded and stored in _pending_ source folders. Integration is blocked on dbt seed setup and a pivot for RUCC. Adding them would enable rural/urban stratification and vulnerability-adjusted exposure analysis.",
  },
];

const EpiPipeline = () => {
  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <Typography variant="h3" sx={{ color: t.slate }}>
            Public Health Epi Pipeline
          </Typography>
          <Chip
            icon={<Construction sx={{ fontSize: "0.85rem !important" }} />}
            label="In Progress"
            size="small"
            sx={{ bgcolor: "#f59e0b", color: "white", fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
          An end-to-end epidemiological data pipeline linking CDC chronic disease prevalence
          estimates to EPA air quality measurements at the county level. The pipeline ingests
          multi-year public datasets, transforms them through a dbt layer, and surfaces the joined
          data in both a static Quarto report and an interactive R Shiny dashboard.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          Covers 2019–2023 across ~3,000 US counties. Designed to simulate realistic data delivery
          — source files are split by year and dropped into an ingestion inbox that a cron-driven
          poller monitors. Social vulnerability (CDC SVI) and rural classification (USDA RUCC)
          are downloaded and staged as pending enrichment layers.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2.5 }}>
          {["R", "dbt", "SQL", "PostgreSQL", "R Shiny", "Quarto", "Bash", "cron", "AWS RDS", "CDC PLACES", "EPA AQS"].map((tag) => (
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
            { color: t.cdc, label: "CDC data" },
            { color: t.epa, label: "EPA data" },
            { color: t.r, label: "R (ingestion / serving)" },
            { color: t.dbt, label: "dbt (transformation)" },
            { color: t.grey, label: "Pending" },
          ].map(({ color, label }) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: color, borderRadius: "2px" }} />
              <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Sources */}
        <LayerLabel label="Data Sources" color={t.cdc} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {sources.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mt: 1, mb: 0.5 }}>
          Download scripts in <code>docs/data_sources/</code>. Full files land in <code>data/source/</code>.
        </Typography>

        <FlowArrow />

        {/* Split */}
        <LayerLabel label="Year Split — scripts/split_source_data.R" color={t.r} status="done" />
        <Paper elevation={3} sx={{ p: 2.5, backgroundColor: t.r, color: "#fff", borderRadius: 2, mb: 1 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {["places_county_2019.csv", "places_county_2020.csv", "…2023.csv", "epa_pm25_2019.csv", "…2024.csv"].map((f) => (
              <Chip key={f} label={f} size="small"
                sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.68rem", fontFamily: "monospace" }} />
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block", mt: 1.5 }}>
            One file per dataset-year in <code>data/source/batches/</code>. EPA filtered to parameter 88101 at this step.
          </Typography>
        </Paper>

        <FlowArrow />

        {/* Simulate + Cron */}
        <LayerLabel label="Simulate Delivery — scripts/simulate_drop.sh + cron/poll_and_run.sh" color={t.bash} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <NodeCard
            title="simulate_drop.sh [year]"
            subtitle="Copies batch file into data/raw/ — mimics external data delivery"
            accent={t.bash}
          />
          <NodeCard
            title="poll_and_run.sh (cron)"
            subtitle="Runs every minute · detects new files in data/raw/ · triggers ingestion"
            accent={t.bash}
          />
        </Box>

        <FlowArrow />

        {/* Ingestion — marked complete */}
        <LayerLabel label="Ingestion — R" color={t.r} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1.5 }}>
          {ingestionNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1,
          backgroundColor: "rgba(39,109,195,0.08)", border: "1px solid rgba(39,109,195,0.3)",
          borderRadius: 1, px: 2, py: 1 }}>
          <Star sx={{ color: t.r, fontSize: 18 }} />
          <Typography variant="caption" sx={{ color: t.r, fontWeight: 600 }}>
            already_loaded() guard prevents double-loading — safe to re-run
          </Typography>
        </Box>

        <FlowArrow />

        {/* Raw DB — complete (populated by ingestion) */}
        <LayerLabel label="PostgreSQL — public schema (raw tables)" color={t.pg} status="done" />
        <Paper elevation={3} sx={{ p: 2.5, backgroundColor: t.pg, color: "#fff", borderRadius: 2, mb: 1 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {["places_county_raw", "epa_pm25_raw"].map((tbl) => (
              <Chip key={tbl} label={tbl} size="small"
                sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.68rem", fontFamily: "monospace" }} />
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block", mt: 1.5 }}>
            Data as-ingested. No joins, no business logic. dbt reads from here.
          </Typography>
        </Paper>

        <FlowArrow />

        {/* dbt Staging — complete */}
        <LayerLabel label="dbt Staging — views" color={t.dbt} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          {stagingNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 0.5 }}>
          Views — typed columns, FIPS normalization, EPA coverage filter (obs_pct ≥ 75).
        </Typography>

        <FlowArrow />

        {/* dbt Intermediate — complete */}
        <LayerLabel label="dbt Intermediate — views" color={t.dbt} status="done" />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
          {intermediateNodes.map((n) => <NodeCard key={n.title} {...n} />)}
        </Box>
        <Typography variant="caption" sx={{ color: t.grey, display: "block", mb: 0.5 }}>
          Aggregates PM2.5 monitors to county-year mean, then left-joins to PLACES health measures.
        </Typography>

        <FlowArrow />

        {/* Mart and Serving still in progress */}
        <TodoWrap>
          {/* dbt Marts */}
          <LayerLabel label="dbt Marts — materialized table" color={t.dbt} status="todo" />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
            {martNodes.map((n) => <NodeCard key={n.title} {...n} dimmed />)}
          </Box>
          <Typography variant="caption" sx={{ color: "#909caa", display: "block", mb: 1 }}>
            Pivoted health outcomes (OBESITY, DIABETES, CHD, STROKE, COPD, CASTHMA, CANCER, DEPRESSION,
            HIGHCHOL, BPHIGH, CSMOKING, BINGE, LPA, SLEEP, ACCESS2, FOODINSECU, MHLTH) joined to county-year PM2.5.
          </Typography>

          <FlowArrow />

          {/* Serving */}
          <LayerLabel label="Analysis & Serving — R" color={t.r} status="todo" />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {servingNodes.map((n) => <NodeCard key={n.title} {...n} dimmed />)}
          </Box>
        </TodoWrap>
      </Paper>

      {/* Data Sources Detail */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: t.slate, fontWeight: 700 }}>
          Data Sources
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {datasets.map(({ name, key, what, color }) => (
            <Box key={name} sx={{ borderLeft: `4px solid ${color}`, pl: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                <Typography variant="body1" sx={{ fontWeight: 700, color: t.slate }}>
                  {name}
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: "monospace", color, fontWeight: 600, bgcolor: `${color}18`, px: 1, py: 0.25, borderRadius: 1 }}>
                  join key: {key}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {what}
              </Typography>
            </Box>
          ))}
        </Box>
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

export default EpiPipeline;
