import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
} from '@mui/material';
import { Code } from '@mui/icons-material';

const GistsNode = () => {
  const gists = [
    { title: 'Product API endpoint', url: 'https://gist.github.com/mdonovan3/132dbd29f68042ba9832476e8711fd90', tags: ['Express', 'API'] },
    { title: 'Node.js Gist Example 2', url: '#', tags: ['Async', 'Utilities'] },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#2c3e50' }}>
          Node.js Code Snippets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Collection of Node.js scripts and utilities.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <List>
          {gists.map((gist, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                component="a"
                href={gist.url}
                target="_blank"
                sx={{
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <Code sx={{ mr: 2, color: '#7f8c8d' }} />
                <ListItemText
                  primary={gist.title}
                  secondary={
                    <div style={{ marginTop: '8px' }}>
                      {gist.tags.map((tag) => (
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

export default GistsNode;
