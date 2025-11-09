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
            p: 2.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
            border: "1px solid #90caf9",
            boxShadow: "0px 4px 15px rgba(33,150,243,0.2)",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="medium"
          >
            💵 Bugungi to'lovlar (Dollar)
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary.main"
            mt={0.5}
          >
            {dashboard.dollar.toLocaleString()} $
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "#f0f4ff",
            p: 2.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #f3e5f5, #ffffff)",
            border: "1px solid #ce93d8",
            boxShadow: "0px 4px 15px rgba(156,39,176,0.2)",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="medium"
          >
            💰 Bugungi to'lovlar (So'm)
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="secondary.main"
            mt={0.5}
          >
            {dashboard.sum.toLocaleString()} so'm
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "#e8f5e9",
            p: 2.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #e8f5e9, #ffffff)",
            border: "1px solid #81c784",
            boxShadow: "0px 4px 15px rgba(76,175,80,0.2)",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="medium"
          >
            ✅ Bugungi natija
          </Typography>
          <Typography
            variant="body2"
            color="success.main"
            mt={1}
            fontWeight="bold"
          >
            Jami: {(dashboard.dollar + dashboard.sum / 12500).toFixed(2)} $
            ekvivalent
          </Typography>
          {/* <Typography variant="caption" color="text.secondary" mt={0.5}> */}
          {/* (Kurs: 1$ = 12,500 so'm) */}
          {/* </Typography> */}
        </Box>
      </Stack>
    </CardContent>
  );
}
