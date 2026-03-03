// pages/WineSalesImport.jsx
// Dependencies: recharts

import {
  Container, Paper, Typography, Box, Grid, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import CheckCircleIcon  from "@mui/icons-material/CheckCircle";
import WarningIcon      from "@mui/icons-material/Warning";
import SkipNextIcon     from "@mui/icons-material/SkipNext";

const NAVY = "#2c3e50", SILVER = "#95a5a6", GREEN = "#27ae60", RED = "#e74c3c", BLUE = "#2980b9";

const importLog = [
  { date:"2024-12-16", location:"Blue Ridge Grill", records:148, status:"imported",  db:"brg_wine"   },
  { date:"2024-12-16", location:"Bones",            records:203, status:"imported",  db:"bones_wine" },
  { date:"2024-12-16", location:"OK Cafe",          records:94,  status:"imported",  db:"okc_wine"   },
  { date:"2024-12-15", location:"Blue Ridge Grill", records:161, status:"imported",  db:"brg_wine"   },
  { date:"2024-12-15", location:"Bones",            records:188, status:"imported",  db:"bones_wine" },
  { date:"2024-12-15", location:"OK Cafe",          records:77,  status:"skipped",   db:"okc_wine"   },
  { date:"2024-12-14", location:"Blue Ridge Grill", records:0,   status:"error",     db:"brg_wine"   },
  { date:"2024-12-14", location:"Bones",            records:214, status:"imported",  db:"bones_wine" },
  { date:"2024-12-14", location:"OK Cafe",          records:88,  status:"imported",  db:"okc_wine"   },
];

const salesByLocation = [
  { month:"Jul", brg:68400, bones:82100, okc:31200 },
  { month:"Aug", brg:64800, bones:77600, okc:29400 },
  { month:"Sep", brg:72100, bones:86300, okc:33800 },
  { month:"Oct", brg:79300, bones:94100, okc:38200 },
  { month:"Nov", brg:88400, bones:108600, okc:42300 },
  { month:"Dec", brg:91200, bones:112400, okc:44800 },
];

const salesMix = [
  { month:"Jul", btg:23100, bottle:68500 },
  { month:"Aug", btg:21900, bottle:66300 },
  { month:"Sep", btg:25600, bottle:70800 },
  { month:"Oct", btg:31200, bottle:77700 },
  { month:"Nov", btg:38400, bottle:83000 },
  { month:"Dec", btg:41200, bottle:77400 },
];

const StatusIcon = ({ status }) => {
  if (status === "imported") return <CheckCircleIcon sx={{ color: GREEN, fontSize:18 }} />;
  if (status === "error")    return <WarningIcon     sx={{ color: RED,   fontSize:18 }} />;
  return                            <SkipNextIcon    sx={{ color: SILVER, fontSize:18 }} />;
};

const CurrencyTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const fmt = (n) => `$${(n/1000).toFixed(1)}k`;
  return (
    <Paper elevation={3} sx={{ p:1.5, minWidth:150 }}>
      <Typography variant="caption" sx={{ fontWeight:600, display:"block", mb:0.5 }}>{label}</Typography>
      {payload.map((p) => (
        <Box key={p.name} sx={{ display:"flex", justifyContent:"space-between", gap:2 }}>
          <Typography variant="caption" sx={{ color:p.color }}>{p.name}</Typography>
          <Typography variant="caption">{fmt(p.value)}</Typography>
        </Box>
      ))}
    </Paper>
  );
};

const WineSalesImport = () => (
  <Container maxWidth="lg">
    <Paper elevation={2} sx={{ p:4, mb:3 }}>
      <Box sx={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:2 }}>
        <Box>
          <Typography variant="h4" sx={{ color:NAVY, fontWeight:600 }}>Wine Sales ETL — Aloha POS Import</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt:1, maxWidth:600 }}>
            Automated nightly polling client that reads Aloha POS DBF exports from each restaurant,
            resolves location identity from Aloha.ini, and loads wine sales into per-location
            PostgreSQL databases on AWS RDS. Scheduled via Windows Task Scheduler, written in R.
          </Typography>
        </Box>
        <Box sx={{ display:"flex", gap:1, flexWrap:"wrap", alignItems:"flex-start" }}>
          {["R","PostgreSQL","Aloha POS","ETL","foreign","AWS RDS"].map((t) => (
            <Chip key={t} label={t} size="small" sx={{ bgcolor:NAVY, color:"#fff" }} />
          ))}
        </Box>
      </Box>
    </Paper>

    <Grid container spacing={2} sx={{ mb:3 }}>
      {[
        { label:"Locations Polled Nightly", value:"3"      },
        { label:"Avg Records / Night",      value:"~1,350" },
        { label:"Folders Checked",          value:"14 days" },
        { label:"Idempotency",              value:"By date + entity" },
      ].map(({ label, value }) => (
        <Grid item xs={6} md={3} key={label}>
          <Paper elevation={2} sx={{ p:3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
            <Typography variant="h5" sx={{ fontWeight:700, color:NAVY }}>{value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mb:3 }}>
      <Grid item xs={12} md={5}>
        <Paper elevation={2} sx={{ p:3 }}>
          <Typography variant="h6" sx={{ color:NAVY, mb:1 }}>Recent Import Log</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb:2 }}>
            Last 3 nights across all locations.
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight:700, color:NAVY, borderBottom:`2px solid ${NAVY}` } }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Records</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importLog.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell><Typography variant="caption">{row.date}</Typography></TableCell>
                    <TableCell><Typography variant="caption">{row.location}</Typography></TableCell>
                    <TableCell align="right">
                      <Typography variant="caption">{row.status === "error" ? "—" : row.records}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0.5 }}>
                        <StatusIcon status={row.status} />
                        <Typography variant="caption" sx={{ textTransform:"capitalize" }}>{row.status}</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper elevation={2} sx={{ p:3 }}>
          <Typography variant="h6" sx={{ color:NAVY, mb:2 }}>Wine Sales by Location — H2 2024</Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesByLocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis dataKey="month" tick={{ fontSize:11 }} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize:11 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              <Bar dataKey="brg"   name="Blue Ridge Grill" fill={NAVY}   radius={[2,2,0,0]} />
              <Bar dataKey="bones" name="Bones"            fill={BLUE}   radius={[2,2,0,0]} />
              <Bar dataKey="okc"   name="OK Cafe"          fill={SILVER} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>

    <Paper elevation={2} sx={{ p:3, mb:3 }}>
      <Typography variant="h6" sx={{ color:NAVY, mb:2 }}>BTG vs. Bottle Sales — H2 2024</Typography>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={salesMix}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
          <XAxis dataKey="month" tick={{ fontSize:11 }} />
          <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize:11 }} />
          <Tooltip content={<CurrencyTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="bottle" name="Bottle Sales" stroke={NAVY}  strokeWidth={2} dot={{ r:4 }} />
          <Line type="monotone" dataKey="btg"    name="Glass Sales"  stroke={BLUE}  strokeWidth={2} dot={{ r:4 }} strokeDasharray="5 3" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>

    <Paper elevation={2} sx={{ p:3 }}>
      <Typography variant="h6" sx={{ color:NAVY, mb:1 }}>ETL Architecture</Typography>
      <Divider sx={{ mb:2 }} />
      <Grid container spacing={2}>
        {[
          { n:"1", label:"Task Scheduler",    desc:"wineimport.bat runs nightly via Windows Task Scheduler on each restaurant's POS server." },
          { n:"2", label:"Folder Validation", desc:"folderIsValid() checks for Aloha.ini, GNDLINE.dbf presence, and minimum file size before processing." },
          { n:"3", label:"Location Lookup",   desc:"UNITNUMBER from Aloha.ini resolves to entity_id and wine_db_name via the entities table." },
          { n:"4", label:"Idempotent Load",   desc:"importExistsInDB() skips already-loaded dates. Production writes wrapped in dbWithTransaction." },
        ].map(({ n, label, desc }) => (
          <Grid item xs={12} sm={6} md={3} key={n}>
            <Box sx={{ display:"flex", gap:1.5 }}>
              <Box sx={{ width:28, height:28, borderRadius:"50%", bgcolor:NAVY, color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:13, fontWeight:700 }}>
                {n}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight:600 }}>{label}</Typography>
                <Typography variant="caption" color="text.secondary">{desc}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Container>
);

export default WineSalesImport;