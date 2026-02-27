import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import { GitHub, Star } from "@mui/icons-material";

const Repositories = () => {
  const repos = [
    {
      title: "Portfolio Site",
      description: "repository for this portfolio site",
      url: "https://github.com/mdonovan3/Portfolio.git",
      language: "React",
      stars: 4,
    },
    {
      title: "Sample Repository 2",
      description: "Description of your second GitHub repository",
      url: "#",
      language: "R",
      stars: 8,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          GitHub Repositories
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Full projects and code repositories hosted on GitHub.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {repos.map((repo, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: "#2c3e50" }}>
                  {repo.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {repo.description}
                </Typography>
                <div>
                  <Chip
                    label={repo.language}
                    size="small"
                    sx={{ mr: 1, backgroundColor: "#2c3e50", color: "white" }}
                  />
                  <Chip
                    icon={<Star />}
                    label={repo.stars}
                    size="small"
                    variant="outlined"
                  />
                </div>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<GitHub />}
                  href={repo.url}
                  target="_blank"
                  sx={{ color: "#2c3e50" }}
                >
                  View on GitHub
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Repositories;
