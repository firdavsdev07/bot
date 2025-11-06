import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0D47A1", // Kobalt ko‘k — professional
    },
    secondary: {
      main: "#FFC107", // Oltin sariq — aksent uchun
    },
    success: {
      main: "#2E7D32", // Yashil — ijobiy
    },
    error: {
      main: "#D32F2F", // Qizil — xatoliklar
    },
    info: {
      main: "#0288D1", // Moviy — axborot
    },
    background: {
      default: "#F9FAFB", // Sahifa orqa foni
      paper: "#FFFFFF", // Kartalar uchun fon
    },
    text: {
      primary: "#1F2937", // Asosiy matn — qora
      secondary: "#6B7280", // Ikkinchi matn — kulrang
    },
    divider: "#E5E7EB", // Yengil chiziq
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
    borderRadius: 16,
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
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
          borderRadius: 16,
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
