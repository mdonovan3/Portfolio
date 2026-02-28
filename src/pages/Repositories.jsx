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