import {
  Container,
  Paper,
  Typography,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import { GitHub, SmartToy, Construction, Storage, Web } from "@mui/icons-material";

const NAVY = "#2c3e50";
const SLATE = "#34495e";

// ── Solo repos (all own work) ─────────────────────────────────────────────────

const soloRepos = [
  {
    title: "Analytics Engineering Pipeline — dbt Data Platform",
    description:
      "A modern analytics engineering layer built on the same PostgreSQL database and source data as the wine management system. Python ingestion scripts load Aloha POS DBF files and Restaurant365 GL transactions into a typed raw schema. dbt handles all transformations: staging views that clean and resolve foreign keys, and mart tables that compute daily sales by category and monthly wine COGS using a verified three-part GL formula. Deployed to AWS EC2 via Terraform with an S3 data lake. Demonstrates how the same business logic already running in R would be structured using current DE tooling — typed, tested, lineage-tracked. In progress.",
    url: "#",
    tags: ["Python", "dbt", "SQL", "PostgreSQL", "Parquet", "Node.js", "Terraform", "AWS EC2", "AWS S3", "AWS RDS"],
    inProgress: true,
  },
  {
    title: "Wine Inventory Analysis",
    description:
      "R Shiny dashboard for period-over-period wine inventory analysis at a multi-location fine dining group. Tracks beginning and ending inventory values, count variances against theoretical on-hand, vendor purchases, and glass and bottle sales — with cost of sales and wine cost percentage calculated automatically. Supports URL parameter deep-linking for direct period access. Backed by PostgreSQL on AWS RDS.",
    url: "#",
    tags: ["R", "Shiny", "PostgreSQL", "shinydashboard", "DT", "restaurant analytics", "RDS"],
  },
  {
    title: "Inventory Spot Check",
    description:
      "Quarto-based inventory spot check report for a fine dining wine program. Pulls theoretical on-hand quantities from a PostgreSQL stored function, combines with post-count sales and purchase activity, and renders a paginated, room-by-room table formatted for physical spot checking against actual cellar counts for products that were purchased or sold since the last inventory count. Generated as a print-ready Word document.",
    url: "#",
    tags: ["R", "Quarto", "PostgreSQL", "gt", "inventory", "restaurant analytics", "RDS"],
  },
  {
    title: "Aloha POS Wine Sales ETL",
    description:
      "Nightly R pipeline ingesting Aloha POS DBF exports into PostgreSQL. Reads binary GNDITEM, CAT, ITM, and EMP tables; resolves PLU codes to product instances via a cross-reference table; routes each export to the correct restaurant database by reading the UNITNUMBER from Aloha.ini; and bulk-inserts via dbWriteTable in a transaction. Idempotent — already-imported dates are skipped on re-run. Credentials via .Renviron, not committed.",
    url: "https://github.com/mdonovan3/ImportWineSalesPortfolio",
    tags: ["R", "PostgreSQL", "ETL", "DBI", "RPostgres", "tidyverse", "DBF"],
  },
  {
    title: "Wine List Manager — Web Application (Express)",
    description:
      "Node.js/Express web application for managing a restaurant wine program across multiple locations. Server-rendered EJS views over a 14-endpoint REST API backed by PostgreSQL on AWS RDS. Covers product catalog management, cellar inventory, vendor invoice tracking, and wine list organization. Authentication via Passport.js with bcrypt.",
    url: "https://github.com/mdonovan3/wlm-web",
    tags: ["Node.js", "Express", "PostgreSQL", "EJS", "Passport.js", "REST API", "jQuery"],
  },
];

// ── WLM Platform group ────────────────────────────────────────────────────────

const wlmBackend = {
  title: "Wine List Manager — Backend & API",
  description:
    "Node.js/Express REST API and PostgreSQL schema powering the full WLM platform across two restaurant locations. 14+ endpoints covering inventory counts, sales reporting, purchasing, product management, and analytics. JWT auth, per-restaurant middleware guards, and stored functions for perpetual inventory math. The data model, all server-side code, and SQL stored procedures are my own work developed over several years — the React and mobile frontends below are clients to this backend.",
  tags: ["Node.js", "Express", "PostgreSQL", "JWT", "AWS RDS", "stored functions"],
  url: "https://github.com/mdonovan3/react-wine-app",
};

const wlmFrontends = [
  {
    title: "React Web App",
    description:
      "Full-stack React / MUI web app consolidating inventory counting, sales reporting, purchasing, and analytics. Built on the backend above. The React frontend was built with Claude (AI) as a primary tool — used to produce a substantially better UI and consolidate features from R Shiny apps, the Express app, and manual spreadsheets into one interface. In progress.",
    tags: ["React", "MUI", "React Query", "AI-assisted frontend"],
    url: "https://github.com/mdonovan3/react-wine-app",
    inProgress: true,
  },
  {
    title: "Mobile Counting App (React Native)",
    description:
      "Expo/TypeScript mobile app replacing paper-based room-by-room counting. Offline-first with SQLite staging that syncs to PostgreSQL on submit. Room claim/lock flow, session scoping, admin controls. The React Native frontend was built with AI assistance; backend and data model are the same as above. In progress.",
    tags: ["React Native", "Expo", "TypeScript", "SQLite", "Zustand", "AI-assisted frontend"],
    url: "#",
    inProgress: true,
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const TagRow = ({ tags }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
    {tags.map((t) => (
      <Chip key={t} label={t} size="small" sx={{ fontSize: "0.68rem", height: 20 }} />
    ))}
  </Box>
);

const SoloRepoRow = ({ repo, divider }) => (
  <Box>
    <Box
      component="a"
      href={repo.url}
      target="_blank"
      sx={{
        display: "flex", gap: 2, py: 2, px: 1, textDecoration: "none",
        borderRadius: 1,
        "&:hover": { backgroundColor: "rgba(0,0,0,0.03)" },
      }}
    >
      <GitHub sx={{ color: "#7f8c8d", flexShrink: 0, mt: 0.25 }} />
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: NAVY }}>
            {repo.title}
          </Typography>
          {repo.inProgress && (
            <Chip icon={<Construction sx={{ fontSize: "0.75rem !important" }} />}
              label="In Progress" size="small"
              sx={{ fontSize: "0.65rem", height: 18, bgcolor: "#f59e0b", color: "white" }} />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
          {repo.description}
        </Typography>
        <TagRow tags={repo.tags} />
      </Box>
    </Box>
    {divider && <Divider />}
  </Box>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const Repositories = () => (
  <Container maxWidth="lg">
    <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ color: NAVY }}>
        Code Repositories
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Full project repositories hosted on GitHub. Most of the wine inventory
        system code lives in private repositories; the gists and Shiny apps
        pages contain the publicly shared components.
      </Typography>
    </Paper>

    {/* ── Solo repos (own work) ── */}
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {soloRepos.map((repo, i) => (
        <SoloRepoRow key={repo.title} repo={repo} divider={i < soloRepos.length - 1} />
      ))}
    </Paper>

    {/* ── WLM Platform group ── */}
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="overline" sx={{ color: "#7f8c8d", fontWeight: 700, letterSpacing: 1.5 }}>
        Full-Stack Platform
      </Typography>

      {/* Backend — emphasized */}
      <Box sx={{
        mt: 1.5, mb: 2, p: 2.5,
        border: `2px solid ${NAVY}`,
        borderRadius: 2,
        backgroundColor: "#f8f9fa",
      }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Storage sx={{ color: NAVY, flexShrink: 0, mt: 0.25 }} />
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: NAVY }}>
                {wlmBackend.title}
              </Typography>
              <Chip label="My own work" size="small"
                sx={{ fontSize: "0.65rem", height: 18, bgcolor: NAVY, color: "white" }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
              {wlmBackend.description}
            </Typography>
            <TagRow tags={wlmBackend.tags} />
          </Box>
        </Box>
      </Box>

      {/* Frontends — AI-assisted, visually subordinate */}
      <Box sx={{ pl: 3, borderLeft: `3px solid #ecf0f1` }}>
        <Typography variant="caption" sx={{ color: "#7f8c8d", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "block", mb: 1 }}>
          Frontends — AI-assisted
        </Typography>
        {wlmFrontends.map((fe, i) => (
          <Box key={fe.title}>
            <Box
              component="a"
              href={fe.url}
              target="_blank"
              sx={{
                display: "flex", gap: 2, py: 1.5, px: 1, textDecoration: "none",
                borderRadius: 1,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.03)" },
              }}
            >
              <Web sx={{ color: "#7f8c8d", flexShrink: 0, mt: 0.25, fontSize: 20 }} />
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: SLATE }}>
                    {fe.title}
                  </Typography>
                  {fe.inProgress && (
                    <Chip icon={<Construction sx={{ fontSize: "0.7rem !important" }} />}
                      label="In Progress" size="small"
                      sx={{ fontSize: "0.62rem", height: 16, bgcolor: "#f59e0b", color: "white" }} />
                  )}
                  <Chip icon={<SmartToy sx={{ fontSize: "0.7rem !important" }} />}
                    label="AI-assisted" size="small"
                    sx={{ fontSize: "0.62rem", height: 16, bgcolor: "#e3f2fd", color: "#1976d2" }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6, fontSize: "0.8rem" }}>
                  {fe.description}
                </Typography>
                <TagRow tags={fe.tags} />
              </Box>
            </Box>
            {i < wlmFrontends.length - 1 && <Divider sx={{ my: 0.5 }} />}
          </Box>
        ))}
      </Box>
    </Paper>
  </Container>
);

export default Repositories;
