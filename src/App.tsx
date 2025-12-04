import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider, CircularProgress } from "@mui/material";
import theme from "./theme";
import TabsLayout from "./layouts/TabLayout";
import { AlertProvider } from "./components/AlertSystem";
import ErrorSnackbar from "./components/ErrorSnackbar";
import { TelegramAuth } from "./components/TelegramAuth";
import { loginSuccess } from "./store/slices/authSlice";
import Error from "./components/Error";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    console.log('🚀 [APP] Faqat Telegram orqali kirish mumkin');
    console.log('🔧 [APP] Environment:', {
      mode: import.meta.env.MODE,
      nodeEnv: import.meta.env.VITE_NODE_ENV,
      isProd: import.meta.env.PROD,
    });
    setLoading(false);
  }, []);

  // 🚀 Handle Telegram authentication success
  const handleTelegramAuthSuccess = (token: string, profile: any) => {
    console.log('✅ [APP] Telegram authentication successful');
    dispatch(loginSuccess({ token, profile }));
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return <Error message={error} />;
  }

  // 🚀 Show Telegram auth screen
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <TelegramAuth onAuthSuccess={handleTelegramAuthSuccess} />
        <ErrorSnackbar />
        <Routes>
          <Route path="/" element={<Navigate to="/summary" />} />
          <Route path="/*" element={<TabsLayout />} />
        </Routes>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;