import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import { GitHub, Star, Code } from "@mui/icons-material";

const ShinyApps = () => {
  const shinyApps = [
    {
      title: "Inventory Analysis",
      description:
        "Inventory count variance and other tools to assist with inventory management",
      url: "https://martindonovan.shinyapps.io/InventoryAnalysis/",
      tags: ["React", "front end"],
    },
    {
      title: "Storage Pull Report",
      description:
        "To restock the in-restaurant wine room from the next door warehouse",
      url: "https://martindonovan.shinyapps.io/StoragePullReport/",
      tags: ["React", "front end"],
    },
    {
      title: "Restaurant Analytics Dashboard",
      description: "Metrics related to servers and guests",
      url: "https://martindonovan.shinyapps.io/RestaurantAnalyticsDashboard/",
      tags: ["React", "front end"],
    },
    {
      title: "Wine Purchase Report",
      description: "Wine purchase innvoices with expandable detail line items",
      url: "https://martindonovan.shinyapps.io/StoragePullReport/",
      tags: ["React", "front end"],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          Code Repositories
        </Typography>
        <Typography variant="body1" color="text.secondary">
          placeholder
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <List>
          {shinyApps.map((app, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component="a"
                href={app.url}
                target="_blank"
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <Code sx={{ mr: 2, color: "#7f8c8d" }} />
                <ListItemText
                  primary={app.title}
                  secondary={
                    <div style={{ marginTop: "8px" }}>
                      {app.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={<em>{tag}</em>}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </div>
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
