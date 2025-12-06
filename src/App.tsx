import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, CircularProgress } from "@mui/material";
import theme from "./theme";
import TabsLayout from "./layouts/TabLayout";
import { AlertProvider } from "./components/AlertSystem";
import ErrorSnackbar from "./components/ErrorSnackbar";
import { TelegramAuth } from "./components/TelegramAuth";
import { loginSuccess } from "./store/slices/authSlice";
import { RootState } from "./store";
import Error from "./components/Error";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Check if user is authenticated
  const isAuthenticated = user.id && user.id !== "";

  useEffect(() => {
    setLoading(false);
  }, []);

  // Handle Telegram authentication success
  const handleTelegramAuthSuccess = (token: string, profile: any) => {
    dispatch(loginSuccess({ token, profile }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <ErrorSnackbar />
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Navigate to="/summary" />} />
            <Route path="/*" element={<TabsLayout />} />
          </Routes>
        ) : (
          <TelegramAuth onAuthSuccess={handleTelegramAuthSuccess} />
        )}
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;