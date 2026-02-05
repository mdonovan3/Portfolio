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

const GistsSql = () => {
  const gists = [
    { title: 'SQL function with CTE to compute on hand inventory', url: 'https://gist.github.com/mdonovan3/1565af77d4c93ca3450f5e64a40f4d79', tags: ['Function', 'CTE'] },
    { title: 'DDL for wine inventory database', url: 'https://gist.github.com/mdonovan3/891fdc4210113f328f36cd197a6290ac', tags: ['Data Modeling', 'SQL'] },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: '#2c3e50' }}>
          SQL Code Snippets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Collection of SQL queries and database solutions.
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
                          label={tag}
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

export default GistsSql;
