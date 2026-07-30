import { Link as RouterLink } from "react-router-dom";
import { Box, Paper, Typography, Chip, Divider, Link } from "@mui/material";
import { ArrowBack, CheckCircle, Construction, Schedule } from "@mui/icons-material";

export const t = {
  slate: "#2c3e50",
  grey: "#7f8c8d",
  navy: "#2c3e50",
};

export const STAGE_STATUS = {
  done: { label: "Working", bg: "#c6f6d5", fg: "#276749", icon: <CheckCircle sx={{ fontSize: "0.85rem !important" }} /> },
  wip: { label: "In Progress", bg: "#fef3c7", fg: "#92400e", icon: <Construction sx={{ fontSize: "0.85rem !important" }} /> },
  todo: { label: "Not Started", bg: "#e2e8f0", fg: "#718096", icon: <Schedule sx={{ fontSize: "0.85rem !important" }} /> },
};

export const DetailHeader = ({ title, dek, status, runs, stack, folderHref }) => {
  const s = STAGE_STATUS[status];
  return (
    <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
      <Link
        component={RouterLink}
        to="/projects/tipout-ops"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, fontSize: "0.85rem", color: t.grey, textDecoration: "none", "&:hover": { color: t.slate } }}
      >
        <ArrowBack sx={{ fontSize: "1rem" }} /> tipout-ops overview
      </Link>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <Typography variant="h3" sx={{ color: t.slate }}>{title}</Typography>
        <Chip icon={s.icon} label={s.label} size="small"
          sx={{ bgcolor: s.bg, color: s.fg, fontWeight: 600, "& .MuiChip-icon": { color: `${s.fg} !important` } }} />
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2 }}>
        {dek}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, pt: 1 }}>
        <Typography variant="caption" sx={{ color: t.grey }}><b>Runs:</b> {runs}</Typography>
        <Typography variant="caption" sx={{ color: t.grey }}><b>Stack:</b> {stack}</Typography>
      </Box>
    </Paper>
  );
};

export const Section = ({ title, children, last }) => (
  <Paper elevation={2} sx={{ p: 4, mb: last ? 0 : 3 }}>
    {title && (
      <>
        <Typography variant="h5" gutterBottom sx={{ color: t.slate, fontWeight: 700 }}>{title}</Typography>
        <Divider sx={{ mb: 2 }} />
      </>
    )}
    {children}
  </Paper>
);

export const Prose = ({ children }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {children}
  </Box>
);

export const P = ({ children }) => (
  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
    {children}
  </Typography>
);

export const Callout = ({ label, children }) => (
  <Box sx={{
    border: "1px solid rgba(230,126,34,0.35)",
    backgroundColor: "rgba(230,126,34,0.06)",
    borderRadius: 1.5,
    p: 2.5,
    mb: 2.5,
  }}>
    <Typography variant="overline" sx={{ color: "#e67e22", fontWeight: 700, letterSpacing: 1, display: "block", mb: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
      {children}
    </Typography>
  </Box>
);

export const FlowDiagram = ({ steps }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 2.5 }}>
    {steps.map((step, i) => (
      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Paper variant="outlined" sx={{
          p: 1.5, minWidth: 130, textAlign: "center",
          opacity: step.faded ? 0.55 : 1,
        }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: t.slate, display: "block" }}>
            {step.title}
          </Typography>
          {step.subtitle && (
            <Typography variant="caption" sx={{ color: t.grey, fontSize: "0.68rem" }}>
              {step.subtitle}
            </Typography>
          )}
        </Paper>
        {i < steps.length - 1 && (
          <Typography sx={{ color: t.grey, fontWeight: 700 }}>&rarr;</Typography>
        )}
      </Box>
    ))}
  </Box>
);

export const StatRow = ({ stats }) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
    {stats.map(({ label, value }) => (
      <Box key={label} sx={{ minWidth: 130 }}>
        <Typography variant="caption" sx={{ color: t.grey, display: "block" }}>{label}</Typography>
        <Typography variant="h6" sx={{ color: t.slate, fontWeight: 700 }}>{value}</Typography>
      </Box>
    ))}
  </Box>
);
