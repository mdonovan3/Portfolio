import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import InventoryInfrastructure from "./pages/InventoryInfrastructure";
import ShinyApps from "./pages/ShinyApps";
import GistsSql from "./pages/GistsSql";
import GistsR from "./pages/GistsR";
import GistsNode from "./pages/GistsNode";
import Repositories from "./pages/Repositories";
import InventoryAnalysis from "./pages/InventoryAnalysis";
import R365Transactions from "./pages/R365Transactions";
import WineSalesImport from "./pages/WineSalesImport";
import WlmReact from "./pages/WlmReact";
import DataArchitecture from "./pages/DataArchitecture";
import DEPipeline from "./pages/DEPipeline";
import AIProfile from "./pages/AIProfile";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="resume" element={<Resume />} />
            <Route
              path="projects/inventory-infrastructure"
              element={<InventoryInfrastructure />}
            />
            <Route path="projects/shiny-apps" element={<ShinyApps />} />
            <Route path="projects/gists/sql" element={<GistsSql />} />
            <Route path="projects/gists/r" element={<GistsR />} />
            <Route path="projects/gists/node" element={<GistsNode />} />
            <Route path="projects/repositories" element={<Repositories />} />
            <Route path="projects/inventory-analysis" element={<InventoryAnalysis />} />
            <Route path="projects/r365-transactions" element={<R365Transactions />} />
            <Route path="projects/wine-sales-import" element={<WineSalesImport />} />
            <Route path="projects/wlm-react" element={<WlmReact />} />
            <Route path="projects/data-architecture" element={<DataArchitecture />} />
            <Route path="projects/de-pipeline" element={<DEPipeline />} />
            <Route path="ai-profile" element={<AIProfile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
