import { useEffect, useState } from "react";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { loginSuccess } from "./store/slices/authSlice";
import Loader from "./components/Loading";
import Error from "./components/Error";

import { Routes, Route, Navigate } from "react-router-dom";
import TabsLayout from "./layouts/TabLayout";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setError("initData mavjud emas");
      setLoading(false);
      return;
    }

    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api/bot";
    fetch(`${apiUrl}/auth/telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          dispatch(loginSuccess(data));
        } else {
          setError(data.error || "Noma'lum xatolik");
        }
      })
      .catch(() => setError("Server xatolik"))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/summary" />} />
        <Route path="/*" element={<TabsLayout />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
