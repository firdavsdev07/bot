import { Box, Typography } from "@mui/material";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { BiSolidErrorCircle } from "react-icons/bi";

const Error = () => {
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
      {/* <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} /> */}
      <BiSolidErrorCircle color="red" size={80} />
      <Typography variant="h4" color="error" gutterBottom mt={2}>
        Ruxsat yo‘q
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth="320px">
        Sizda ushbu bo‘limga kirish uchun yetarli huquq yo‘q. Agar bu xatolik
        deb hisoblasangiz, iltimos, administrator bilan bog‘laning.
      </Typography>
    </Box>
  );
};

export default Error;
