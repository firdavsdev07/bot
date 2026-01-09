// import { useEffect, useState } from "react";
// import { useAppDispatch } from "./hooks/useAppDispatch";
// import { loginSuccess } from "./store/slices/authSlice";
// import Loader from "./components/Loading";
// import Error from "./components/Error";

// import { Routes, Route, Navigate } from "react-router-dom";
// import TabsLayout from "./layouts/TabLayout";
// import { CssBaseline, ThemeProvider } from "@mui/material";
// import theme from "./theme";

// function App() {
//   const dispatch = useAppDispatch();
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initData = window.Telegram?.WebApp?.initData;
//     if (!initData) {
//       setError("initData mavjud emas");
//       setLoading(false);
//       return;
//     }

//     const apiUrl =
//       import.meta.env.VITE_API_URL || "http://localhost:3000/api/bot";
//     fetch(`${apiUrl}/auth/telegram`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ initData }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.token) {
//           dispatch(loginSuccess(data));
//         } else {
//           setError(data.error || "Noma'lum xatolik");
//         }
//       })
//       .catch(() => setError("Server xatolik"))
//       .finally(() => setLoading(false));
//   }, [dispatch]);

//   if (loading) return <Loader />;
//   if (error) return <Error />;

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Routes>
//         <Route path="/" element={<Navigate to="/summary" />} />
//         <Route path="/*" element={<TabsLayout />} />
//       </Routes>
//     </ThemeProvider>
//   );
// }

// export default App;



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
    console.log("🔍 Bot App.tsx - Authentication boshlandi");
    console.log("🌍 Current URL:", window.location.href);
    console.log("🔧 Environment:", import.meta.env.MODE);
    
    // Telegram WebApp'ni to'g'ri ishga tushirish
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      console.log("✅ Telegram WebApp ready() va expand() chaqirildi");
    }
    
    console.log("📱 Telegram WebApp mavjudmi:", !!window.Telegram?.WebApp);
    console.log("📱 Full WebApp object:", window.Telegram?.WebApp);
    
    let initData = window.Telegram?.WebApp?.initData;
    console.log("📝 initData:", initData);
    console.log("📏 initData length:", initData?.length);
    console.log("📦 initDataUnsafe:", window.Telegram?.WebApp?.initDataUnsafe);
    
    if (!initData || initData.length === 0) {
      console.log("❌ initData mavjud emas yoki bo'sh");
      console.log("🔍 Debug info:");
      console.log("  - window.Telegram:", window.Telegram);
      console.log("  - WebApp version:", (window.Telegram?.WebApp as any)?.version);
      console.log("  - Platform:", (window.Telegram?.WebApp as any)?.platform);
      
      setError("Iltimos, botni Telegram ichida oching");
      setLoading(false);
      return;
    }

    console.log("✅ initData mavjud, API'ga so'rov yuborilmoqda");
    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api/bot";
    console.log("🌐 API URL:", apiUrl);
    
    fetch(`${apiUrl}/auth/telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    })
      .then((res) => {
        console.log("📡 Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("📦 Response data:", data);
        if (data.token) {
          console.log("✅ Token qabul qilindi, login muvaffaqiyatli");
          dispatch(loginSuccess(data));
        } else {
          console.log("❌ Token yo'q, xato:", data.error);
          setError(data.error || "Noma'lum xatolik");
        }
      })
      .catch((err) => {
        console.log("❌ Fetch xatosi:", err);
        setError("Server xatolik");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

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
