import { Box, IconButton } from "@mui/material";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box py={3} px={1} position="relative" pt={6}>
      <Box
        sx={{
          position: "fixed",
          bgcolor: "Background",
          width: "100%",
          zIndex: 500,
          top: 0,
          p: 2,
        }}
      >
        <IconButton aria-label="delete" size="medium">
          {" "}
          <Link to="/">
            <IoMdArrowBack />
          </Link>
        </IconButton>
      </Box>

      {children}
    </Box>
  );
};

export default DashboardLayout;
