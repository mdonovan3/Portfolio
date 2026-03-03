// pages/InventoryAnalysis.jsx
// Dependencies: recharts  (npm install recharts)

import { useState } from "react";
import {
  Container, Paper, Typography, Box, Grid, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";

const NAVY = "#2c3e50", SILVER = "#95a5a6", GREEN = "#27ae60", RED = "#e74c3c", BLUE = "#2980b9";
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const pct = (n) => `${(n * 100).toFixed(1)}%`;

const periods = [
  { date:"Jan",  begInv:312400, endInv:298750, purchases:41200,  sales:87600,  glass:22400, bottle:65200 },
  { date:"Feb",  begInv:298750, endInv:305100, purchases:58300,  sales:79800,  glass:19600, bottle:60200 },
  { date:"Mar",  begInv:305100, endInv:318200, purchases:62100,  sales:93400,  glass:24100, bottle:69300 },
  { date:"Apr",  begInv:318200, endInv:301600, purchases:44800,  sales:102300, glass:27800, bottle:74500 },
  { date:"May",  begInv:301600, endInv:294300, purchases:39600,  sales:98700,  glass:26300, bottle:72400 },
  { date:"Jun",  begInv:294300, endInv:308900, purchases:71400,  sales:104100, glass:29200, bottle:74900 },
  { date:"Jul",  begInv:308900, endInv:297100, purchases:38200,  sales:91600,  glass:23100, bottle:68500 },
  { date:"Aug",  begInv:297100, endInv:289400, purchases:42100,  sales:88200,  glass:21900, bottle:66300 },
  { date:"Sep",  begInv:289400, endInv:311700, purchases:76800,  sales:96400,  glass:25600, bottle:70800 },
  { date:"Oct",  begInv:311700, endInv:324100, purchases:68300,  sales:108900, glass:31200, bottle:77700 },
  { date:"Nov",  begInv:324100, endInv:298600, purchases:43100,  sales:121400, glass:38400, bottle:83000 },
  { date:"Dec",  begInv:298600, endInv:276200, purchases:31800,  sales:118600, glass:41200, bottle:77400 },
];

const variance = [
  { name:"Bones Cab 2020",        var:-2.5, ext:-148.75 },
  { name:"Veuve Clicquot MV",     var:-1.0, ext:-53.47  },
  { name:"Stags Leap Artemis CV", var:-1.5, ext:-94.50  },
  { name:"Duckhorn Napa Cab CV",  var:-1.0, ext:-68.00  },
  { name:"Bones Chardonnay",      var: 2.0, ext: 54.20  },
  { name:"Sancerre Thomas BTG",   var: 1.0, ext: 18.20  },
  { name:"Caymus Cab 2020",       var: 0.5, ext: 42.50  },
  { name:"Frank Family Napa Cab", var:-1.0, ext:-89.00  },
];

const categories = [
  { category:"Napa Cabernet", value:38 }, { category:"Burgundy",     value:14 },
  { category:"Champagne",     value:11 }, { category:"Bordeaux",      value:9  },
  { category:"Pinot Noir",    value:8  }, { category:"Italian Red",   value:7  },
  { category:"White BTG",     value:8  }, { category:"Other",         value:5  },
];

const StatCard = ({ label, value, sub, color = NAVY }) => (
  <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
    <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, color }}>{value}</Typography>
    {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
  </Paper>
);

const CurrencyTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={3} sx={{ p: 1.5, minWidth: 160 }}>
      <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>{label}</Typography>
      {payload.map((p) => (
        <Box key={p.name} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Typography variant="caption" sx={{ color: p.color }}>{p.name}</Typography>
          <Typography variant="caption">{fmt(p.value)}</Typography>
        </Box>
      ))}
    </Paper>
  );
};

const InventoryAnalysis = () => {
  const [mode, setMode] = useState("cos");
  const latest = periods[periods.length - 1];
  const cos    = latest.begInv - latest.endInv + latest.purchases;
  const costPct = cos / latest.sales;

  const chartData = periods.map((p) => ({
    date:     p.date,
    costPct:  Math.round(((p.begInv - p.endInv + p.purchases) / p.sales) * 1000) / 10,
    bottle:   p.bottle,
    glass:    p.glass,
    inventory: p.endInv,
  }));

  return (
    <Container maxWidth="lg">
      <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: NAVY, fontWeight: 600 }}>Wine Inventory Analysis</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt:1, maxWidth:600 }}>
              Period-over-period inventory dashboard. Tracks cost of sales, variance, purchases,
              and glass vs. bottle revenue. Built in R Shiny, backed by PostgreSQL on AWS RDS.
            </Typography>
          </Box>
          <Box sx={{ display:"flex", gap:1, flexWrap:"wrap", alignItems:"flex-start" }}>
            {["R","Shiny","PostgreSQL","shinydashboard","DT","RDS"].map((t) => (
              <Chip key={t} label={t} size="small" sx={{ bgcolor: NAVY, color:"#fff" }} />
            ))}
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label:"Beginning Inventory", value: fmt(latest.begInv) },
          { label:"Ending Inventory",    value: fmt(latest.endInv), sub: `Δ ${fmt(latest.endInv - latest.begInv)}` },
          { label:"Purchases",           value: fmt(latest.purchases) },
          { label:"Total Sales",         value: fmt(latest.sales) },
          { label:"Cost of Sales",       value: fmt(cos),     color: GREEN },
          { label:"Wine Cost %",         value: pct(costPct), color: costPct < 0.32 ? GREEN : RED, sub:"target < 32%" },
          { label:"Gross Profit",        value: fmt(latest.sales - cos), color: GREEN },
        ].map((s) => (
          <Grid item xs={6} sm={4} md={3} key={s.label}><StatCard {...s} /></Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"center", mb:2, flexWrap:"wrap", gap:1 }}>
          <Typography variant="h6" sx={{ color: NAVY }}>Period Trends — 2024</Typography>
          <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)} size="small">
            <ToggleButton value="cos"   sx={{ textTransform:"none", px:2 }}>Cost %</ToggleButton>
            <ToggleButton value="sales" sx={{ textTransform:"none", px:2 }}>Sales Mix</ToggleButton>
            <ToggleButton value="inv"   sx={{ textTransform:"none", px:2 }}>Inventory</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <ResponsiveContainer width="100%" height={280}>
          {mode === "cos" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis dataKey="date" tick={{ fontSize:11 }} />
              <YAxis unit="%" domain={[20,45]} tick={{ fontSize:11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <ReferenceLine y={32} stroke={RED} strokeDasharray="4 4"
                label={{ value:"32% target", fontSize:11, fill:RED, position:"insideTopRight" }} />
              <Line type="monotone" dataKey="costPct" name="Wine Cost %" stroke={NAVY} strokeWidth={2} dot={{ r:4 }} />
            </LineChart>
          ) : mode === "sales" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis dataKey="date" tick={{ fontSize:11 }} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize:11 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              <Bar dataKey="bottle" name="Bottle Sales" stackId="a" fill={NAVY} />
              <Bar dataKey="glass"  name="Glass Sales"  stackId="a" fill={SILVER} />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis dataKey="date" tick={{ fontSize:11 }} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize:11 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Line type="monotone" dataKey="inventory" name="Ending Inventory" stroke={BLUE} strokeWidth={2} dot={{ r:4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: NAVY, mb: 1 }}>Inventory Variance — Current Period</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Counted vs. theoretical on-hand. Sorted by dollar impact.
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { fontWeight:700, color:NAVY, borderBottom:`2px solid ${NAVY}` } }}>
                    <TableCell>Wine</TableCell>
                    <TableCell align="right">Var</TableCell>
                    <TableCell align="right">Ext ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...variance].sort((a,b) => a.ext - b.ext).map((row) => (
                    <TableRow key={row.name} hover>
                      <TableCell><Typography variant="caption">{row.name}</Typography></TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ color: row.var < 0 ? RED : GREEN, fontWeight:600 }}>
                          {row.var > 0 ? "+" : ""}{row.var}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ color: row.ext < 0 ? RED : GREEN, fontWeight:600 }}>
                          {row.ext < 0 ? `-$${Math.abs(row.ext).toFixed(2)}` : `$${row.ext.toFixed(2)}`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: NAVY, mb: 2 }}>Inventory by Category (%)</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categories} layout="vertical" margin={{ left:8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" horizontal={false} />
                <XAxis type="number" unit="%" tick={{ fontSize:11 }} domain={[0,45]} />
                <YAxis type="category" dataKey="category" tick={{ fontSize:11 }} width={115} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Bar dataKey="value" name="% of inventory" radius={[0,3,3,0]}>
                  {categories.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? NAVY : i % 2 === 0 ? BLUE : SILVER} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: NAVY, mb: 1 }}>How It Works</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[
            { n:"1", label:"POS Export",      desc:"Aloha DBF files read nightly by R ETL client on each restaurant's local machine." },
            { n:"2", label:"PostgreSQL (RDS)", desc:"Sales, inventory counts, purchases, and theoreticals stored in normalized schema on AWS RDS." },
            { n:"3", label:"Stored Function",  desc:"get_inventory_activity() and get_theoreticals() aggregate movement by SKU across the period." },
            { n:"4", label:"Shiny Dashboard",  desc:"R Shiny app queries RDS on date selection, renders value boxes, DT tables, and trend plots." },
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

export default InventoryAnalysis;