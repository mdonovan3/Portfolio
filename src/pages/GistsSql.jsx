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

const GistsSql = () => {
  const gists = [
    {
      title: "Perpetual inventory stored function",
      description:
        "PostgreSQL stored function implementing perpetual inventory calculations — computes theoretical on-hand quantity per SKU per location using beginning inventory, purchases, transfers, and sales with glass-to-bottle unit conversion. Called by the Shiny Inventory Analysis dashboard and the Node.js API.",
      url: "https://gist.github.com/mdonovan3/1565af77d4c93ca3450f5e64a40f4d79",
      tags: ["PostgreSQL", "Function", "CTE", "Inventory"],
    },
    {
      title: "Wine inventory database schema (DDL)",
      description:
        "Normalized PostgreSQL schema backing a multi-location restaurant wine program — products, cellar locations, inventory counts with variance detection, vendor invoices, daily POS sales, credits, and POS category mapping. Deployed on AWS RDS.",
      url: "https://gist.github.com/mdonovan3/891fdc4210113f328f36cd197a6290ac",
      tags: ["PostgreSQL", "Data Modeling", "DDL", "Schema"],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          SQL Code Snippets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          PostgreSQL schema design and stored functions from the wine inventory management system.
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

export default GistsSql;