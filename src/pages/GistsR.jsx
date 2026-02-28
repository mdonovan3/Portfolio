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
} from "@mui/material";
import { Code } from "@mui/icons-material";

const GistsR = () => {
  const gists = [
    {
      title: "Holiday sales planning tool",
      description:
        "Joins current BevSpot inventory data with prior-year Aloha POS sales to project bottle requirements for high-volume holiday periods. Extracts pour quantities from recipes, converts glass sales to bottle equivalents, and outputs a purchase recommendation by SKU.",
      url: "https://gist.github.com/mdonovan3/b1a30326299a0a8c0c8d286e4f1eea1e",
      tags: ["R", "tidyverse", "BevSpot", "Forecasting"],
    },
    {
      title: "Restaurant365 OData API connector",
      description:
        "R functions to authenticate and retrieve financial transaction data from the Restaurant365 OData API — GL account lookups, transaction detail joins, and multi-location date-range queries. Used to feed financial data into operational reporting dashboards.",
      url: "https://gist.github.com/mdonovan3/8fe35f6fab90876aea05bdc367beb5e7",
      tags: ["R", "API", "OData", "Restaurant365", "Data transformation"],
    },
    {
      title: "Multi-source POS data aggregation",
      description:
        "Aggregates daily restaurant data from Aloha POS (gnditem, gndvoid, gndline tables), OpenTable, and Restaurant365 stored in PostgreSQL. Handles Aloha's day-level consistency constraint — all records for a given business day are joined before aggregation to avoid partial-day artifacts.",
      url: "https://gist.github.com/mdonovan3/66128ab231ef3466ef3ed6cf569dd059",
      tags: ["R", "dplyr", "PostgreSQL", "Aloha POS", "Data transformation"],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          R Code Snippets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          R scripts for ETL, API integration, and data analysis — part of the automated
          multi-location data pipeline connecting Aloha POS, Restaurant365, and BevSpot
          to PostgreSQL on AWS RDS.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <List disablePadding>
          {gists.map((gist, index) => (
            <ListItem key={index} disablePadding divider={index < gists.length - 1}>
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
    </Container>
  );
};

export default GistsR;