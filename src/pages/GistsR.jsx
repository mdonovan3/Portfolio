import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import { Code } from "@mui/icons-material";

const GistsR = () => {
  const groups = [
    {
      label: "Data Ingestion & ETL",
      description: "Production pipelines loading external data sources into PostgreSQL on AWS RDS.",
      gists: [
        {
          title: "Aloha POS DBF-to-PostgreSQL ETL",
          description:
            "Two-file nightly ETL: reads binary DBF files (GNDITEM, CAT, ITM, EMP) produced by the Aloha POS system, joins across 5 lookup tables including a PLU-to-product-instance mapping, renames 20+ columns to match the DB schema, and bulk-inserts via dbWriteTable in a transaction. Orchestrator reads Aloha.ini for the unit number, routes each entity to the correct database, and skips already-imported dates — idempotent by design.",
          url: "https://gist.github.com/mdonovan3/e5e77cdc68b3e03e13d0925a80f3f399",
          tags: ["R", "ETL", "Aloha POS", "DBF", "PostgreSQL", "RPostgres", "Idempotent"],
        },
        {
          title: "Restaurant365 OData API Connector",
          description:
            "Paginated OData retrieval with basic auth — fetches all pages via $count + $skip loop, joins GL transaction headers to line-item details, derives parent account codes, and renames response columns to match the PostgreSQL schema before insert. hasTransactionsForDate() guards against duplicate imports on re-run.",
          url: "https://gist.github.com/mdonovan3/8fe35f6fab90876aea05bdc367beb5e7",
          tags: ["R", "OData", "REST API", "httr2", "PostgreSQL", "Idempotent", "Restaurant365"],
        },
        {
          title: "Multi-Source Restaurant Data Aggregator",
          description:
            "Joins Aloha POS staging tables (gnditem, gndvoid, gndline) with OpenTable reservation data and Restaurant365 GL transactions. Processes one day at a time due to Aloha's day-level consistency constraint. Features a local DuckDB cache with transparent PostgreSQL fallback, purrr::possibly for error-safe date iteration, and comp/promo resolution via gndline type codes.",
          url: "https://gist.github.com/mdonovan3/66128ab231ef3466ef3ed6cf569dd059",
          tags: ["R", "dplyr", "DuckDB", "PostgreSQL", "Aloha POS", "OpenTable", "purrr"],
        },
        {
          title: "Payroll Tip-Sheet Excel Parser",
          description:
            "Two parsers for two different weekly Excel layouts — one per restaurant. Reconstructs dynamic column headers from numeric date serials via openxlsx::convertToDate, pivots wide tip data to long form keyed by employee + date + shift, and inserts to PostgreSQL via dbWithTransaction with a duplicate-date guard. Non-standard Excel parsing with janitor::remove_empty and separate() normalization.",
          url: "https://gist.github.com/mdonovan3/76aca14b06ee37d3602e7704f7583f4f",
          tags: ["R", "readxl", "openxlsx", "PostgreSQL", "tidyr", "janitor", "Excel parsing"],
        },
      ],
    },
    {
      label: "Analysis & Reporting",
      description: "Analytical scripts and dashboards — reconciliation, operational reporting, and print-ready documents from live database queries.",
      gists: [
        {
          title: "Inventory Variance (Shrinkage) Report",
          description:
            "Reconciles two consecutive physical inventory counts with all sales and purchases between them to identify unexplained bottle losses. variance = start_count + purchases − glass_sales − bottle_sales − end_count. Filters to bottle-only SKUs (glass_sales == 0) to isolate losses not attributable to glass pours. Dollar-weighted by product_cost for prioritization. Rendered as a gt table.",
          url: "https://gist.github.com/mdonovan3/fd16d350745573b7962fb27325e4c65e",
          tags: ["R", "Analysis", "gt", "PostgreSQL", "tidyverse", "Inventory reconciliation"],
        },
        {
          title: "Inventory Analysis Shiny Dashboard",
          description:
            "Period-over-period wine P&L: beginning/ending inventory values, count variances vs. theoretical on-hand by SKU, vendor purchases, glass and bottle sales revenue, cost of sales, and wine cost %. URL query string deep-linking (?startdate=&enddate=) for bookmarkable period views. DT tables with CSV/Excel export buttons, ggplot trend chart, shinydashboard value boxes.",
          url: "https://gist.github.com/mdonovan3/2054d94455ae135725be6239d7602147",
          tags: ["R", "Shiny", "shinydashboard", "DT", "PostgreSQL", "P&L"],
        },
        {
          title: "Inventory Spot-Check Sheet — Quarto",
          description:
            "Quarto HTML document that calls get_theoreticals_active_product_instances_only() and get_inventory_activity() stored procs, joins results to filter only items with post-count activity, and renders a gt table grouped by storage room with a blank 'actual' column for targeted physical recount. Designed to print and use on the floor — operational document, not an analysis write-up.",
          url: "https://gist.github.com/mdonovan3/2a662fa7fae5743ac7f97020c9a4aeac",
          tags: ["R", "Quarto", "gt", "PostgreSQL", "DBI", "Operational reporting"],
        },
      ],
    },
    {
      label: "Inventory Planning & Operations",
      description: "Decision-support tools for purchasing, restocking, and vendor communication.",
      gists: [
        {
          title: "Wine Purchase Planner — DB Connected",
          description:
            "Estimates bottle purchases needed from today through end of calendar year. Computes current on-hand from last physical count plus all activity since (via get_inventory_activity() stored proc), joins against the same calendar window from the prior year as a demand proxy, and outputs a prioritized buy list with quantity_needed and dollar impact per SKU. Full_join with replace_na handles new and discontinued items. gt table output.",
          url: "https://gist.github.com/mdonovan3/2d84c2b0bc8590e791bbdf32adf4aaca",
          tags: ["R", "Analysis", "PostgreSQL", "gt", "Forecasting", "tidyverse"],
        },
        {
          title: "Bevspot Liquor & Beer Purchase Planner",
          description:
            "Reads four Bevspot Excel exports: sales data, expected inventory, recipes (with multi-ingredient strings like 'Vodka (1.5 oz), OJ (2 oz)'), and items catalog. Parses ingredient strings via regex to extract per-spirit ounce consumption, converts to bottle equivalents for 750mL and 1L formats, joins against Bevspot theoretical on-hand, and outputs a ranked purchase list sorted by quantity needed with dollar impact. No database required.",
          url: "https://gist.github.com/mdonovan3/b1a30326299a0a8c0c8d286e4f1eea1e",
          tags: ["R", "readxl", "regex", "tidyverse", "Bevspot", "Excel", "Forecasting"],
        },
        {
          title: "Wine Storage Pull Report — Shiny",
          description:
            "Shiny dashboard showing bottles to pull from storage to service locations for nightly setup. Calls get_theoreticals_active_product_instances_only() for current theoretical on-hand, computes room par minus on-hand per SKU, and caps pull quantity against available storage_on_hand — you never pull more than exists. Adjusts par downward for large-format bottles. Filters out fully-stocked locations.",
          url: "https://gist.github.com/mdonovan3/173386df76ad4a9702d00d08e6a54001",
          tags: ["R", "Shiny", "PostgreSQL", "DBI", "Operational tool"],
        },
        {
          title: "Automated Purchase Order Drafts — Microsoft365R",
          description:
            "Iterates a distributor contact dataframe and creates one draft email per rep per restaurant using the Microsoft Graph API (create_email via get_business_outlook). M365 OAuth2 authentication from R, dataframe-driven parameterized email generation — ready to fill in order quantities and send. One draft per rep per location in a single run.",
          url: "https://gist.github.com/mdonovan3/4982e370f6729d670e53d6e54e4b25b0",
          tags: ["R", "Microsoft365R", "M365", "Graph API", "OAuth2", "Automation"],
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          R Code — Gists
        </Typography>
        <Typography variant="body1" color="text.secondary">
          R scripts for ETL, API integration, analysis, and operational reporting — part of the
          automated multi-location data pipeline connecting Aloha POS, Restaurant365, BevSpot, and
          OpenTable to PostgreSQL on AWS RDS.
        </Typography>
      </Paper>

      {groups.map((group, gi) => (
        <Paper key={gi} elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#2c3e50", mb: 0.5 }}>
            {group.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {group.description}
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List disablePadding>
            {group.gists.map((gist, index) => (
              <ListItem key={index} disablePadding divider={index < group.gists.length - 1}>
                <ListItemButton
                  component="a"
                  href={gist.url}
                  target="_blank"
                  sx={{
                    py: 2,
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <Code sx={{ mr: 2, color: "#7f8c8d", flexShrink: 0, alignSelf: "flex-start", mt: 0.25 }} />
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500, color: "#2c3e50" }}>
                        {gist.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1, lineHeight: 1.6 }}>
                          {gist.description}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {gist.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" sx={{ fontSize: "0.68rem", height: 20 }} />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Container>
  );
};

export default GistsR;
