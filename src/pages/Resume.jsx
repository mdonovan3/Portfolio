import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Collapse,
} from "@mui/material";
import { Code, School, Work, LocationOn, ExpandMore, ExpandLess } from "@mui/icons-material";

const csCourses = [
  { name: "Data Structures", desc: "Linked lists, trees, graphs, and hash tables — complexity analysis via Big-O notation." },
  { name: "Analysis of Algorithms", desc: "Sorting, graph traversal, dynamic programming, and introduction to NP-completeness." },
  { name: "Computer Organization", desc: "CPU architecture, instruction sets, assembly language, and memory hierarchy." },
  { name: "Operating Systems", desc: "Process management, threading, memory allocation, file systems, and scheduling." },
  { name: "Database Systems", desc: "Relational model, SQL, normalization, indexing, and transaction fundamentals." },
  { name: "Software Engineering", desc: "SDLC, UML, requirements analysis, design patterns, and testing methodologies." },
  { name: "Programming Languages", desc: "Language paradigms, formal grammars, parsing, and type systems." },
  { name: "Computer Networks", desc: "TCP/IP stack, protocol layering, routing, and network security fundamentals." },
  { name: "Theory of Computation", desc: "Finite automata, Turing machines, decidability, and computational complexity classes." },
  { name: "Professional Practices & Ethics", desc: "Computing ethics, intellectual property law, and professional responsibility." },
  { name: "Senior Capstone Project", desc: "Team-based software development applying full-cycle engineering principles." },
];

const mathCourses = [
  { name: "Calculus I & II", desc: "Differential and integral calculus, limits, infinite series, and applications." },
  { name: "Differential Equations", desc: "Ordinary differential equations, initial value problems, and engineering applications." },
  { name: "Linear Algebra", desc: "Vectors, matrices, linear transformations, eigenvalues, and applications in computing." },
  { name: "Discrete Mathematics", desc: "Logic, proof techniques, combinatorics, graph theory, and Boolean algebra." },
  { name: "Probability & Statistics I & II", desc: "Probability distributions, statistical inference, hypothesis testing, and regression analysis." },
];

const contEdPrograms = [
  {
    id: "ds_r",
    name: "Data Science: Foundations using R",
    issuer: "Coursera — Johns Hopkins",
    date: "Oct 2020",
    credentialId: "JWRNT99W82Q5",
    type: "specialization",
    summary: "5-course specialization providing a formal R foundation for data science workflows — established the R skills that underpin current production ETL and Shiny dashboard work.",
    courses: [
      { name: "Data Scientist's Toolbox", desc: "R environment setup, version control with Git, and data science workflow fundamentals." },
      { name: "R Programming", desc: "Core R language: data types, control structures, functions, scoping, and debugging." },
      { name: "Getting and Cleaning Data", desc: "Data acquisition from APIs and files, tidy data principles, and dplyr transformations." },
      { name: "Exploratory Data Analysis", desc: "Analytic graphics, ggplot2, clustering, and dimension reduction techniques." },
      { name: "Reproducible Research", desc: "knitr, R Markdown, literate programming, and reproducible analysis workflows." },
    ],
  },
  {
    id: "node_react",
    name: "Node with React: Fullstack Web Development",
    issuer: "Udemy",
    date: "Mar 2022",
    credentialId: "UC-4eb2f8e1-e3cb-44e1-8991-6c89a0afb2ad",
    type: "standalone",
    summary: "Full-stack web development with Node.js/Express backend and React frontend — aligns directly with the current production stack used in the wine management platform.",
  },
  {
    id: "spring",
    name: "Spring Framework Specialization",
    issuer: "Coursera",
    date: "Apr 2023",
    type: "specialization",
    summary: "4-course specialization covering the Spring ecosystem for Java backend development — complements the existing Java desktop app background with modern Spring patterns.",
    courses: [
      { name: "Spring — Ecosystem and Core", desc: "Dependency injection, IoC container, Spring beans, and core framework architecture." },
      { name: "Spring MVC, Spring Boot and Rest Controllers", desc: "Building RESTful APIs with Spring MVC, Boot auto-configuration, and REST design patterns." },
      { name: "Spring Data Repositories", desc: "JPA, Spring Data repository abstraction, and persistence layer design." },
      { name: "Spring — Cloud Overview", desc: "Microservices concepts, service discovery, and Spring Cloud infrastructure patterns." },
    ],
  },
  {
    id: "py_ds",
    name: "Introduction to Data Science in Python",
    issuer: "Coursera",
    date: "Jun 2023",
    credentialId: "3P83CBSH86EH",
    type: "standalone",
    summary: "Python data stack fundamentals — NumPy arrays and Pandas DataFrames; entry point to the Python proficiency currently expanding through the analytics engineering pipeline project.",
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

const SectionToggle = ({ label, open, onToggle, sx = {} }) => (
  <Box
    onClick={onToggle}
    sx={{
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      userSelect: "none",
      gap: 0.5,
      ...sx,
    }}
  >
    <Typography variant="caption" sx={{ fontWeight: 700, color: "#7f8c8d", letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {label}
    </Typography>
    {open
      ? <ExpandLess sx={{ fontSize: 16, color: "#7f8c8d" }} />
      : <ExpandMore sx={{ fontSize: 16, color: "#7f8c8d" }} />}
  </Box>
);

const Resume = () => {
  const [formalOpen, setFormalOpen] = useState(false);
  const [csOpen, setCsOpen] = useState(false);
  const [mathOpen, setMathOpen] = useState(false);
  const [contEdOpen, setContEdOpen] = useState(false);
  const [specOpen, setSpecOpen] = useState({});

  const toggleSpec = (id) => setSpecOpen((prev) => ({ ...prev, [id]: !prev[id] }));

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

      {/* Education */}
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <School sx={{ mr: 2, color: "#2c3e50" }} />
          <Typography variant="h4" sx={{ color: "#2c3e50" }}>
            Education
          </Typography>
        </Box>

        {/* Formal Education */}
        <Typography variant="overline" sx={{ color: "#2c3e50", fontWeight: 700, letterSpacing: "0.1em", display: "block", mb: 1.5 }}>
          Formal Education
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#2c3e50", lineHeight: 1.3 }}>
          Bachelor of Science in Computer Science
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
          Southern Polytechnic State University (now Kennesaw State University) · 2007
        </Typography>

        <SectionToggle
          label="Coursework"
          open={formalOpen}
          onToggle={() => setFormalOpen(!formalOpen)}
          sx={{ mb: 1 }}
        />
        <Collapse in={formalOpen}>
          <Box sx={{ pl: 1.5, pt: 1, pb: 0.5 }}>

            {/* CS sub-section */}
            <SectionToggle
              label="Computer Science"
              open={csOpen}
              onToggle={() => setCsOpen(!csOpen)}
              sx={{ mb: 0.75 }}
            />
            <Collapse in={csOpen}>
              <Box sx={{ pl: 1.5, pb: 1.5 }}>
                {csCourses.map((c) => (
                  <Box key={c.name} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#34495e", lineHeight: 1.4 }}>
                      {c.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#95a5a6", lineHeight: 1.5, display: "block" }}>
                      {c.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>

            {/* Math sub-section */}
            <SectionToggle
              label="Mathematics"
              open={mathOpen}
              onToggle={() => setMathOpen(!mathOpen)}
              sx={{ mb: 0.75 }}
            />
            <Collapse in={mathOpen}>
              <Box sx={{ pl: 1.5, pb: 1 }}>
                {mathCourses.map((c) => (
                  <Box key={c.name} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#34495e", lineHeight: 1.4 }}>
                      {c.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#95a5a6", lineHeight: 1.5, display: "block" }}>
                      {c.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>

          </Box>
        </Collapse>

        <Divider sx={{ my: 3 }} />

        {/* Continuing Education */}
        <Box sx={{ opacity: 0.88 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="overline" sx={{ color: "#7f8c8d", fontWeight: 700, letterSpacing: "0.1em" }}>
              Continuing Education
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#95a5a6", mb: 1.5, lineHeight: 1.6 }}>
            4 programs · 11 courses · Coursera (Johns Hopkins), Udemy · 2020–2023 · Data science in R and Python, full-stack web development, Java/Spring backend.
          </Typography>
          <SectionToggle
            label="Show programs"
            open={contEdOpen}
            onToggle={() => setContEdOpen(!contEdOpen)}
            sx={{ mb: 1 }}
          />
          <Collapse in={contEdOpen}>
            <Box sx={{ pl: 1, pt: 0.5 }}>
              {contEdPrograms.map((prog, i) => (
                <Box key={prog.id} sx={{ mb: i < contEdPrograms.length - 1 ? 2 : 0 }}>
                  {prog.type === "specialization" ? (
                    <>
                      <Box
                        onClick={() => toggleSpec(prog.id)}
                        sx={{ display: "flex", alignItems: "flex-start", cursor: "pointer", userSelect: "none", gap: 0.5 }}
                      >
                        {specOpen[prog.id]
                          ? <ExpandLess sx={{ fontSize: 16, color: "#7f8c8d", mt: 0.3, flexShrink: 0 }} />
                          : <ExpandMore sx={{ fontSize: 16, color: "#7f8c8d", mt: 0.3, flexShrink: 0 }} />}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#2c3e50", lineHeight: 1.4 }}>
                            {prog.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            {prog.issuer} · {prog.date}{prog.credentialId ? ` · ID: ${prog.credentialId}` : ""}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#95a5a6", fontStyle: "italic", display: "block" }}>
                            {prog.summary}
                          </Typography>
                        </Box>
                      </Box>
                      <Collapse in={!!specOpen[prog.id]}>
                        <Box sx={{ pl: 3, pt: 1 }}>
                          {prog.courses.map((c) => (
                            <Box key={c.name} sx={{ mb: 0.75 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "#34495e", lineHeight: 1.4 }}>
                                {c.name}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "#95a5a6", lineHeight: 1.5, display: "block" }}>
                                {c.desc}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    </>
                  ) : (
                    <Box sx={{ pl: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#2c3e50", lineHeight: 1.4 }}>
                        {prog.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {prog.issuer} · {prog.date}{prog.credentialId ? ` · ID: ${prog.credentialId}` : ""}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#95a5a6", fontStyle: "italic", display: "block" }}>
                        {prog.summary}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      </Paper>

      {/* Professional Experience */}
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

      {/* Technical Skills */}
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
