// pages/R365Transactions.jsx
// Dependencies: recharts

import { useState } from "react";
import {
  Container, Paper, Typography, Box, Grid, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";

const NAVY = "#2c3e50", SILVER = "#95a5a6", GREEN = "#27ae60", RED = "#e74c3c", BLUE = "#2980b9";
const fmt = (n) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);

const glSummary = [
  { account:"51200 - Wine Purchases",    debit:42850, credit:3200,  net:39650,  type:"COGS"     },
  { account:"51100 - Food Purchases",    debit:88400, credit:4100,  net:84300,  type:"COGS"     },
  { account:"50200 - Wine Sales",        debit:1200,  credit:98700, net:-97500, type:"Revenue"  },
  { account:"50100 - Food Sales",        debit:800,   credit:224000,net:-223200,type:"Revenue"  },
  { account:"15210 - Wine Inventory",    debit:39650, credit:41200, net:1550,   type:"Asset"    },
  { account:"61000 - Labor",             debit:64200, credit:0,     net:64200,  type:"Expense"  },
  { account:"70000 - Occupancy",         debit:18400, credit:0,     net:18400,  type:"Expense"  },
  { account:"20100 - AP",                debit:41200, credit:43800, net:-2600,  type:"Liability"},
];

const txTypes = [
  { name:"AP Invoice",       value:148, fill: NAVY   },
  { name:"AP Credit Memo",   value:23,  fill: SILVER },
  { name:"Journal Entry",    value:67,  fill: BLUE   },
  { name:"Budget",           value:12,  fill:"#bdc3c7"},
  { name:"Manual Check",     value:9,   fill: RED    },
];

const monthlySpend = [
  { month:"Jan", wine:38400, food:81200, labor:61800 },
  { month:"Feb", wine:42100, food:76400, labor:59200 },
  { month:"Mar", wine:44800, food:88300, labor:63400 },
  { month:"Apr", wine:39200, food:92100, labor:66800 },
  { month:"May", wine:41600, food:87600, labor:64100 },
  { month:"Jun", wine:48300, food:94200, labor:68900 },
  { month:"Jul", wine:36700, food:79800, labor:61200 },
  { month:"Aug", wine:38900, food:82400, labor:62800 },
  { month:"Sep", wine:43200, food:89100, labor:65400 },
  { month:"Oct", wine:46800, food:96300, labor:71200 },
  { month:"Nov", wine:39400, food:88700, labor:67800 },
  { month:"Dec", wine:35100, food:84200, labor:64300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
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

const R365Transactions = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p:4, mb:3 }}>
        <Box sx={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:2 }}>
          <Box>
            <Typography variant="h4" sx={{ color:NAVY, fontWeight:600 }}>R365 GL Transaction Import</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt:1, maxWidth:600 }}>
              Automated import of Restaurant365 general ledger transactions via OData API.
              Pulls AP invoices, credit memos, journal entries, and budget records into
              PostgreSQL for cross-system reporting. Written in R with httr2.
            </Typography>
          </Box>
          <Box sx={{ display:"flex", gap:1, flexWrap:"wrap", alignItems:"flex-start" }}>
            {["R","httr2","OData","PostgreSQL","tidyverse","AWS RDS"].map((t) => (
              <Chip key={t} label={t} size="small" sx={{ bgcolor:NAVY, color:"#fff" }} />
            ))}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3} sx={{ mb:3 }}>
        {[
          { label:"Transactions Imported (YTD)", value:"4,821" },
          { label:"Locations",                   value:"3"    },
          { label:"GL Accounts Tracked",         value:"47"   },
          { label:"Date Range",                  value:"Jan – Dec 2024" },
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
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p:3 }}>
            <Typography variant="h6" sx={{ color:NAVY, mb:2 }}>Monthly Spend by GL Parent — 2024</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
                <XAxis dataKey="month" tick={{ fontSize:11 }} />
                <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize:11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="wine"  name="Wine (51200)"  fill={NAVY}   radius={[2,2,0,0]} />
                <Bar dataKey="food"  name="Food (51100)"  fill={SILVER} radius={[2,2,0,0]} />
                <Bar dataKey="labor" name="Labor (61000)" fill={BLUE}   radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p:3 }}>
            <Typography variant="h6" sx={{ color:NAVY, mb:2 }}>Transaction Types</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={txTypes} cx="50%" cy="45%"
                  innerRadius={55} outerRadius={90}
                  dataKey="value" nameKey="name"
                  onMouseEnter={(_, i) => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {txTypes.map((entry, i) => (
                    <Cell key={i} fill={entry.fill}
                      opacity={hovered === null || hovered === i ? 1 : 0.5}
                      stroke={hovered === i ? "#fff" : "none"} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend iconSize={10} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p:3, mb:3 }}>
        <Typography variant="h6" sx={{ color:NAVY, mb:1 }}>GL Account Summary — Current Period</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb:2 }}>
          Aggregated debit/credit by account. Net = Debit − Credit. Revenue accounts show negative net (credit-normal).
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight:700, color:NAVY, borderBottom:`2px solid ${NAVY}` } }}>
                <TableCell>Account</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Debit</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="right">Net</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {glSummary.map((row) => (
                <TableRow key={row.account} hover>
                  <TableCell><Typography variant="caption">{row.account}</Typography></TableCell>
                  <TableCell>
                    <Chip label={row.type} size="small" variant="outlined"
                      sx={{ fontSize:10, height:18,
                        borderColor: row.type === "Revenue" ? GREEN : row.type === "COGS" ? RED : NAVY,
                        color:       row.type === "Revenue" ? GREEN : row.type === "COGS" ? RED : NAVY,
                      }} />
                  </TableCell>
                  <TableCell align="right"><Typography variant="caption">{fmt(row.debit)}</Typography></TableCell>
                  <TableCell align="right"><Typography variant="caption">{fmt(row.credit)}</Typography></TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" sx={{ fontWeight:600, color: row.net < 0 ? GREEN : row.net > 50000 ? RED : "text.primary" }}>
                      {fmt(Math.abs(row.net))}{row.net < 0 ? " CR" : ""}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={2} sx={{ p:3 }}>
        <Typography variant="h6" sx={{ color:NAVY, mb:1 }}>Pipeline Architecture</Typography>
        <Divider sx={{ mb:2 }} />
        <Grid container spacing={2}>
          {[
            { n:"1", label:"R365 OData API",    desc:"httr2 authenticates with Basic auth, fetches paginated Transaction and TransactionDetail endpoints." },
            { n:"2", label:"Pagination Loop",   desc:"getDFFromEndpoint() reads @odata.count and loops $skip until all pages are fetched into a single data frame." },
            { n:"3", label:"GL Enrichment",     desc:"TransactionDetail joined to GlAccount for account name, number, and type. Parent account derived by substring." },
            { n:"4", label:"PostgreSQL Insert", desc:"Renamed columns appended to r365_transactions via dbAppendTable inside a dbWithTransaction block." },
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
};

export default R365Transactions;