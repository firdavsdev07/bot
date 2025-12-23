import { FC, ReactNode } from "react";
import { Card, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { colors, shadows, borderRadius } from "../../theme/colors";
import { responsive } from "../../theme/responsive";

interface DashboardCardProps {
  title: string;
  total: string | number;
  icon: ReactNode;
  color?: "primary" | "success" | "error" | "info" | "warning";
  subtitle?: string;
}

const MotionCard = motion(Card);

const DashboardCardImproved: FC<DashboardCardProps> = ({
  title,
  total,
  icon,
  color = "primary",
  subtitle,
}) => {
  const validColors = ["primary", "success", "error", "info", "warning"] as const;
  type ValidColor = typeof validColors[number];
  const themeColor = colors[color as ValidColor];

  // Smart text truncation for mobile
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      sx={{
        p: responsive.spacing.card,
        borderRadius: borderRadius.lg,
        background: themeColor?.main || colors.primary.main,
        boxShadow: shadows.colored(themeColor?.shadow || colors.primary.shadow),
        color: "white",
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: 120, sm: 130, md: 140 }, // Responsive height
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: shadows.xl,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: { xs: -20, md: -30 },
          top: { xs: -20, md: -30 },
          width: { xs: 80, sm: 100, md: 120 },
          height: { xs: 80, sm: 100, md: 120 },
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, md: 1.5 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            p: { xs: 1, md: 1.5 },
            bgcolor: "rgba(255, 255, 255, 0.2)",
            borderRadius: borderRadius.md,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            "& svg": {
              fontSize: responsive.icon.medium,
            }
          }}
        >
          {icon}
        </Box>
        
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            opacity: 0.95,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            lineHeight: 1.2,
            // Smart truncation on mobile
            display: { xs: "block", sm: "block" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { xs: "100px", sm: "120px", md: "none" }
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ position: "relative", zIndex: 1, mt: { xs: 1, md: 2 } }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: 0.5,
            fontSize: responsive.typography.h4,
            lineHeight: 1.2,
            wordBreak: "break-word",
            display: "block",
          }}
        >
          {typeof total === "number" ? total.toLocaleString() : total}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              opacity: 0.85,
              fontSize: responsive.typography.caption,
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {window.innerWidth < 600 ? truncateText(subtitle, 15) : subtitle}
          </Typography>
        )}
      </Box>
    </MotionCard>
  );
};

export default DashboardCardImproved;