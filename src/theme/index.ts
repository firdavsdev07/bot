import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#667eea", // Modern purple
      light: "#8b9bff",
      dark: "#4c63d2",
    },
    secondary: {
      main: "#f093fb", // Pink accent
      light: "#f5576c",
      dark: "#d87aed",
    },
    success: {
      main: "#11998e", // Teal green
      light: "#38ef7d",
      dark: "#0d7a72",
      // @ts-ignore - Custom MUI colors
      lighter: "#e8f5f4",
    },
    error: {
      main: "#eb3349", // Modern red
      light: "#f45c43",
      dark: "#c42a3d",
      // @ts-ignore - Custom MUI colors
      lighter: "#fdeaee",
    },
    info: {
      main: "#4facfe", // Sky blue
      light: "#00f2fe",
      dark: "#3d8bd4",
      // @ts-ignore - Custom MUI colors
      lighter: "#e3f2fd",
    },
    background: {
      default: "#fafbfc", // Subtle gray
      paper: "#ffffff", // Pure white
    },
    text: {
      primary: "#1F2937", // Dark gray
      secondary: "#6B7280", // Medium gray
    },
    divider: "#E5E7EB", // Light gray
  },

  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    h1: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.75rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
    },
    body1: {
      fontWeight: 500,
      fontSize: "0.95rem",
    },
    body2: {
      fontWeight: 400,
      fontSize: "0.875rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F9FAFB",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "none",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          borderRadius: 12,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#1F2937",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#fff",
          paddingLeft: "12px",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#E5E7EB",
        },
      },
    },
  },
});

export default theme;
