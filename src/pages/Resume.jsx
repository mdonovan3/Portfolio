import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { Code, School, Work, LocationOn } from "@mui/icons-material";

const skillGroups = [
  {
    label: "Languages",
    items: ["R", "SQL", "Java", "JavaScript / Node.js", "Perl", "Python"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "MongoDB", "Microsoft Access"],
  },
  {
    label: "Frameworks & Tools",
    items: ["R Shiny", "JavaFX", "Express.js", "tidyverse", "Passport.js", "dplyr"],
  },
  {
    label: "Data & ETL",
    items: [
      "Relational data modeling",
      "ETL pipeline development",
      "POS data ingestion",
      "Stored functions / procedures",
      "REST API design",
      "OData API integration",
    ],
  },
  {
    label: "Infrastructure",
    items: ["AWS RDS", "Windows Task Scheduler", "Git"],
  },
  {
    label: "Domain",
    items: [
      "Wine & beverage operations",
      "Hospitality analytics",
      "Inventory management",
      "Sales forecasting",
      "Multi-location data",
    ],
  },
];

const Resume = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ color: "#2c3e50" }}>
          Resume
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Martin Donovan
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <LocationOn sx={{ mr: 1, color: "#7f8c8d" }} />
          <Typography variant="body1" color="text.secondary">
            Atlanta, GA
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <School sx={{ mr: 2, color: "#2c3e50" }} />
          <Typography variant="h4" sx={{ color: "#2c3e50" }}>
            Education
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          Bachelor of Science in Computer Science
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Southern Polytechnic State University (now Kennesaw State University)
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Work sx={{ mr: 2, color: "#2c3e50" }} />
          <Typography variant="h4" sx={{ color: "#2c3e50" }}>
            Professional Experience
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Data Analyst & Wine/Beverage Director
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Liberty House Restaurant Corporation — Atlanta, GA
        </Typography>

        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Dual role combining wine program management with full-stack data systems
          development across multiple restaurant locations.
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
          Designed and built a complete wine inventory management platform from the ground up —
          spanning a normalized PostgreSQL schema on AWS RDS, a Java desktop application
          for catalog management, a Node.js/Express web application with a 14-endpoint
          REST API, and a nightly automated R ETL pipeline ingesting Aloha POS data
          across all locations. Oversaw the specification and rollout of a custom iOS
          wine list application integrated with the same database, which increased both
          overall wine sales and breadth of category sales.
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
          Built and maintain multiple R Shiny dashboards for operational reporting:
          inventory period analysis with count variance detection, restaurant analytics
          combining POS, OpenTable, and financial data, wine purchase reporting, and
          storage pull recommendations. Developed an R connector to the Restaurant365
          OData API for financial data integration.
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {["PostgreSQL", "R", "Shiny", "Java", "Node.js", "AWS RDS", "Aloha POS", "R365 OData"].map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{ backgroundColor: "#2c3e50", color: "white", fontSize: "0.72rem" }}
            />
          ))}
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Code sx={{ mr: 2, color: "#2c3e50" }} />
          <Typography variant="h4" sx={{ color: "#2c3e50" }}>
            Technical Skills
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {skillGroups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.label}>
              <Typography
                variant="caption"
                sx={{
                  color: "#7f8c8d",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  mb: 1,
                  pb: 0.5,
                  borderBottom: "2px solid #2c3e50",
                }}
              >
                {group.label}
              </Typography>
              {group.items.map((item) => (
                <Typography
                  key={item}
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5, lineHeight: 1.6 }}
                >
                  {item}
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Resume;