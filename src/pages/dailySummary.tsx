import { Box, CardContent, Stack, Typography } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store";
import { getDashboard } from "../store/actions/dashboardActions";

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

export default function DailyReport({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { dashboard } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getDashboard());
    }
  }, [activeTabIndex, dispatch, index]);

  return (
    <CardContent sx={{ padding: 0 }}>
      <Typography variant="h5" align="center" gutterBottom color="#1F2937">
        {user.firstname} {user.lastname}
      </Typography>

      <Stack spacing={2} mt={3}>
        <Box
          sx={{
            bgcolor: "#f0f4ff",
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
            border: "1px solid #e0e0e0",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Dollar:
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            // color={color || "primary.main"}
          >
            {dashboard.dollar.toLocaleString()} $
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#f0f4ff",
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
            border: "1px solid #e0e0e0",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Sum:
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            // color={color || "primary.main"}
          >
            {dashboard.sum.toLocaleString()} $
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  );
}
