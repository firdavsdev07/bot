import { Box, CardContent, Typography, Avatar } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store";
import { getDashboard } from "../store/actions/dashboardActions";
import { DollarSign, Banknote, TrendingUp, User } from "lucide-react";
import DashboardCard from "../components/DashboardCard/DashboardCard";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabIndex, index]);

  const todayDollar = dashboard?.today?.dollar ?? 0;
  const todaySum = dashboard?.today?.sum ?? 0;
  const todayCount = dashboard?.today?.count ?? 0;
  
  const balanceDollar = dashboard?.balance?.dollar ?? 0;
  const balanceSum = dashboard?.balance?.sum ?? 0;

  return (
    <CardContent 
      sx={{ 
        padding: 0,
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 3, 
          gap: 2,
        }}
      >
        <Avatar 
          sx={{ 
            width: { xs: 48, md: 56 }, 
            height: { xs: 48, md: 56 }, 
            bgcolor: "primary.main" 
          }}
        >
          <User size={24} />
        </Avatar>
        <Box>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="text.primary"
            sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" } }}
          >
            {user.firstname} {user.lastname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xush kelibsiz!
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",           // Mobile: 1 kolon
            sm: "1fr",           // Small: 1 kolon
            md: "repeat(2, 1fr)", // Tablet: 2 kolon
            lg: "repeat(3, 1fr)", // Desktop: 3 kolon
          },
          gap: 2,
        }}
      >
        <DashboardCard
            title="Bugungi to'lovlar (Dollar)"
            total={`${todayDollar} $`}
            subtitle={`${todayCount} ta to'lov`}
            icon={<DollarSign size={24} />}
            color="primary"
        />

        <DashboardCard
            title="Bugungi to'lovlar (So'm)"
            total={`${todaySum.toLocaleString()} UZS`}
            subtitle={`${todayCount} ta to'lov`}
            icon={<Banknote size={24} />}
            color="info"
        />

        <DashboardCard
            title="Mening balansim"
            total={`${balanceDollar} $`}
            subtitle={`${balanceSum.toLocaleString()} UZS`}
            icon={<TrendingUp size={24} />}
            color="success"
        />
      </Box>
    </CardContent>
  );
}
