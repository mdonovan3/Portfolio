import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Email,
  School,
  Work,
  LocationOn,
  Storage,
  BarChart,
  AccountTree,
  Layers,
} from "@mui/icons-material";

const highlights = [
  { icon: <Storage sx={{ color: "#2c3e50" }} />, label: "Database design & ETL", detail: "PostgreSQL schema, stored functions, multi-tenant AWS RDS, automated R pipelines" },
  { icon: <BarChart sx={{ color: "#2c3e50" }} />, label: "Analytics & dashboards", detail: "R Shiny apps, DuckDB, multi-source joins (Aloha POS, OpenTable, R365)" },
  { icon: <AccountTree sx={{ color: "#2c3e50" }} />, label: "API & backend", detail: "Node.js / Express REST APIs, OData integration, fintech CSV pipelines" },
  { icon: <Layers sx={{ color: "#2c3e50" }} />, label: "Data wrangling & integration", detail: "Real-world messy sources: binary POS formats (DBF), paginated OData APIs, fintech CSVs, Excel files, fixed-width text files, web scraping, PDF extraction, manual entry — identity resolution, encoding issues, format normalization, gap handling, idempotent loads" },
];

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h2" gutterBottom sx={{ color: "#2c3e50" }}>
          Martin Donovan
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Data Analyst & Wine/Beverage Director
        </Typography>

        <Box sx={{ mt: 3, mb: 3 }}>
          <IconButton
            href="https://github.com/mdonovan3"
            target="_blank"
            sx={{ color: "#2c3e50" }}
          >
            <GitHub fontSize="large" />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/martin-donovan-9698735/"
            target="_blank"
            sx={{ color: "#2c3e50" }}
          >
            <LinkedIn fontSize="large" />
          </IconButton>
          <IconButton
            href="mailto:martindonovan@gmail.com"
            sx={{ color: "#2c3e50" }}
          >
            <Email fontSize="large" />
          </IconButton>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: "#7f8c8d" }} />
              <Typography variant="body1">
                <strong>Residence:</strong> Atlanta, GA
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <School sx={{ mr: 1, color: "#7f8c8d" }} />
              <Typography variant="body1">
                <strong>Education:</strong> BS in Computer Science
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              Southern Polytechnic State University (now Kennesaw State University)
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Work sx={{ mr: 1, color: "#7f8c8d" }} />
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

      {/* What I build — quick visual summary */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#2c3e50" }}>
          What I Build
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          I build data systems for restaurants — schema design to pipelines to dashboards — as a solo developer across a live multi-unit operation. Twenty years of domain depth, CS training, and the whole stack.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {highlights.map((h) => (
            <Box key={h.label} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              {h.icon}
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ color: "#2c3e50" }}>{h.label}</Typography>
                <Typography variant="body2" color="text.secondary">{h.detail}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="caption" sx={{ color: "#7f8c8d", display: "block", mb: 1, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Domain expertise
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {["Aloha / NCR POS", "Restaurant365 OData", "OpenTable", "Wine & beverage operations", "Multi-location inventory", "Labor & tip reporting", "Cost of sales", "Perpetual inventory"].map((d) => (
            <Chip key={d} label={d} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
          ))}
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#2c3e50" }}>
          About Me
        </Typography>
        <Typography variant="body1" paragraph>
          I hold a BS in Computer Science and have spent my career at the intersection
          of the restaurant industry and software development. Over twenty years at
          Liberty House Restaurant Corporation, I built and maintain a complete data
          platform for the company's wine program — starting with Excel spreadsheets
          and evolving through Microsoft Access, on-premise PostgreSQL, cloud migration
          to AWS RDS, a Node.js web application, an iOS guest-facing wine list app,
          and a multi-location automated analytics pipeline in R.
        </Typography>
        <Typography variant="body1" paragraph>
          Every component of that system was designed, built, or directly overseen by
          myself — spanning relational database design, ETL development, REST API
          construction, desktop and web application development, and operational
          reporting dashboards. In practice I function as the de facto product owner
          of this platform: defining requirements, prioritizing features, managing scope
          across technology generations, and making architecture decisions with no
          dedicated engineering team. My technical work has had direct business impact:
          reduced inventory variance, broader wine sales across categories, and
          data-informed purchasing decisions across multiple locations.
        </Typography>
        <Typography variant="body1">
          I'm currently looking to bring this combination of computer science training,
          deep domain expertise in hospitality data, and self-directed full-stack
          development into a data engineering or analytics role.
        </Typography>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#2c3e50" }}>
          Interests
        </Typography>
        <Typography variant="body1" paragraph>
          Wine has been a professional passion and a personal one — I hold advanced
          certifications and spend time studying regions, vintages, and producers beyond
          what the job requires. The wine list app and inventory system grew partly out
          of genuine curiosity about the data behind what ends up in a glass.
        </Typography>
        <Typography variant="body1">
          Outside of work I'm interested in the broader application of data engineering
          to hospitality — an industry that generates enormous operational data but
          historically underinvests in the tooling to use it.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;