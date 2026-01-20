import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Email,
  School,
  Work,
  LocationOn,
} from '@mui/icons-material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h2" gutterBottom sx={{ color: '#2c3e50' }}>
          Martin Donovan
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Data Analyst & Wine/Beverage Director
        </Typography>

        <Box sx={{ mt: 3, mb: 3 }}>
          <IconButton
            href="https://github.com"
            target="_blank"
            sx={{ color: '#2c3e50' }}
          >
            <GitHub fontSize="large" />
          </IconButton>
          <IconButton
            href="https://linkedin.com"
            target="_blank"
            sx={{ color: '#2c3e50' }}
          >
            <LinkedIn fontSize="large" />
          </IconButton>
          <IconButton
            href="mailto:your.email@gmail.com"
            sx={{ color: '#2c3e50' }}
          >
            <Email fontSize="large" />
          </IconButton>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: '#7f8c8d' }} />
              <Typography variant="body1">
                <strong>Residence:</strong> Atlanta, GA
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <School sx={{ mr: 1, color: '#7f8c8d' }} />
              <Typography variant="body1">
                <strong>Education:</strong> BS in Computer Science
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Southern Polytechnic State University (now Kennesaw University)
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Work sx={{ mr: 1, color: '#7f8c8d' }} />
              <Typography variant="body1">
                <strong>Position:</strong>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ ml: 4 }}>
              Data Analyst & Wine/Beverage Director
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Liberty House Restaurant Corporation, Atlanta
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2c3e50' }}>
          About Me
        </Typography>
        <Typography variant="body1" paragraph>
          I am an experienced restaurant professsional with training aand experience in programming and data analysis.
          I use my IT skills to transform data into actionable insights for my employer.
          With a background in computer science and experience in the hospitality industry, I bring
          a unique perspective to data analysis and business intelligence.
        </Typography>
        <Typography variant="body1" paragraph>
          Currently serving as both a Data Analyst and Wine/Beverage Director,
          I combine technical expertise with industry knowledge to drive
          data-informed decision making.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2c3e50' }}>
          Interests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          <em>Section to be filled with personal interests and hobbies...</em>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;
