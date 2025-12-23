import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Professional blue
      light: "#60a5fa",
      dark: "#1e40af",
    },
    secondary: {
      main: "#f59e0b", // Professional orange
      light: "#fbbf24",
      dark: "#d97706",
    },
    success: {
      main: "#10b981", // Professional green
      light: "#34d399",
      dark: "#059669",
      // @ts-ignore - Custom MUI colors
      lighter: "#d1fae5",
    },
    error: {
      main: "#ef4444", // Professional red
      light: "#f87171",
      dark: "#dc2626",
      // @ts-ignore - Custom MUI colors
      lighter: "#fee2e2",
    },
    info: {
      main: "#0ea5e9", // Professional cyan
      light: "#38bdf8",
      dark: "#0284c7",
      // @ts-ignore - Custom MUI colors
      lighter: "#e0f2fe",
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
    borderRadius: 6,
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
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          borderRadius: 8,
          transition: "all 0.2s ease",
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
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 6,
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
