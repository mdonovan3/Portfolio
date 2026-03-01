import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Collapse,
  Divider,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Circle,
  ArrowDownward,
} from "@mui/icons-material";

// ── DATA ──────────────────────────────────────────────────────────────────────

const timeline = [
  {
    era: "–2005",
    label: "Excel Spreadsheets",
    accentColor: "#27ae60",
    tech: ["Microsoft Excel"],
    description:
      "Wine inventory tracked manually in Excel workbooks. Each count period meant hours of data entry and formula maintenance. Cost percentages were calculated by hand with no historical record, no variance detection, and no connection to the POS system.",
    highlights: [
      "Manual count entry per inventory period",
      "Cost percentage calculated by hand each period",
      "No historical trending or variance detection",
      "Scaling to multiple locations was not feasible",
    ],
    outcome: "Functional but fragile. The starting point for everything that followed.",
    stack: {
      sources: ["Manual count sheets"],
      processing: ["Excel formulas"],
      output: ["Printed reports"],
    },
  },
  {
    era: "2005 – 2008",
    label: "Access DB + PosiTouch POS Integration",
    accentColor: "#8e44ad",
    tech: ["Microsoft Access", "PosiTouch POS", "Perl"],
    description:
      "The first real system: a Microsoft Access database with an embedded Perl script that polled the PosiTouch POS system to import daily sales automatically. This introduced perpetual inventory — tracking theoretical on-hand quantity based on sales versus what was physically counted. Variance detection was born here.",
    highlights: [
      "Embedded Perl script polling PosiTouch POS for daily sales data",
      "First automated data pipeline — no more manual sales entry",
      "Perpetual inventory formula introduced: Beg. Inv + Purchases − Sales = Theoretical On Hand",
      "Count variance detection: theoretical vs. actual quantity counted",
    ],
    outcome:
      "The core inventory math introduced here has powered every subsequent version of the system.",
    stack: {
      sources: ["PosiTouch POS (polled via Perl)"],
      processing: ["Perl import script", "Access queries"],
      output: ["Access reports", "Variance analysis"],
    },
  },
  {
    era: "2008 – 2019",
    label: "On-Premise PostgreSQL + Java Desktop App",
    accentColor: "#2980b9",
    tech: ["PostgreSQL", "Java", "JavaFX", "JDBC", "Aloha POS", "DBF"],
    description:
      "Access hit its limits. A fully normalized PostgreSQL schema replaced it — designed from scratch with 30+ tables. A JavaFX desktop application provided the management interface: adding wines, uploading label images, managing the wine list, and setting tiered formula pricing. A Java ETL client read Aloha POS DBF binary files directly from disk, resolved PLU-to-product mappings, and loaded sales data into PostgreSQL.",
    highlights: [
      "30+ table normalized schema: geography hierarchy, company/person relationships, POS category mapping",
      "JavaFX desktop UI: wine catalog, label image upload via PostgreSQL large objects, wine list editing",
      "Tiered formula pricing: cost-based markup by bracket, rounded to psychological price points",
      "Java DBF parser reading Aloha chkitems.dbf directly from the POS file system",
      "PLU-to-product-instance mapping table linking POS sales to inventory items",
      "PostgreSQL stored function: perpetual inventory with glass-to-bottle unit conversion",
    ],
    outcome:
      "Production relational database. Perpetual inventory now computed in SQL. First multi-source join across POS and inventory.",
    stack: {
      sources: ["Aloha POS DBF files (local disk)", "Manual invoice entry"],
      processing: ["Java DBF ETL client", "PostgreSQL stored functions", "JavaFX desktop app"],
      output: ["JavaFX management UI", "Variance reports"],
    },
  },
  {
    era: "2011 – Present",
    label: "iOS Wine List App",
    accentColor: "#16a085",
    tech: ["iOS", "iPad", "REST API", "PostgreSQL", "AWS RDS"],
    description:
      "Oversaw the specification and rollout of a custom iOS application to replace paper wine lists across the restaurant. Working with an outside development firm, the project was managed from requirements through deployment — defining the data model integration, specifying feature requirements, and coordinating the technical connection to the existing PostgreSQL database on AWS RDS. The app has been in active daily use since launch.",
    highlights: [
      "Replaced paper wine lists with iPad-based digital menus across the restaurant floor",
      "Full wine details per bottle: description, producer notes, region, vintage, ratings, and label image",
      "Searchable catalog — guests and staff can filter by type, region, price range, and other attributes",
      "Real-time on-hand quantity displayed on each wine's detail page, pulled live from inventory database",
      "Out-of-stock wines automatically suppressed from the list when on-hand quantity reaches zero",
      "Measurable impact: increased both overall wine sales and breadth of sales across categories",
      "Connects directly to the same AWS RDS PostgreSQL database used by all other system components",
    ],
    outcome:
      "First guest-facing output of the inventory system. Demonstrated direct ROI: broader category sales and fewer '86'd' wine service failures.",
    stack: {
      sources: ["AWS RDS PostgreSQL (live inventory data)", "Label images (PostgreSQL large objects)"],
      processing: ["REST API queries", "Real-time on-hand calculation"],
      output: ["iPad wine list UI", "Guest-facing wine details", "Auto out-of-stock suppression"],
    },
  },
  {
    era: "2019 – Present",
    label: "Cloud Migration + Node.js Web Application",
    accentColor: "#e67e22",
    tech: ["AWS RDS", "Node.js", "Express", "EJS", "Passport.js", "MongoDB", "Bootstrap"],
    description:
      "The on-premise PostgreSQL database migrated to AWS RDS, enabling remote access and multi-location support. A Node.js/Express web application replaced the need to be on-site to manage the wine program. User authentication via Passport.js with bcrypt; session data in MongoDB; wine program data in PostgreSQL.",
    highlights: [
      "PostgreSQL migrated to AWS RDS — remote access, automated backups, multi-location ready",
      "14 REST API endpoints: products, instances, invoices, inventories, companies, categories, vintages, regions",
      "Passport.js local strategy with bcrypt password hashing and session management",
      "Dual-database architecture: MongoDB for auth/sessions, PostgreSQL for domain data",
      "Dynamic cascading selects: product → instance → pricing populated via API calls",
      "Formula price endpoint: unit cost in, calculated menu price out",
    ],
    outcome:
      "System accessible from anywhere. Full REST API over the database. First version usable by non-technical staff.",
    stack: {
      sources: ["Manual entry via web UI", "Existing PostgreSQL data"],
      processing: ["Node.js/Express REST API", "Passport.js + MongoDB auth", "AWS RDS PostgreSQL"],
      output: ["EJS web interface", "REST API (14 endpoints)"],
    },
  },
  {
    era: "2020 – Present",
    label: "Multi-Location R Pipeline + Shiny Analytics",
    accentColor: "#c0392b",
    tech: ["R", "Shiny", "tidyverse", "RPostgreSQL", "Task Scheduler", "R365 OData", "BevSpot"],
    description:
      "As operations expanded to multiple locations, a new automated ETL layer was built in R. A Windows Task Scheduler job runs nightly, reading each location's Aloha.ini to identify the restaurant, checking for existing data, and loading only new records to per-location PostgreSQL databases on AWS RDS. A separate R client connects to Restaurant365 via OData API for financial data. Multiple R Shiny dashboards deliver operational reporting.",
    highlights: [
      "Nightly automated polling across all locations via Windows Task Scheduler + Rscript.exe",
      "Location identity resolved: Aloha.ini UNITNUMBER → entities table → per-location database",
      "Idempotent import: checks existing records before writing, safe to re-run at any time",
      "R365 OData API connector: GL accounts, transaction details, multi-location financial data",
      "BevSpot holiday planner: projects bottle needs from prior-year sales using recipe pour math",
      "Shiny dashboards: Inventory Analysis, Storage Pull Report, Restaurant Analytics, Purchase Report",
    ],
    outcome:
      "Fully automated, multi-location data pipeline. Analytics accessible via browser without technical knowledge.",
    stack: {
      sources: ["Aloha POS DBF (nightly)", "Restaurant365 OData API", "BevSpot exports"],
      processing: ["R ETL (Task Scheduler)", "tidyverse transforms", "AWS RDS PostgreSQL"],
      output: [
        "Shiny: Inventory Analysis",
        "Shiny: Restaurant Analytics",
        "Shiny: Storage Pull",
        "Shiny: Purchase Report",
      ],
    },
  },
];

const currentArch = [
  {
    layer: "Data Sources",
    color: "#27ae60",
    bg: "#f0faf3",
    border: "#a9dfbf",
    items: [
      "Aloha POS (nightly DBF files)",
      "Restaurant365 OData API",
      "BevSpot CSV exports",
      "Manual invoice entry (web UI)",
    ],
  },
  {
    layer: "Processing & Storage",
    color: "#2980b9",
    bg: "#eaf4fb",
    border: "#aed6f1",
    items: [
      "R nightly ETL (Windows Task Scheduler)",
      "Node.js REST API (14 endpoints)",
      "PostgreSQL stored functions",
      "AWS RDS PostgreSQL (per-location)",
      "MongoDB (auth / sessions)",
    ],
  },
  {
    layer: "Interfaces & Outputs",
    color: "#c0392b",
    bg: "#fdf2f2",
    border: "#f5b7b1",
    items: [
      "iOS iPad wine list app (guest-facing)",
      "JavaFX desktop app (catalog management)",
      "Node/Express web app (browser UI)",
      "Shiny: Inventory Analysis dashboard",
      "Shiny: Restaurant Analytics",
      "Shiny: Storage Pull Report",
      "Shiny: Wine Purchase Report",
    ],
  },
];

const fullStack = [
  { label: "Languages", items: ["R", "Java", "JavaScript / Node.js", "SQL", "Perl"] },
  { label: "Databases", items: ["PostgreSQL (AWS RDS)", "MongoDB", "Microsoft Access"] },
  { label: "Frameworks", items: ["R Shiny", "JavaFX", "Express.js", "tidyverse"] },
  { label: "Integrations", items: ["Aloha (DBF)", "PosiTouch", "Restaurant365 OData", "BevSpot"] },
  { label: "Infrastructure", items: ["AWS RDS", "Windows Task Scheduler", "Passport.js / bcrypt"] },
];

const relatedLinks = [
  { label: "PostgreSQL Schema (DDL)", url: "https://gist.github.com/mdonovan3/891fdc4210113f328f36cd197a6290ac", tag: "SQL" },
  { label: "Perpetual Inventory Stored Function", url: "https://gist.github.com/mdonovan3/1565af77d4c93ca3450f5e64a40f4d79", tag: "SQL" },
  { label: "R365 OData API Connector", url: "https://gist.github.com/mdonovan3/8fe35f6fab90876aea05bdc367beb5e7", tag: "R" },
  { label: "Aloha POS Data Aggregation", url: "https://gist.github.com/mdonovan3/66128ab231ef3466ef3ed6cf569dd059", tag: "R" },
  { label: "Holiday Sales Planner", url: "https://gist.github.com/mdonovan3/b1a30326299a0a8c0c8d286e4f1eea1e", tag: "R" },
  { label: "Inventory Analysis Dashboard", url: "https://martindonovan.shinyapps.io/InventoryAnalysis/", tag: "Shiny" },
  { label: "Restaurant Analytics Dashboard", url: "https://martindonovan.shinyapps.io/RestaurantAnalyticsDashboard/", tag: "Shiny" },
  { label: "Wine Purchase Report", url: "https://martindonovan.shinyapps.io/PurchaseDetailsReport/", tag: "Shiny" },
  { label: "Storage Pull Report", url: "https://martindonovan.shinyapps.io/StoragePullReport/", tag: "Shiny" },
];

// ── STACK DIAGRAM ─────────────────────────────────────────────────────────────

const StackDiagram = ({ stack, accentColor }) => (
  <Box>
    {[
      { label: "Sources", items: stack.sources },
      { label: "Processing", items: stack.processing },
      { label: "Output", items: stack.output },
    ].map((row, i, arr) => (
      <Box key={row.label}>
        <Box
          sx={{
            border: `1px solid ${accentColor}44`,
            borderRadius: 1,
            p: 1.5,
            backgroundColor: `${accentColor}08`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: accentColor,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              mb: 0.75,
            }}
          >
            {row.label}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {row.items.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                sx={{
                  backgroundColor: `${accentColor}18`,
                  color: "#2c3e50",
                  fontSize: "0.7rem",
                  border: `1px solid ${accentColor}33`,
                  height: 22,
                }}
              />
            ))}
          </Box>
        </Box>
        {i < arr.length - 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 0.5 }}>
            <ArrowDownward sx={{ fontSize: 14, color: accentColor, opacity: 0.45 }} />
          </Box>
        )}
      </Box>
    ))}
  </Box>
);

// ── TIMELINE CARD ─────────────────────────────────────────────────────────────

const TimelineCard = ({ era, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <Paper
      elevation={open ? 2 : 1}
      sx={{
        mb: 2,
        border: `1px solid ${open ? era.accentColor + "55" : "#e0e0e0"}`,
        transition: "border-color 0.2s, box-shadow 0.2s",
        overflow: "hidden",
      }}
    >
      {/* Accent bar */}
      <Box sx={{ height: 3, backgroundColor: era.accentColor }} />

      {/* Clickable header */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          p: 2.5,
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          "&:hover": { backgroundColor: "rgba(0,0,0,0.015)" },
        }}
      >
        {/* Step number */}
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: era.accentColor,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "0.82rem",
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          {index + 1}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{ color: era.accentColor, fontWeight: 600, letterSpacing: "0.05em", display: "block", mb: 0.25 }}
          >
            {era.era}
          </Typography>
          <Typography variant="h6" sx={{ color: "#2c3e50", fontWeight: 500, mb: 0.75, fontSize: "1.05rem" }}>
            {era.label}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {era.tech.map((t) => (
              <Chip key={t} label={t} size="small" sx={{ backgroundColor: "#ecf0f1", fontSize: "0.68rem", height: 20 }} />
            ))}
          </Box>
        </Box>

        <Box sx={{ color: "#95a5a6", flexShrink: 0, mt: 0.25 }}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </Box>

      {/* Expanded content */}
      <Collapse in={open}>
        <Divider />
        <Box sx={{ p: 2.5, pt: 2.5, backgroundColor: "#fafafa" }}>
          <Grid container spacing={3}>
            {/* Left: description + highlights + outcome */}
            <Grid item xs={12} md={7}>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
                {era.description}
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: era.accentColor, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", mb: 1 }}
              >
                Technical Highlights
              </Typography>

              {era.highlights.map((h, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1, mb: 0.75, alignItems: "flex-start" }}>
                  <Circle sx={{ fontSize: 6, color: era.accentColor, mt: "7px", flexShrink: 0 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {h}
                  </Typography>
                </Box>
              ))}

              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  backgroundColor: `${era.accentColor}0f`,
                  borderLeft: `3px solid ${era.accentColor}`,
                  borderRadius: "0 4px 4px 0",
                }}
              >
                <Typography variant="caption" sx={{ color: "#2c3e50", fontWeight: 700 }}>Outcome: </Typography>
                <Typography variant="caption" color="text.secondary">{era.outcome}</Typography>
              </Box>
            </Grid>

            {/* Right: stack diagram */}
            <Grid item xs={12} md={5}>
              <Typography
                variant="caption"
                sx={{ color: era.accentColor, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", mb: 1.5 }}
              >
                Stack Diagram
              </Typography>
              <StackDiagram stack={era.stack} accentColor={era.accentColor} />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

// ── PAGE ──────────────────────────────────────────────────────────────────────

const InventoryInfrastructure = () => {
  return (
    <Container maxWidth="lg">

      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          Wine Inventory Management System
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          A twenty-year iterative project — from Excel spreadsheets to a cloud-hosted,
          multi-location data platform spanning five languages, three databases, a
          guest-facing iOS wine list app, and a full analytics suite. Built entirely as
          a side project while working in the restaurant industry. Each iteration replaced
          its predecessor when the business outgrew it.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {["PostgreSQL", "R", "Java", "Node.js", "AWS RDS", "Shiny", "JavaFX", "iOS", "Perl"].map((t) => (
            <Chip key={t} label={t} size="small" sx={{ backgroundColor: "#2c3e50", color: "white", fontSize: "0.72rem" }} />
          ))}
        </Box>
      </Paper>

      {/* Timeline */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#2c3e50" }}>
          Evolution
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click any era to expand its technical details and stack diagram.
        </Typography>
        {timeline.map((era, index) => (
          <TimelineCard key={index} era={era} index={index} />
        ))}
      </Paper>

      {/* Current Architecture */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#2c3e50" }}>
          Current Architecture
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Three layers connecting raw POS data to operational dashboards across multiple restaurant locations.
        </Typography>

        <Grid container spacing={2}>
          {currentArch.map((col) => (
            <Grid item xs={12} md={4} key={col.layer}>
              <Box
                sx={{
                  height: "100%",
                  border: `1px solid ${col.border}`,
                  borderRadius: 1,
                  backgroundColor: col.bg,
                  p: 2.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: col.color, flexShrink: 0 }} />
                  <Typography
                    variant="caption"
                    sx={{ color: col.color, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
                  >
                    {col.layer}
                  </Typography>
                </Box>
                {col.items.map((item) => (
                  <Box key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                    <Circle sx={{ fontSize: 5, color: col.color, mt: "8px", flexShrink: 0, opacity: 0.55 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "#f8f9fa",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            <strong>Data flow: </strong>
            Aloha POS DBF files are polled nightly by the R ETL pipeline running on Windows Task Scheduler.
            Location identity is resolved from <code>Aloha.ini</code> → entities table → per-location PostgreSQL
            database on AWS RDS. The same perpetual inventory formula —{" "}
            <em>Beginning Inventory + Purchases + Transfers In − Bottle Sales − Glass Sales = Theoretical On Hand</em>{" "}
            — has powered every version of this system since 2010.
          </Typography>
        </Box>
      </Paper>

      {/* Full Stack Summary */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#2c3e50" }}>
          Full Stack Summary
        </Typography>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          {fullStack.map((group) => (
            <Grid item xs={6} sm={4} md={2.4} key={group.label}>
              <Typography
                variant="caption"
                sx={{
                  color: "#7f8c8d",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  mb: 1,
                  pb: 0.5,
                  borderBottom: "2px solid #2c3e50",
                }}
              >
                {group.label}
              </Typography>
              {group.items.map((item) => (
                <Typography key={item} variant="body2" color="text.secondary" sx={{ mb: 0.5, lineHeight: 1.6 }}>
                  {item}
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Related Code */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#2c3e50" }}>
          Related Code
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Individual components of this system are available as gists and deployed apps.
        </Typography>
        <Grid container spacing={1.5}>
          {relatedLinks.map((link) => (
            <Grid item xs={12} sm={6} md={4} key={link.label}>
              <Box
                component="a"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.15s, background-color 0.15s",
                  "&:hover": {
                    borderColor: "#2c3e50",
                    backgroundColor: "rgba(44,62,80,0.025)",
                  },
                }}
              >
                <Chip
                  label={link.tag}
                  size="small"
                  sx={{ backgroundColor: "#2c3e50", color: "white", fontSize: "0.65rem", height: 20, flexShrink: 0 }}
                />
                <Typography variant="body2" sx={{ color: "#2c3e50", lineHeight: 1.4 }}>
                  {link.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

    </Container>
  );
};

export default InventoryInfrastructure;