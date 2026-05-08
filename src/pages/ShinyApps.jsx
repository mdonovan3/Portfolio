import {
  Container,
  Paper,
  Typography,
  Chip,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { Image, OpenInNew } from "@mui/icons-material";

const shinyApps = [
  {
    title: "Inventory Analysis",
    url: "https://martindonovan.shinyapps.io/InventoryAnalysis/",
    tags: ["R", "Shiny", "PostgreSQL", "Inventory"],
    description:
      "Tracks beginning and ending inventory values, count variances, purchases, glass and bottle sales, cost of sales, and cost percentage across inventory periods. Backed by a PostgreSQL stored function on AWS RDS.",
  },
  {
    title: "Storage Pull Report",
    url: "https://martindonovan.shinyapps.io/StoragePullReport/",
    tags: ["R", "Shiny", "Inventory"],
    description:
      "Generates a pull list to restock the in-restaurant wine room from the adjacent warehouse, based on current on-hand quantities and par levels.",
  },
  {
    title: "Restaurant Analytics Dashboard",
    url: "https://martindonovan.shinyapps.io/RestaurantAnalyticsDashboard/",
    tags: ["R", "Shiny", "Analytics", "Dashboard"],
    description:
      "Interactive dashboard tracking server performance metrics, guest counts, table analytics, and sales trends. Joins Aloha POS, OpenTable, and Restaurant365 data from PostgreSQL.",
  },
  {
    title: "Wine Purchase Report",
    url: "https://martindonovan.shinyapps.io/PurchaseDetailsReport/",
    tags: ["R", "Shiny", "PostgreSQL", "Reporting"],
    description:
      "Wine purchase invoices with expandable line-item detail, vendor summaries, and period cost tracking. Sourced from invoice and invoice detail tables in PostgreSQL.",
  },
];

const ShinyApps = () => {
  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          R Shiny Dashboards
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Operational analytics dashboards built in R Shiny, connected to a multi-location
          PostgreSQL database on AWS RDS. Each app provides browser-based reporting for a different
          aspect of restaurant and wine program operations.
        </Typography>
      </Paper>

      {/* App Cards */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {shinyApps.map((app, index) => (
          <Paper key={index} elevation={2} sx={{ overflow: "hidden" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "stretch",
              }}
            >
              {/* Screenshot placeholder */}
              <Box
                sx={{
                  width: { xs: "100%", sm: 260 },
                  minWidth: { sm: 260 },
                  height: { xs: 180, sm: "auto" },
                  minHeight: { sm: 200 },
                  backgroundColor: "#dfe6e9",
                  border: "2px dashed #b2bec3",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                {/* TODO: replace with actual screenshot — take with Selenium or browser */}
                <Image sx={{ fontSize: 40, color: "#95a5a6" }} />
                <Typography variant="caption" sx={{ color: "#95a5a6", fontWeight: 500 }}>
                  Screenshot
                </Typography>
              </Box>

              {/* Content */}
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#2c3e50", mb: 1 }}
                  >
                    {app.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, mb: 1.5 }}
                  >
                    {app.description}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {app.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ fontSize: "0.68rem", height: 20 }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Divider sx={{ mb: 1.5 }} />
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNew fontSize="small" />}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#2c3e50",
                      borderColor: "#2c3e50",
                      "&:hover": {
                        backgroundColor: "rgba(44,62,80,0.06)",
                        borderColor: "#2c3e50",
                      },
                    }}
                  >
                    Open App
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};

export default ShinyApps;
