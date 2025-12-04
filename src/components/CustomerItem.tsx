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

  return (
    <MotionListItemButton
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(customer)}
      sx={{
        borderRadius: borderRadius.md,
        mb: 1.5,
        px: 2.5,
        py: 2,
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
      <Avatar
        sx={{
          mr: 2,
          width: 48,
          height: 48,
          bgcolor: showDebtBadge ? "error.main" : "primary.main",
          fontSize: "1.1rem",
          fontWeight: 700,
          boxShadow: shadows.sm,
        }}
      >
        {customer.firstName.charAt(0)}
      </Avatar>

      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Typography fontWeight={700} fontSize="1rem" color="text.primary">
              {customer.firstName} {customer.lastName}
            </Typography>
            {showDebtBadge && (
              <Chip
                icon={<AlertCircle size={14} />}
                label="QARZDOR"
                size="small"
                color="error"
                sx={{
                  height: 22,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  "& .MuiChip-icon": { ml: 0.5 },
                }}
              />
            )}
          </Box>
        }
        secondary={
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Phone size={14} color="#6B7280" />
              <Typography
                variant="body2"
                color="text.secondary"
                fontSize="0.875rem"
              >
                {customer.phoneNumber}
              </Typography>
            </Box>
            {showDebtBadge &&
              customer.delayDays !== undefined &&
              customer.delayDays > 0 && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Clock size={14} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: getDelayColor(customer.delayDays),
                      fontSize: "0.8rem",
                    }}
                  >
                    {customer.delayDays} kun kechikkan
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
