import { Container, Paper, Typography, Box, Button, Divider, Tooltip, IconButton } from "@mui/material";
import { SmartToy, DataObject, ContentCopy } from "@mui/icons-material";
import { useState } from "react";

const PROFILE_URL = "https://portfolio.martindonovan.net/profile.json";

export default function AIProfile() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          This portfolio is a React SPA. To make it readable by AI tools and crawlers, two static
          files are served alongside the app:{" "}
          <strong>profile.json</strong> (structured candidate data) and a full plain-text summary
          of all portfolio content intended for machine consumption — both linked from the page head
          via <code>&lt;link rel="alternate"&gt;</code> so bots can discover them without executing
          JavaScript. Give an AI the URL below to evaluate this profile directly:
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<DataObject />}
            href="/profile.json"
            target="_blank"
            sx={{ backgroundColor: "#2c3e50", "&:hover": { backgroundColor: "#34495e" } }}
          >
            profile.json — structured data
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
          <strong>profile.json</strong> is the primary data product: each skill has authorship tags,
          each evidence item has an explicit <code>skills_demonstrated[]</code> field, and confirmed
          gaps are enumerated. Static files are linked via{" "}
          <code>&lt;link rel="alternate"&gt;</code> in the page head so bots can discover them without JavaScript.
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f4f6f8", borderRadius: 1, px: 2, py: 1.25 }}>
          <Typography variant="body2" sx={{ fontFamily: "monospace", flexGrow: 1, color: "#2c3e50" }}>
            {PROFILE_URL}
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy URL"}>
            <IconButton size="small" onClick={handleCopy} sx={{ color: "#7f8c8d" }}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#2c3e50" }}>
          What profile.json contains
        </Typography>
        <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 0.75 } }}>
          <li><Typography variant="body2"><strong>skills[]</strong> — each with authorship tag (own vs. AI-guided), status, years active, subskills, evidence IDs, and audience-specific context</Typography></li>
          <li><Typography variant="body2"><strong>evidence[]</strong> — every verifiable artifact: GitHub repos, SQL gists, R gists, Node.js gists, live Shiny apps — each with a <code>skills_demonstrated[]</code> field naming exactly what it proves</Typography></li>
          <li><Typography variant="body2"><strong>work_contexts</strong> — professional (WLM platform, paid employment) and lab_volunteer (research lab task fit) structured separately</Typography></li>
          <li><Typography variant="body2"><strong>constraints[]</strong> — confirmed skill absences, authorship caveats, security notes</Typography></li>
          <li><Typography variant="body2"><strong>No scoring or "great fit" narrative</strong> — the data supports your own conclusions</Typography></li>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#2c3e50" }}>
          How to use with an AI assistant
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          Point the AI at <code>/profile.json</code> and ask:
        </Typography>
        <Box sx={{ bgcolor: "#f4f6f8", borderRadius: 1, p: 2, mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
            {`"Here's a candidate profile: ${PROFILE_URL}
Can this person do [job title] at [company type]?
What level would they come in at, and what would they need to ramp up?"`}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          The evidence items link to real code — the AI can follow them and verify claims directly
          rather than relying on the summary.
        </Typography>
      </Paper>
    </Container>
  );
}
