import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  CssBaseline,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft,
  Home,
  Description,
  Work,
  ExpandLess,
  ExpandMore,
  Apps,
  Code,
  GitHub,
} from '@mui/icons-material';

const drawerWidth = 280;

const Layout = () => {
  const [open, setOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [gistsOpen, setGistsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#2c3e50',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Martin Donovan - Data Analyst Portfolio
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            <ListItemButton
              onClick={() => handleNavigation('/')}
              selected={isActive('/')}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <Home />
              </ListItemIcon>
              {open && <ListItemText primary="Home" />}
            </ListItemButton>

            <ListItemButton
              onClick={() => handleNavigation('/resume')}
              selected={isActive('/resume')}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <Description />
              </ListItemIcon>
              {open && <ListItemText primary="Resume" />}
            </ListItemButton>

            <ListItemButton
              onClick={() => setProjectsOpen(!projectsOpen)}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <Work />
              </ListItemIcon>
              {open && (
                <>
                  <ListItemText primary="Projects" />
                  {projectsOpen ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>

            {open && (
              <Collapse in={projectsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => handleNavigation('/projects/shiny-apps')}
                    selected={isActive('/projects/shiny-apps')}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                      <Apps />
                    </ListItemIcon>
                    <ListItemText primary="R Shiny Apps" />
                  </ListItemButton>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => setGistsOpen(!gistsOpen)}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                      <Code />
                    </ListItemIcon>
                    <ListItemText primary="GitHub Gists" />
                    {gistsOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>

                  <Collapse in={gistsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton
                        sx={{ pl: 8 }}
                        onClick={() => handleNavigation('/projects/gists/sql')}
                        selected={isActive('/projects/gists/sql')}
                      >
                        <ListItemText primary="SQL" />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ pl: 8 }}
                        onClick={() => handleNavigation('/projects/gists/r')}
                        selected={isActive('/projects/gists/r')}
                      >
                        <ListItemText primary="R" />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ pl: 8 }}
                        onClick={() => handleNavigation('/projects/gists/node')}
                        selected={isActive('/projects/gists/node')}
                      >
                        <ListItemText primary="Node.js" />
                      </ListItemButton>
                    </List>
                  </Collapse>

                  <ListItemButton
                    sx={{ pl: 4 }}
                    onClick={() => handleNavigation('/projects/repositories')}
                    selected={isActive('/projects/repositories')}
                  >
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                      <GitHub />
                    </ListItemIcon>
                    <ListItemText primary="GitHub Repos" />
                  </ListItemButton>
                </List>
              </Collapse>
            )}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#ecf0f1',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
