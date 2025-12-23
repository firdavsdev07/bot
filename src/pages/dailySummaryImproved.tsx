import { Box, CardContent, Typography, Avatar } from "@mui/material";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../store";
import { getDashboard } from "../store/actions/dashboardActions";
import { DollarSign, Banknote, TrendingUp, User } from "lucide-react";
import DashboardCardImproved from "../components/DashboardCard/DashboardCardImproved";
import { responsive } from "../theme/responsive";

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

export default function DailySummaryImproved({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { dashboard } = useSelector((state: RootState) => state.dashboard);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getDashboard());
    }
  }, [activeTabIndex, index]);

  const todayDollar = dashboard?.today?.dollar ?? 0;
  const todaySum = dashboard?.today?.sum ?? 0;
  const todayCount = dashboard?.today?.count ?? 0;
  
  const balanceDollar = dashboard?.balance?.dollar ?? 0;
  const balanceSum = dashboard?.balance?.sum ?? 0;

  const getDisplayName = (fullName: string) => {
    if (fullName.length > 20) {
      const parts = fullName.split(' ');
      if (parts.length > 1) {
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
      }
    }
    return fullName;
  };

  return (
    <CardContent 
      sx={{ 
        padding: 0,
        maxWidth: "1400px",
        mx: "auto",
        px: responsive.spacing.container,
      }}
    >
      {/* User Greeting - Responsive */}
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 3, 
          gap: responsive.spacing.gap,
          p: responsive.spacing.card,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Avatar 
          sx={{ 
            width: responsive.avatar.large,
            height: responsive.avatar.large,
            bgcolor: "primary.main",
            fontSize: responsive.typography.h6,
            fontWeight: 700,
          }}
        >
          <User size={responsive.icon.medium.xs} />
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="text.primary"
            sx={{ 
              fontSize: responsive.typography.h6,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {getDisplayName(`${user.firstname} ${user.lastname}`.trim() || "Foydalanuvchi")}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: responsive.typography.body2,
              mt: 0.5,
            }}
          >
            Xush kelibsiz!
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",                    // Mobile: 1 ustun
            sm: "1fr",                    // Small tablet: 1 ustun
            md: "repeat(2, 1fr)",         // Medium tablet: 2 ustun
            lg: "repeat(3, 1fr)",         // Large desktop: 3 ustun
            xl: "repeat(auto-fit, minmax(300px, 1fr))", // XL: auto-fit
          },
          gap: responsive.spacing.gap,
          mb: 3,
        }}
      >
        {/* Today's Payments Dollar */}
        <DashboardCardImproved
          title="Bugungi to'lovlar ($)"
          total={`${todayDollar} $`}
          subtitle={`${todayCount} ta to'lov`}
          icon={<DollarSign size={responsive.icon.medium.xs} />}
          color="primary"
        />

        {/* Today's Payments UZS */}
        <DashboardCardImproved
          title="Bugungi to'lovlar (So'm)"
          total={`${todaySum.toLocaleString()} UZS`}
          subtitle={`${todayCount} ta to'lov`}
          icon={<Banknote size={responsive.icon.medium.xs} />}
          color="info"
        />

        {/* Balance */}
        <DashboardCardImproved
          title="Mening balansim"
          total={`${balanceDollar} $`}
          subtitle={`${balanceSum.toLocaleString()} UZS`}
          icon={<TrendingUp size={responsive.icon.medium.xs} />}
          color="success"
        />
      </Box>

      {/* Quick Stats - Mobile optimized */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",  // Mobile: 2 ustun
            sm: "repeat(4, 1fr)",  // Tablet: 4 ustun
          },
          gap: 1,
          mt: 2,
        }}
      >
        {[
          { label: "To'lovlar", value: todayCount },
          { label: "Dollar", value: `$${todayDollar}` },
          { label: "So'm", value: todaySum > 1000 ? `${Math.round(todaySum/1000)}K` : todaySum },
          { label: "Balans", value: `$${balanceDollar}` },
        ].map((stat, idx) => (
          <Box
            key={idx}
            sx={{
              p: { xs: 1.5, sm: 2 },
              bgcolor: "background.paper",
              borderRadius: 2,
              textAlign: "center",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ 
                fontSize: responsive.typography.caption,
                mb: 0.5,
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ 
                fontSize: responsive.typography.body1,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </CardContent>
  );
}