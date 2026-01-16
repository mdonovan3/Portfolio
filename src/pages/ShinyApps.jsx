import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from '@mui/material';
import { Launch } from '@mui/icons-material';

const ShinyApps = () => {
  const shinyApps = [
    {
      title: 'Sample Shiny App 1',
      description: 'Description of your first R Shiny application',
      url: '#',
    },
    {
      title: 'Sample Shiny App 2',
      description: 'Description of your second R Shiny application',
      url: '#',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#2c3e50' }}>
          R Shiny Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Interactive data visualization and analytics applications built with R
          Shiny.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {shinyApps.map((app, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50' }}>
                  {app.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  endIcon={<Launch />}
                  href={app.url}
                  target="_blank"
                  sx={{ color: '#2c3e50' }}
                >
                  Launch App
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ShinyApps;
