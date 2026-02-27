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

const Repositories = () => {
  const repos = [
    {
      title: "Portfolio Site",
      description: "repository for this portfolio site",
      url: "https://github.com/mdonovan3/Portfolio.git",
      language: "React",
      tags: ["React", "front end"],
    },
    {
      title: "Sample Repository 2",
      description: "Description of your second GitHub repository",
      url: "#",
      language: "R",
      tags: ["API", "data transformation"],
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
          {repos.map((repo, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component="a"
                href={repo.url}
                target="_blank"
                sx={{
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <Code sx={{ mr: 2, color: "#7f8c8d" }} />
                <ListItemText
                  primary={repo.title}
                  secondary={
                    <div style={{ marginTop: "8px" }}>
                      {repo.tags.map((tag) => (
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

export default Repositories;
