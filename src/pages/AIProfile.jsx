import { Container, Paper, Typography, Box, Button, Divider } from "@mui/material";
import { SmartToy, OpenInNew } from "@mui/icons-material";

export default function AIProfile() {
  return (
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <SmartToy sx={{ fontSize: 36, color: "#2c3e50" }} />
          <Box>
            <Typography variant="h4" sx={{ color: "#2c3e50", lineHeight: 1.1 }}>
              AI-Readable Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Designed for Claude, ChatGPT, and other AI assistants
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>
          This page links to a static HTML summary of Martin Donovan's skills, projects, and role
          fit — structured so an AI assistant can read it directly from a URL and answer questions
          like <em>"Can this person do this job?"</em>, <em>"What level is this person at?"</em>,
          or <em>"Would this person be a fit for a research setting?"</em>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The static version is necessary because this portfolio is a React SPA — AI tools that
          fetch the portfolio URL receive an empty HTML shell, not the rendered content. The static
          page at <code>/ai-profile.html</code> is served directly and is fully readable without
          JavaScript.
        </Typography>
        <Button
          variant="contained"
          size="large"
          endIcon={<OpenInNew />}
          href="/ai-profile.html"
          target="_blank"
          sx={{ backgroundColor: "#2c3e50", "&:hover": { backgroundColor: "#34495e" } }}
        >
          Open AI-Readable Profile
        </Button>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#2c3e50" }}>
          What the profile covers
        </Typography>
        <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 0.75 } }}>
          <li><Typography variant="body2"><strong>Who he is</strong> — one-paragraph summary for context</Typography></li>
          <li><Typography variant="body2"><strong>Skill levels</strong> — honest assessment (Primary / Strong / Solid / Minimal / Gap) for SQL, R, ETL, Node.js, React, dbt, Python, BI tools, cloud, and more</Typography></li>
          <li><Typography variant="body2"><strong>Role-by-role fit</strong> — scored 0–100 with level, strengths, and gaps for 20+ data roles: data analyst, analytics engineer, BI developer, data engineer, research analyst, clinical data manager, hospitality tech, and others</Typography></li>
          <li><Typography variant="body2"><strong>Research setting fit</strong> — specific assessment for academic / medical / pharma / nonprofit contexts (Emory, etc.), including what he can contribute paid or volunteer</Typography></li>
          <li><Typography variant="body2"><strong>Domain expertise</strong> — hospitality tech, POS systems, perpetual inventory, restaurant analytics</Typography></li>
          <li><Typography variant="body2"><strong>Verifiable links</strong> — GitHub repos, SQL gists, R gists, and live Shiny apps so an AI can read the actual code rather than just trusting the summary</Typography></li>
          <li><Typography variant="body2"><strong>Lightweight internal tool builder</strong> — schema + API + AI-guided React or Shiny frontend; what this covers, honest scope, and where it breaks down</Typography></li>
          <li><Typography variant="body2"><strong>Honest caveats</strong> — React frontends are AI-guided; genuine depth is at the data layer</Typography></li>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#2c3e50" }}>
          How to use this with an AI assistant
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          Share the direct link to <code>/ai-profile.html</code> and ask:
        </Typography>
        <Box sx={{ bgcolor: "#f4f6f8", borderRadius: 1, p: 2, mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {`"Here's a candidate profile: [url]/ai-profile.html
Can this person do [job title] at [company type]?
What level would they come in at, and what would they need to ramp up?"`}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          The profile includes links to real code artifacts — the AI can follow them and verify
          the claims rather than relying only on the summary.
        </Typography>
      </Paper>
    </Container>
  );
}
