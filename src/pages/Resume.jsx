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

const continuingEd = [
  {
    name: "Data Science: Foundations using R",
    issuer: "Coursera — Johns Hopkins",
    date: "Oct 2020",
    credentialId: "JWRNT99W82Q5",
    note: "5-course specialization: Data Scientist's Toolbox, R Programming, Getting and Cleaning Data, Exploratory Data Analysis, Reproducible Research. Formal R foundation — predates current production R work.",
  },
  {
    name: "Exploratory Data Analysis",
    issuer: "Coursera — Johns Hopkins",
    date: "Jul 2020",
    note: "Standalone completion — also included in Data Science: Foundations using R. Analytic graphics, ggplot2, clustering, dimension reduction.",
  },
  {
    name: "Reproducible Research",
    issuer: "Coursera — Johns Hopkins",
    date: "Aug 2020",
    note: "Standalone completion — also included in Data Science: Foundations using R. knitr, literate programming, reproducible workflows.",
  },
  {
    name: "Node with React: Fullstack Web Development",
    issuer: "Udemy",
    date: "Mar 2022",
    credentialId: "UC-4eb2f8e1-e3cb-44e1-8991-6c89a0afb2ad",
    note: "Formal Node.js and React study — aligns with current stack",
  },
  {
    name: "Introduction to Data Science in Python",
    issuer: "Coursera",
    date: "Jun 2023",
    credentialId: "3P83CBSH86EH",
    note: "Python data stack — NumPy, Pandas",
  },
  {
    name: "Spring Framework Specialization",
    issuer: "Coursera",
    date: "Apr 2023",
    note: "4-course specialization: Ecosystem & Core, MVC/Boot/REST, Data Repositories, Cloud Overview. Java/Spring backend depth — supplements Java desktop app background.",
  },
  {
    name: "Spring — Ecosystem and Core",
    issuer: "Coursera",
    date: "Mar 2023",
    note: "Spring core concepts and dependency injection",
  },
  {
    name: "Spring MVC, Spring Boot and Rest Controllers",
    issuer: "Coursera",
    date: "Mar 2023",
    note: "Spring REST API patterns",
  },
  {
    name: "Spring Data Repositories",
    issuer: "Coursera",
    date: "Apr 2023",
    note: "Spring Data persistence layer",
  },
  {
    name: "Spring — Cloud Overview",
    issuer: "Coursera",
    date: "Apr 2023",
    note: "Spring Cloud microservices overview",
  },
];

const skillGroups = [
  {
    label: "Languages",
    items: ["R", "SQL", "Python", "Java", "JavaScript / TypeScript / Node.js"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "DuckDB", "SQLite", "Microsoft Access", { label: "Oracle", note: "certified DBA, older version" }],
  },
  {
    label: "Frameworks & Tools",
    items: ["dbt", "R Shiny", "JavaFX", "Express.js", "tidyverse", "dplyr", "renv", "Quarto"],
  },
  {
    label: "Data & ETL",
    items: [
      "Relational data modeling",
      "Multi-tenant architecture",
      "ETL pipeline development",
      "Analytics engineering (dbt)",
      "POS data ingestion",
      "Parquet / columnar storage",
      "Stored functions / procedures",
      "REST API design",
      "OData API integration",
      "Real-world data wrangling: binary formats, APIs, Excel, text files, web scraping, PDF — normalization, identity resolution, gap handling",
    ],
  },
  {
    label: "Infrastructure",
    items: ["AWS RDS", "AWS EC2", "AWS S3", "Terraform", "Git"],
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

        <Divider sx={{ my: 3 }} />

        <Typography variant="overline" sx={{ color: "#7f8c8d", fontWeight: 700, letterSpacing: "0.1em", display: "block", mb: 2 }}>
          Continuing Education
        </Typography>
        {continuingEd.map((cert, i) => (
          <Box key={cert.name} sx={{ mb: i < continuingEd.length - 1 ? 1.5 : 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#2c3e50", lineHeight: 1.5 }}>
              {cert.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {cert.issuer} · {cert.date}{cert.credentialId ? ` · ID: ${cert.credentialId}` : ""}
            </Typography>
            <Typography variant="caption" sx={{ color: "#95a5a6", fontStyle: "italic" }}>
              {cert.note}
            </Typography>
          </Box>
        ))}
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
          development across multiple restaurant locations. Functioned as de facto
          product owner of the data platform throughout — defining requirements,
          managing scope, and driving architecture decisions independently across
          twenty years and five technology generations.
        </Typography>

        <Box component="ul" sx={{ pl: 2.5, mt: 0, mb: 2 }}>
          {[
            "Designed and built a complete wine inventory management platform from scratch — normalized PostgreSQL schema on AWS RDS, Java desktop application, 14-endpoint Node.js/Express REST API, and a React SPA consolidating inventory, sales, purchasing, and analytics into one interface. Oversaw rollout of a custom iOS wine list app integrated with the same database, increasing both overall wine sales and category breadth.",
            "Built and maintain multiple R Shiny dashboards for operational reporting: period-over-period inventory analysis with count variance detection, restaurant analytics combining Aloha POS, OpenTable, and R365 financial data, wine purchase reporting, and storage pull recommendations.",
            "Developed analytics engineering pipeline using Python ingestion scripts (Aloha POS DBF, R365 OData), dbt for typed/tested transformations (staging views, materialized mart tables, lineage), and a Node.js API serving KPIs and COGS metrics. Deployed to AWS EC2 with S3 data lake via Terraform.",
            "Extensive real-world data wrangling across varied source formats — binary DBF files, paginated OData APIs, fintech CSVs, Excel, fixed-width text files, web scraping, and PDF extraction — including identity resolution, encoding normalization, gap handling, and idempotent pipeline design.",
          ].map((item, i) => (
            <Box component="li" key={i} sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {["PostgreSQL", "R", "Python", "dbt", "Shiny", "Java", "Node.js", "React", "React Native", "AWS RDS", "AWS EC2", "AWS S3", "Terraform", "Aloha POS", "R365 OData", "Parquet"].map((t) => (
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
              {group.items.map((item) =>
                typeof item === "string" ? (
                  <Typography
                    key={item}
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, lineHeight: 1.6 }}
                  >
                    {item}
                  </Typography>
                ) : (
                  <Typography
                    key={item.label}
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5, lineHeight: 1.6 }}
                  >
                    {item.label}{" "}
                    <Box component="span" sx={{ fontSize: "0.72rem", opacity: 0.7 }}>
                      ({item.note})
                    </Box>
                  </Typography>
                )
              )}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Resume;