import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c3e50',
      light: '#34495e',
      dark: '#1a252f',
    },
    secondary: {
      main: '#95a5a6',
      light: '#bdc3c7',
      dark: '#7f8c8d',
    },
    background: {
      default: '#ecf0f1',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2c3e50',
          color: '#ffffff',
        },
      },
    },
  },
});

export default theme;
