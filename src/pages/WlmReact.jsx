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
          A full-stack React / Node.js / PostgreSQL application for managing wine operations
          across multiple restaurant locations — inventory counting, sales reporting, purchasing,
          analysis, and product management. Built on top of the same{" "}
          <Link href="https://gist.github.com/mdonovan3/891fdc4210113f328f36cd197a6290ac" target="_blank" rel="noopener">
            PostgreSQL schema
          </Link>
          , data model,{" "}
          <Link href="https://gist.github.com/mdonovan3/1565af77d4c93ca3450f5e64a40f4d79" target="_blank" rel="noopener">
            SQL stored procedures
          </Link>
          , and{" "}
          <Link href="https://gist.github.com/mdonovan3/132dbd29f68042ba9832476e8711fd90" target="_blank" rel="noopener">
            Node.js backend
          </Link>{" "}
          as the earlier Express/EJS application, with a substantially improved interface that
          consolidates features previously spread across separate R Shiny apps, the web app,
          and manual spreadsheets. The backend and all domain logic are my own work; the React
          frontend was built with Claude (AI) as a primary tool.
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
          Note on AI assistance in this project
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
          The data model, PostgreSQL schema, backend API, SQL stored procedures, and business
          logic are my own work — developed over several years starting with Excel, then an
          R/Shiny analytics layer, then the Express/EJS web app, all backed by the same
          PostgreSQL schema on AWS RDS. I function as the de facto product owner of this
          platform: I defined the requirements, prioritized the feature set, and made every
          architecture decision. When I rebuilt the frontend in React, I used Claude (AI)
          as a primary tool throughout: the domain knowledge, architecture decisions, feature
          design, and all server-side code are mine, but the React UI was largely produced through
          AI-assisted development from my specifications. I treat it the same way I'd treat any
          productivity tool — what it amplifies is my ability to ship a better product; the
          domain knowledge and system design are not substituted.
        </Typography>
      </Alert>

      {/* Evolution from Express app */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Web sx={{ color: "#2c3e50" }} />
          <Typography variant="h5" sx={{ color: "#2c3e50" }}>
            Evolution from the Express / EJS App
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
          The earlier Wine List Manager (see Repositories) was a server-rendered Node.js/Express
          application with EJS templates — functional but limited. This React version is a
          ground-up rewrite of the frontend against the same PostgreSQL backend, adding:
        </Typography>
        <Box component="ul" sx={{ pl: 2, color: "text.secondary" }}>
          {[
            "A proper SPA with React Query for server state and optimistic updates",
            "Features consolidated from R Shiny apps (inventory analysis, count management) into one interface",
            "Multi-device inventory counting with room locking, offline staging, and admin controls",
            "Three-level sales drill-down (previously not in the web app at all)",
            "Full purchasing pipeline with fintech CSV import and approval queues",
            "React Native mobile companion app for floor-level counting (separate project)",
          ].map((item, i) => (
            <Typography key={i} component="li" variant="body2" color="text.secondary" sx={{ mb: 0.75, lineHeight: 1.7 }}>
              {item}
            </Typography>
          ))}
        </Box>
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
