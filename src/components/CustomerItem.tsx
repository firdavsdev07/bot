import { memo } from "react";
import {
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Phone, Clock, AlertCircle } from "lucide-react";
import { ICustomer } from "../types/ICustomer";
import { borderRadius, shadows } from "../theme/colors";
import { responsive } from "../theme/responsive";

interface CustomerListItemProps {
  customer: ICustomer;
  onClick: (customer: ICustomer) => void;
  showDebtBadge?: boolean;
}

const MotionListItemButton = motion(ListItemButton);

const CustomerListItem: React.FC<CustomerListItemProps> = memo(({
  customer,
  onClick,
  showDebtBadge = false,
}) => {
  const getDelayColor = (days: number) => {
    if (days > 30) return "error.main";
    if (days > 7) return "warning.main";
    return "success.main";
  };

  // Smart name truncation
  const getDisplayName = (fullName: string) => {
    if (fullName.length > 20) {
      const parts = fullName.split(' ');
      if (parts.length > 1) {
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
      }
    }
    return fullName;
  };

  // Format phone number for mobile
  const formatPhone = (phone: string) => {
    if (phone.length > 13) {
      return `${phone.slice(0, 13)}...`;
    }
    return phone;
  };

  return (
    <MotionListItemButton
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => onClick(customer)}
      sx={{
        borderRadius: borderRadius.md,
        mb: 1.5,
        px: responsive.spacing.container,
        py: { xs: 1.5, sm: 2 },
        bgcolor: "background.paper",
        border: showDebtBadge ? "2px solid" : "1px solid",
        borderColor: showDebtBadge ? "error.main" : "divider",
        boxShadow: shadows.sm,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: "background.paper",
          borderColor: showDebtBadge ? "error.dark" : "primary.main",
          boxShadow: shadows.md,
        },
      }}
    >
      {/* Avatar - responsive sizing */}
      <Avatar
        sx={{
          mr: responsive.spacing.gap,
          width: responsive.avatar.medium.xs,
          height: responsive.avatar.medium.xs,
          bgcolor: showDebtBadge ? "error.main" : "primary.main",
          fontSize: responsive.typography.body1.xs,
          fontWeight: 700,
          boxShadow: shadows.sm,
        }}
      >
        {customer.fullName.charAt(0)}
      </Avatar>

      <ListItemText
        primary={
          <Box 
            display="flex" 
            alignItems="center" 
            gap={1} 
            mb={0.5}
            sx={{ 
              flexWrap: { xs: "wrap", sm: "nowrap" }, // Wrap on mobile
              minHeight: { xs: 24, sm: "auto" }
            }}
          >
            {/* Name - responsive */}
            <Typography 
              fontWeight={700} 
              color="text.primary"
              sx={{
                fontSize: responsive.typography.body1,
                lineHeight: 1.3,
                flex: 1,
                minWidth: { xs: "120px", sm: "auto" }
              }}
            >
              {getDisplayName(customer.fullName)}
            </Typography>
            
            {/* Debt badge - responsive */}
            {showDebtBadge && (
              <Chip
                icon={<AlertCircle size={responsive.icon.small.xs} />}
                label="QARZDOR"
                size="small"
                color="error"
                sx={{
                  height: { xs: 20, sm: 22 },
                  fontSize: responsive.typography.caption,
                  fontWeight: 700,
                  "& .MuiChip-icon": { 
                    ml: 0.5,
                    width: responsive.icon.small.xs,
                    height: responsive.icon.small.xs,
                  },
                  "& .MuiChip-label": {
                    px: { xs: 0.5, sm: 1 }
                  }
                }}
              />
            )}
          </Box>
        }
        secondary={
          <Box display="flex" flexDirection="column" gap={0.5}>
            {/* Phone number */}
            <Box display="flex" alignItems="center" gap={0.5}>
              <Phone size={responsive.icon.small.xs} color="#6B7280" />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: responsive.typography.body2,
                  lineHeight: 1.3,
                }}
              >
                {formatPhone(customer.phoneNumber)}
              </Typography>
            </Box>
            
            {/* Delay info */}
            {showDebtBadge &&
              customer.delayDays !== undefined &&
              customer.delayDays > 0 && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Clock size={responsive.icon.small.xs} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: getDelayColor(customer.delayDays),
                      fontSize: responsive.typography.caption,
                      lineHeight: 1.3,
                    }}
                  >
                    {customer.delayDays > 99 ? "99+" : customer.delayDays} kun kechikkan
                  </Typography>
                </Box>
              )}
          </Box>
        }
      />
    </MotionListItemButton>
  );
});

CustomerListItem.displayName = 'CustomerListItem';

export default CustomerListItem;
