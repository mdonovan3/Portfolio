import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Alert,
  Button,
  Collapse,
  IconButton,
  Link,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  SmartToy,
  Person,
  Storage,
  Web,
  Launch,
  GitHub,
  Construction,
} from "@mui/icons-material";

// ── DEV TIME SPAN ─────────────────────────────────────────────────────────────
// Computed at render time — shows approximate elapsed time since dev started

const DEV_START = new Date('2026-03-23');

function devTimeSpan() {
  const days = Math.floor((new Date() - DEV_START) / (1000 * 60 * 60 * 24));
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30.5);
  if (days < 10)  return '~1 week';
  if (days < 45)  return `~${weeks} week${weeks !== 1 ? 's' : ''}`;
  return `~${months} month${months !== 1 ? 's' : ''}`;
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const modules = [
  {
    title: "Inventory Count System",
    icon: "📦",
    description:
      "The current production count process uses paper sheets — counters work room by room and results are entered manually. The React Native companion app (in active development) is built to replace this: a mobile-first, offline-capable counting interface that syncs directly to the PostgreSQL backend on submit. The web app manages count sessions, admin controls, and audit history regardless of which input method is used.",
    highlights: [
      "Current system: paper-based room-by-room counts entered manually into the web app",
      "In development: React Native mobile app (Expo + TypeScript) to replace paper counting",
      "Offline-first — counts staged in local SQLite, synced to inventory_details on submit",
      "Room claim/lock/release flow prevents two counters overwriting each other",
      "Session scope metadata: full count vs. BTG / sold / purchased / room-specific",
      "Admin release with reason logging — permanent audit trail per session",
    ],
  },
  {
    title: "Sales Reporting & Drill-Down",
    icon: "📊",
    description:
      "Date-range wine sales report with three levels of drill-down: product summary → individual checks → line items per check. Void and overring detection with inline badges. Server name displayed at line-item level.",
    highlights: [
      "Product-level aggregation with bottles/glasses/revenue",
      "Drill into checks by product — see every check that included it",
      "Expand a check to see individual line items with server, time, and quantity",
      "Void and overring flagged inline",
    ],
  },
  {
    title: "Purchasing / Invoice Entry",
    icon: "🧾",
    description:
      "Invoice entry and fintech CSV import pipeline. Invoices flow through a pending/approval queue before committing to the inventory and cost system.",
    highlights: [
      "Manual invoice line-item entry",
      "CSV import from fintech systems with product mapping",
      "Pending review queue with approval workflow",
    ],
  },
  {
    title: "Inventory Analysis",
    icon: "📈",
    description:
      "Period-over-period inventory analysis: beginning/ending values, variance against theoretical on-hand, cost of sales, wine cost percentage. The same calculations previously in the R Shiny app — now available in the main web UI with search and filtering.",
    highlights: [
      "Theoretical on-hand from perpetual inventory stored function",
      "Variance detection: quantity counted vs. theoretical",
      "Cost of sales = beg. inv + purchases − end. inv",
      "Wine name search across analysis output",
    ],
  },
  {
    title: "Server Performance Reports",
    icon: "👤",
    description:
      "Per-server sales metrics: sales volume, check averages, bottles vs. glasses, category breakdown.",
    highlights: [
      "Sales by server with category breakdown",
      "Average check and cover count",
    ],
  },
  {
    title: "Product & Instance Management",
    icon: "🍷",
    description:
      "Product catalog management — vintages, bottle sizes, locations, PLU codes, by-the-glass settings, par levels. Instance consolidation tool for merging duplicate SKUs.",
    highlights: [
      "Edit product instances with location/room assignments",
      "PLU code management per location",
      "Instance consolidation: merge duplicates, reassign inventory",
      "Location rules enforced: no deactivate with on-hand inventory",
    ],
  },
  {
    title: "Tasting Notes",
    icon: "📝",
    description: "Entry and viewing pages for wine tasting notes linked to product instances.",
    highlights: ["Entry form linked to product instances", "Viewing page with filtering"],
  },
];

const techStack = [
  {
    layer: "Backend",
    own:  ["Node.js", "Express.js", "Role-based access (write / admin)", "Multi-tenant connection pooling"],
    ai:   ["JWT authentication"],
  },
  {
    layer: "Database & Schema",
    own:  ["PostgreSQL on AWS RDS", "Multi-tenant: separate DB per restaurant", "Perpetual inventory stored functions", "Complex analytical queries"],
    ai:   [],
  },
  {
    layer: "Web Frontend",
    own:  [],
    ai:   ["React 19", "Material UI (MUI)", "React Query (TanStack)", "Vite", "React Router"],
  },
  {
    layer: "Mobile Frontend",
    own:  [],
    ai:   ["React Native (Expo)", "TypeScript", "Zustand", "expo-sqlite (offline-first)"],
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

function ModuleCard({ mod }) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      sx={{
        border: (t) => `1px solid ${t.palette.divider}`,
        borderRadius: 1,
        mb: 1.5,
        overflow: "hidden",
      }}
    >
      <Box
        onClick={() => setOpen((p) => !p)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
          cursor: "pointer",
          "&:hover": { bgcolor: "rgba(0,0,0,0.03)" },
        }}
      >
        <Typography sx={{ fontSize: "1.25rem" }}>{mod.icon}</Typography>
        <Typography variant="body1" fontWeight={600} sx={{ flex: 1, color: "#2c3e50" }}>
          {mod.title}
        </Typography>
        <IconButton size="small">{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
      </Box>
      <Collapse in={open}>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.7 }}>
            {mod.description}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            {mod.highlights.map((h, i) => (
              <Typography key={i} variant="body2" color="text.secondary" sx={{ display: "flex", gap: 0.75 }}>
                <span style={{ flexShrink: 0 }}>·</span>
                <span>{h}</span>
              </Typography>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}

const WlmReact = () => {
  const elapsed = devTimeSpan();

  return (
    <Container maxWidth="lg">

      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 1 }}>
          <Typography variant="h3" sx={{ color: "#2c3e50" }}>
            Wine List Manager — React App
          </Typography>
          <Chip
            icon={<Construction sx={{ fontSize: "0.85rem !important" }} />}
            label="In Progress"
            size="small"
            sx={{ bgcolor: "#f59e0b", color: "white", fontWeight: 600, fontSize: "0.72rem" }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
          Active development · {elapsed} in
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.7 }}>
          A full-stack React / Node.js / PostgreSQL application consolidating over a decade of
          wine operations tooling into a single interface — inventory counting, sales reporting,
          purchasing, analysis, and product management. The{" "}
          <Link href="https://gist.github.com/mdonovan3/891fdc4210113f328f36cd197a6290ac" target="_blank" rel="noopener">
            PostgreSQL schema
          </Link>
          ,{" "}
          <Link href="https://gist.github.com/mdonovan3/1565af77d4c93ca3450f5e64a40f4d79" target="_blank" rel="noopener">
            stored procedures
          </Link>
          , and{" "}
          <Link href="https://gist.github.com/mdonovan3/132dbd29f68042ba9832476e8711fd90" target="_blank" rel="noopener">
            Node.js backend
          </Link>{" "}
          are my own work. The React frontend was generated by AI (Claude) from highly specific
          prompts — I define the data models, API contracts, component behavior, and business
          logic; the AI produces the implementation code.
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 3 }}>
          {["React", "Node.js", "Express", "PostgreSQL", "AWS RDS", "MUI", "React Query", "Multi-tenant", "JWT"].map((t) => (
            <Chip key={t} label={t} size="small" sx={{ backgroundColor: "#2c3e50", color: "white", fontSize: "0.72rem" }} />
          ))}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<Launch />}
            href="http://react-wine-app-portfolio-env-1.eba-j5pgg9nh.us-east-1.elasticbeanstalk.com/"  /* TODO: replace with deployment URL once live */
            target="_blank"
            rel="noopener noreferrer"
            //disabled
            size="small"
            sx={{ textTransform: "none" }}
          >
            Live Demo
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHub />}
            href="https://github.com/mdonovan3/react-wine-app"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{ textTransform: "none", borderColor: "#2c3e50", color: "#2c3e50" }}
          >
            GitHub
          </Button>
        </Box>
      </Paper>

      {/* AI attribution */}
      <Alert
        severity="info"
        icon={<SmartToy />}
        sx={{ mb: 3 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          How the React frontend was built
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
          The React UI is AI-generated from highly specific prompts. I have a working understanding
          of React architecture — component hierarchy, data flow, hook patterns, state management —
          but I am not a React syntax expert and do not write it from scratch independently. What I
          bring to each feature is the domain knowledge and data layer: I specify exactly what a
          component needs to do, what data it consumes, how it should behave, and what the API
          contract looks like. Claude generates the implementation. I review, debug, and own the
          result. The database schema, stored procedures, Node.js API, and all business logic are
          entirely my own work — the React layer is a delivery mechanism for a data platform I
          designed and built.
        </Typography>
      </Alert>

      {/* Evolution / predecessor history */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Web sx={{ color: "#2c3e50" }} />
          <Typography variant="h5" sx={{ color: "#2c3e50" }}>
            A Decade of Prior Work, Consolidated
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
          This app didn't start from a blank slate. The domain knowledge, data model, and
          business logic behind it accumulated across four prior generations of tooling — all
          built independently, all solving the same operational problems at increasing levels
          of sophistication:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {[
            {
              era: "Java desktop app (~2014–2018)",
              detail: "113 source files, ~21k lines of Java/JavaFX. Inventory counts, POS import from Aloha DBF files, variance reports via JasperReports, PostgreSQL via c3p0. Deployed via install4j installer, used in production. The original implementation of the perpetual inventory math that still runs the system today.",
            },
            {
              era: "Node.js / Express web app (~2018–present)",
              detail: "Server-rendered EJS views over a REST API backed by the same PostgreSQL schema. All own work, no AI assistance. Established the API contract and database layer that the React app now consumes.",
            },
            {
              era: "R Shiny dashboards (4 apps, ~2020–present)",
              detail: "Inventory analysis, storage pull report, restaurant analytics (multi-source: Aloha + OpenTable + R365), and purchase reporting. Each addressed an analytical gap the web app couldn't cover. Their feature sets are now absorbed into the React app.",
            },
            {
              era: "R ETL and analysis scripts (~2020–present)",
              detail: "Nightly Aloha POS pipeline, R365 OData connector, payroll tip-sheet parser, purchase planners, variance reports. The data these scripts produce feeds the same PostgreSQL schema the React app reads from.",
            },
          ].map(({ era, detail }, i) => (
            <Box key={i} sx={{ borderLeft: "3px solid #2c3e50", pl: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#2c3e50", mb: 0.25 }}>
                {era}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {detail}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          The React app is the current consolidation point: one interface covering what
          previously required a desktop app, a web app, four Shiny dashboards, and a set of
          standalone R scripts. The underlying data model and business logic haven't changed —
          the delivery layer has.
        </Typography>
      </Paper>

      {/* Modules */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Storage sx={{ color: "#2c3e50" }} />
          <Typography variant="h5" sx={{ color: "#2c3e50" }}>
            Modules
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click any module to expand details.
        </Typography>
        {modules.map((mod, i) => (
          <ModuleCard key={i} mod={mod} />
        ))}
      </Paper>

      {/* Tech stack */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Person sx={{ color: "#2c3e50" }} />
          <Typography variant="h5" sx={{ color: "#2c3e50" }}>
            Tech Stack — What's Mine vs. AI-Assisted
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {techStack.map(({ layer, own, ai }) => (
            <Box key={layer}>
              {/* Layer header */}
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7f8c8d", display: "block", mb: 1 }}>
                {layer}
              </Typography>
              <Box sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                {own.length > 0 && (
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <Person sx={{ fontSize: 13, color: "#2c3e50" }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#2c3e50", fontSize: "0.68rem" }}>My own work</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, pl: 2.5 }}>
                      {own.map((t) => (
                        <Chip key={t} label={t} size="small"
                          sx={{ fontSize: "0.72rem", backgroundColor: "#2c3e50", color: "white" }} />
                      ))}
                    </Box>
                  </Box>
                )}
                {ai.length > 0 && (
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                      <SmartToy sx={{ fontSize: 13, color: "#1976d2" }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#1976d2", fontSize: "0.68rem" }}>AI-assisted</Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, pl: 2.5 }}>
                      {ai.map((t) => (
                        <Chip key={t} label={t} size="small" variant="outlined"
                          sx={{ fontSize: "0.72rem", borderColor: "#1976d2", color: "#1976d2" }} />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

    </Container>
  );
};

export default WlmReact;
