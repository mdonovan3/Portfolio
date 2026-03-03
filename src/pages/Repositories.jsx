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
import { GitHub } from "@mui/icons-material";

const Repositories = () => {
  const repos = [

    {
      title: "Inventory Spot Check",
      description:
        "Quarto-based inventory spot check report for a fine dining wine program. Pulls theoretical on-hand quantities from a PostgreSQL stored function, combines with post-count sales and purchase activity, and renders a paginated, room-by-room table formatted for physical spot checking against actual cellar counts for products that were purchased or sold since the last inventory count. Generated as a print-ready Word document.",
      url: "#",
      tags: ["R", "Quarto", "PostgreSQL", "gt", "inventory", "restaurant analytics", "RDS"],
    },
    {
      title: "Wine Inventory Analysis",
      description:
        "R Shiny dashboard for period-over-period wine inventory analysis at a multi-location fine dining group. Tracks beginning and ending inventory values, count variances against theoretical on-hand, vendor purchases, and glass and bottle sales — with cost of sales and wine cost percentage calculated automatically. Supports URL parameter deep-linking for direct period access. Backed by PostgreSQL on AWS RDS.",
      url: "#",
      tags: ["R", "Shiny", "PostgreSQL", "shinydashboard", "DT", "restaurant analytics", "RDS"],
    },
    {
      title: "Wine List Manager — Web Application",
      description:
        "Node.js/Express web application for managing a restaurant wine program across multiple locations. Server-rendered EJS views over a 14-endpoint REST API backed by PostgreSQL on AWS RDS. Covers product catalog management, cellar inventory, vendor invoice tracking, and wine list organization. User authentication via Passport.js with bcrypt; dual-database architecture separating session data (MongoDB) from domain data (PostgreSQL)",
      url: "https://github.com/mdonovan3/wlm-web",
      tags: ["Node.js", "Express", "PostgreSQL", "EJS", "Passport.js", "REST API", "JQuery"],
    },
    {
      title: "Portfolio Site",
      description:
        "This portfolio site — a React/Vite single-page application using Material UI. Routed across project pages covering the wine inventory system, R Shiny dashboards, SQL and R gists, and resume.",
      url: "https://github.com/mdonovan3/Portfolio",
      tags: ["React", "Vite", "MUI", "Front end"],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          Code Repositories
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Full project repositories hosted on GitHub. Most of the wine inventory
          system code lives in private repositories; the gists and Shiny apps
          pages contain the publicly shared components.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <List disablePadding>
          {repos.map((repo, index) => (
            <ListItem key={index} disablePadding divider={index < repos.length - 1}>
              <ListItemButton
                component="a"
                href={repo.url}
                target="_blank"
                sx={{
                  py: 2,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <GitHub sx={{ mr: 2, color: "#7f8c8d", flexShrink: 0, alignSelf: "flex-start", mt: 0.25 }} />
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, color: "#2c3e50" }}>
                      {repo.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1, lineHeight: 1.6 }}>
                        {repo.description}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {repo.tags.map((tag) => (
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

export default Repositories;