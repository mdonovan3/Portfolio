import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Box,
} from "@mui/material";
import { Code } from "@mui/icons-material";

const GistsNode = () => {
  const gists = [
    {
      title: "Wine product instance API router",
      description:
        "Express.js router handling wine product instance endpoints — label image upload and retrieval via PostgreSQL large objects, wine list category management, critic ratings, and formula pricing. Includes role-based access control via Passport.js middleware.",
      url: "https://gist.github.com/mdonovan3/132dbd29f68042ba9832476e8711fd90",
      tags: ["Express", "Node.js", "PostgreSQL", "API", "REST"],
    },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          Node.js Code Snippets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Node.js and Express.js code from the wine program web application and REST API backend.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <List disablePadding>
          {gists.map((gist, index) => (
            <ListItem key={index} disablePadding divider={index < gists.length - 1}>
              <ListItemButton
                component="a"
                href={gist.url}
                target="_blank"
                sx={{
                  py: 2,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                }}
              >
                <Code sx={{ mr: 2, color: "#7f8c8d", flexShrink: 0, alignSelf: "flex-start", mt: 0.25 }} />
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500, color: "#2c3e50" }}>
                      {gist.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1, lineHeight: 1.6 }}>
                        {gist.description}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {gist.tags.map((tag) => (
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

export default GistsNode;