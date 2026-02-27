import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
} from "@mui/material";
import { Code } from "@mui/icons-material";

const GistsR = () => {
  const gists = [
    {
      title:
        "Script to plan holiday sales based current inventory and previous year sales from Bevspot data",
      url: "https://gist.github.com/mdonovan3/b1a30326299a0a8c0c8d286e4f1eea1e",
      tags: ["data analysis"],
    },
    { 
      title: "R code to pull and transform API data from Restaurant365 OData connector", 
      url: "https://gist.github.com/mdonovan3/8fe35f6fab90876aea05bdc367beb5e7", 
      tags: ["API", "data transformation"] },
      {title: "R to aggregate POS dataset from raw data stored in RDBMS", 
      url: "https://gist.github.com/mdonovan3/66128ab231ef3466ef3ed6cf569dd059", 
      tags: ["dplyr", "data transformation"]}
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          R Code Snippets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Collection of R scripts for data analysis and visualization.
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
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <Code sx={{ mr: 2, color: "#7f8c8d" }} />
                <ListItemText
                  primary={gist.title}
                  secondary={
                    <div style={{ marginTop: "8px" }}>
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

export default GistsR;
