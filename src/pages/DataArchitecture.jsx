import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { ArrowDownward, Star } from "@mui/icons-material";

const theme = {
  slate: "#2c3e50",
  slateLight: "#34495e",
  teal: "#1abc9c",
  blue: "#2980b9",
  orange: "#e67e22",
  purple: "#8e44ad",
  grey: "#7f8c8d",
  greyLight: "#ecf0f1",
  rAccent: "#2471a3",
  webAccent: "#1e8449",
};

// Layer 0 — Data Sources
const dataSources = [
  { title: "Aloha / NCR POS", subtitle: "DBF files, nightly", accent: theme.orange },
  { title: "Restaurant365", subtitle: "OData API", accent: theme.blue },
  { title: "OpenTable", subtitle: "Reservations & covers", accent: theme.teal },
  { title: "Physical counts", subtitle: "Paper sheets / mobile app", accent: theme.grey },
  { title: "Vendor invoices", subtitle: "Manual entry / fintech CSV", accent: theme.purple },
];

// Layer 1 — ETL & Ingestion
const etlNodes = [
  { title: "R nightly pipeline", subtitle: "Parses DBF → PostgreSQL", type: "r" },
  { title: "R365 OData connector", subtitle: "R functions, GL + transactions", type: "r" },
  { title: "R ETL scripts", subtitle: "OpenTable join, normalization", type: "r" },
  { title: "Web app import", subtitle: "Invoice entry, CSV pipeline", type: "web" },
  { title: "Mobile / web count", subtitle: "Room-by-room staging sync", type: "web" },
];

// Layer 3 — Analytics & Applications
const analyticsNodes = [
  { title: "R Shiny Dashboards", subtitle: "martindonovan.shinyapps.io", type: "r" },
  { title: "React Web App", subtitle: "WLM — ops platform", type: "web" },
  { title: "React Native App", subtitle: "iOS/Android mobile counting", type: "web" },
  { title: "Quarto Reports", subtitle: "Print-ready spot check", type: "r" },
];

const keyDecisions = [
  "Separate PostgreSQL database per restaurant — complete data isolation with shared application code",
  "Perpetual inventory stored function computes theoretical on-hand per SKU per location from beginning inventory, purchases, transfers, and sales — called by both the Shiny apps and the Node.js API",
  "Nightly R ETL pipeline runs on Windows Task Scheduler — no cloud infrastructure needed for the ingestion layer",
  "R Shiny and React app both read from the same PostgreSQL schema — no separate analytics warehouse",
  "count_staging table enables offline-first mobile counting — submits to inventory_details on sync",
];

const NodeCard = ({ title, subtitle, accent, type }) => {
  const leftBorderColor =
    type === "r" ? theme.rAccent : type === "web" ? theme.webAccent : accent || theme.slate;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        flex: "1 1 0",
        minWidth: 140,
        maxWidth: 220,
        borderLeft: `4px solid ${leftBorderColor}`,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.slate, lineHeight: 1.3 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ color: theme.grey, lineHeight: 1.4 }}>
        {subtitle}
      </Typography>
    </Paper>
  );
};

const LayerLabel = ({ label, color }) => (
  <Typography
    variant="overline"
    sx={{
      color: color || theme.grey,
      fontWeight: 700,
      letterSpacing: 1.5,
      mb: 1.5,
      display: "block",
    }}
  >
    {label}
  </Typography>
);

const FlowArrow = () => (
  <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
    <ArrowDownward sx={{ color: theme.grey, fontSize: 32 }} />
  </Box>
);

const DataArchitecture = () => {
  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: theme.slate }}>
          Data Architecture
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          This diagram shows the full data stack built to support restaurant operations across two
          locations. Raw data from the POS, accounting platform, reservation system, and physical
          inventory counts flows through R-based ETL pipelines into a multi-tenant PostgreSQL
          database on AWS RDS. From there, both R Shiny dashboards and a React/Node.js web
          application read from the same schema — with no separate analytics warehouse.
        </Typography>
      </Paper>

      {/* Flow Diagram */}
      <Paper elevation={2} sx={{ p: 4, mb: 3, backgroundColor: "#f8f9fa" }}>
        {/* Layer 0 — Data Sources */}
        <Box>
          <LayerLabel label="Data Sources" color={theme.orange} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {dataSources.map((node) => (
              <NodeCard key={node.title} {...node} />
            ))}
          </Box>
        </Box>

        <FlowArrow />

        {/* Layer 1 — ETL */}
        <Box>
          <LayerLabel label="ETL & Ingestion" color={theme.rAccent} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.rAccent, borderRadius: "2px" }} />
            <Typography variant="caption" sx={{ color: theme.rAccent, fontWeight: 600, mr: 2 }}>
              R script
            </Typography>
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.webAccent, borderRadius: "2px" }} />
            <Typography variant="caption" sx={{ color: theme.webAccent, fontWeight: 600 }}>
              Web / mobile
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {etlNodes.map((node) => (
              <NodeCard key={node.title} {...node} />
            ))}
          </Box>
        </Box>

        <FlowArrow />

        {/* Layer 2 — Database (focal point) */}
        <Box>
          <LayerLabel label="PostgreSQL on AWS RDS" color={theme.slate} />
          <Paper
            elevation={4}
            sx={{
              p: 3,
              backgroundColor: theme.slate,
              color: "#fff",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, color: "#ecf0f1", letterSpacing: 0.5 }}
            >
              Multi-tenant: Ironstone · Harborview Grille
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.5 }}>
              {[
                "products & instances",
                "inventory & details",
                "sales (Aloha)",
                "invoices & purchasing",
                "count sessions",
                "OpenTable / R365",
              ].map((label) => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "#ecf0f1",
                    fontWeight: 500,
                    fontSize: "0.72rem",
                    "& .MuiChip-label": { px: 1.5 },
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "rgba(241,196,15,0.15)",
                border: "1px solid rgba(241,196,15,0.4)",
                borderRadius: 1,
                px: 2,
                py: 1,
              }}
            >
              <Star sx={{ color: "#f1c40f", fontSize: 18 }} />
              <Typography variant="body2" sx={{ color: "#f1c40f", fontWeight: 600 }}>
                Perpetual inventory stored function
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(241,196,15,0.8)", ml: 0.5 }}>
                — computes theoretical on-hand per SKU per location; called by Shiny + Node.js API
              </Typography>
            </Box>
          </Paper>
        </Box>

        <FlowArrow />

        {/* Layer 3 — Analytics & Applications */}
        <Box>
          <LayerLabel label="Analytics & Applications" color={theme.teal} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.rAccent, borderRadius: "2px" }} />
            <Typography variant="caption" sx={{ color: theme.rAccent, fontWeight: 600, mr: 2 }}>
              R / Shiny
            </Typography>
            <Box sx={{ width: 12, height: 12, backgroundColor: theme.webAccent, borderRadius: "2px" }} />
            <Typography variant="caption" sx={{ color: theme.webAccent, fontWeight: 600 }}>
              React / Node.js
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {analyticsNodes.map((node) => (
              <NodeCard key={node.title} {...node} />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Key Design Decisions */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: theme.slate, fontWeight: 700 }}>
          Key Design Decisions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
          {keyDecisions.map((decision, i) => (
            <Box
              component="li"
              key={i}
              sx={{ mb: 1.5 }}
            >
              <Typography variant="body2" sx={{ color: "#34495e", lineHeight: 1.7 }}>
                {decision}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default DataArchitecture;
