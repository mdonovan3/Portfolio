import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { BarChart } from "@mui/icons-material";

const ShinyApps = () => {
  const shinyApps = [
    {
      title: "Inventory Analysis",
      description:
        "Tracks beginning and ending inventory values, count variances, purchases, glass and bottle sales, cost of sales, and cost percentage across inventory periods. Backed by a PostgreSQL stored function on AWS RDS.",
      url: "https://martindonovan.shinyapps.io/InventoryAnalysis/",
      tags: ["R", "Shiny", "PostgreSQL", "Inventory"],
    },
    {
      title: "Storage Pull Report",
      description:
        "Generates a pull list to restock the in-restaurant wine room from the adjacent warehouse, based on current on-hand quantities and par levels.",
      url: "https://martindonovan.shinyapps.io/StoragePullReport/",
      tags: ["R", "Shiny", "Inventory"],
    },
    {
      title: "Restaurant Analytics Dashboard",
      description:
        "Interactive dashboard tracking server performance metrics, guest counts, table analytics, and sales trends. Joins Aloha POS, OpenTable, and Restaurant365 data from PostgreSQL.",
      url: "https://martindonovan.shinyapps.io/RestaurantAnalyticsDashboard/",
      tags: ["R", "Shiny", "Analytics", "Dashboard"],
    },
    {
      title: "Wine Purchase Report",
      description:
        "Wine purchase invoices with expandable line-item detail, vendor summaries, and period cost tracking. Sourced from invoice and invoice detail tables in PostgreSQL.",
      url: "https://martindonovan.shinyapps.io/PurchaseDetailsReport/",
      tags: ["R", "Shiny", "PostgreSQL", "Reporting"],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          R Shiny Dashboards
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Operational analytics dashboards built in R Shiny, connected to a
          multi-location PostgreSQL database on AWS RDS. Each app provides
          browser-based reporting for a different aspect of restaurant and
          wine program operations.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <List disablePadding>
          {shinyApps.map((app, index) => (
            <ListItem key={index} disablePadding divider={index < shinyApps.length - 1}>
              <ListItemButton
                component="a"
                href={app.url}
                target="_blank"
                sx={{
                  py: 2,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <BarChart sx={{ mr: 2, color: "#7f8c8d", flexShrink: 0, alignSelf: "flex-start", mt: 0.25 }} />
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, color: "#2c3e50" }}>
                      {app.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1, lineHeight: 1.6 }}>
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
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ShinyApps;