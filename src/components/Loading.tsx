import { Box, CircularProgress } from "@mui/material";

const Loader = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flex="1 1 auto"
    height="100vh"
  >
    <CircularProgress size="25vw" />
  </Box>
);

export default Loader;
