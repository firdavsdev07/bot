import { Box, LinearProgress } from "@mui/material";

const Loader = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flex="1 1 auto"
    height="100%"
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
      }}
    />
  </Box>
);

export default Loader;
