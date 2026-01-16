import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  Code,
  School,
  Work,
  LocationOn,
} from '@mui/icons-material';

const Resume = () => {
  const programmingLanguages = [
    'R',
    'Python',
    'SQL',
    'Java',
    'JavaScript',
    'Node.js',
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#2c3e50' }}>
          Resume
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Martin Donovan
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <LocationOn sx={{ mr: 1, color: '#7f8c8d' }} />
          <Typography variant="body1" color="text.secondary">
            Atlanta, GA
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <School sx={{ mr: 2, color: '#2c3e50' }} />
          <Typography variant="h4" sx={{ color: '#2c3e50' }}>
            Education
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          Bachelor of Science in Computer Science
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Southern Polytechnic State University (now Kennesaw University)
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Work sx={{ mr: 2, color: '#2c3e50' }} />
          <Typography variant="h4" sx={{ color: '#2c3e50' }}>
            Professional Experience
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          Data Analyst & Wine/Beverage Director
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Liberty House Restaurant Corporation, Atlanta, GA
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Leveraging data analytics to optimize beverage program performance and
          drive business insights across multiple restaurant locations.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Code sx={{ mr: 2, color: '#2c3e50' }} />
          <Typography variant="h4" sx={{ color: '#2c3e50' }}>
            Programming Languages & Technologies
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {programmingLanguages.map((lang) => (
            <Chip
              key={lang}
              label={lang}
              sx={{
                backgroundColor: '#2c3e50',
                color: 'white',
                fontSize: '1rem',
                padding: '20px 10px',
              }}
            />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default Resume;
