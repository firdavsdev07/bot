// import { Box, Typography } from "@mui/material";
// // import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import { BiSolidErrorCircle } from "react-icons/bi";

// const Error = () => {
//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       height="100vh"
//       bgcolor="#fef2f2"
//       textAlign="center"
//       p={4}
//     >
//       {/* <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} /> */}
//       <BiSolidErrorCircle color="red" size={80} />
//       <Typography variant="h4" color="error" gutterBottom mt={2}>
//         Ruxsat yo‘q
//       </Typography>
//       <Typography variant="body1" color="text.secondary" maxWidth="320px">
//         Sizda ushbu bo‘limga kirish uchun yetarli huquq yo‘q. Agar bu xatolik
//         deb hisoblasangiz, iltimos, administrator bilan bog‘laning.
//       </Typography>
//     </Box>
//   );
// };

// export default Error;


import { Box, Typography } from "@mui/material";
import { BiSolidErrorCircle } from "react-icons/bi";

interface ErrorProps {
  message?: string;
}

const Error = ({ message }: ErrorProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#fef2f2"
      textAlign="center"
      p={4}
    >
      <BiSolidErrorCircle color="red" size={80} />
      <Typography variant="h4" color="error" gutterBottom mt={2}>
        {message || "Ruxsat yo'q"}
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth="400px">
        {message === "Iltimos, botni Telegram ichida oching" 
          ? "Bu Web App faqat Telegram bot orqali ochilishi kerak. Telegram'da botga /start yuboring va tugmani bosing."
          : message?.includes("Desktop Telegram")
          ? "Desktop Telegram'da WebView muammosi. Iltimos, mobil Telegram'dan foydalaning yoki botdan 'Brauzerda ochish' tugmasini bosing."
          : "Sizda ushbu bo'limga kirish uchun yetarli huquq yo'q. Agar bu xatolik deb hisoblasangiz, iltimos, administrator bilan bog'laning."}
      </Typography>
      
      {/* Debug info */}
      {import.meta.env.DEV && (
        <Box mt={3} p={2} bgcolor="white" borderRadius={2} maxWidth="400px">
          <Typography variant="caption" color="text.secondary" component="pre" textAlign="left">
            {JSON.stringify({
              initData: window.Telegram?.WebApp?.initData?.substring(0, 50) + "...",
              initDataLength: window.Telegram?.WebApp?.initData?.length || 0,
              hasWebApp: !!window.Telegram?.WebApp,
              error: message
            }, null, 2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Error;
