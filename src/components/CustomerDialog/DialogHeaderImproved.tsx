import { Avatar, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { ICustomer } from "../../types/ICustomer";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCustomerDetails } from "../../store/slices/customerSlice";
import SmartButton from "../SmartButton/SmartButton";
import { responsive } from "../../theme/responsive";

interface IProps {
  customer: ICustomer;
  onClose: () => void;
}

const DialogHeaderImproved: FC<IProps> = ({
  customer,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    onClose();
    dispatch(setCustomerDetails(null));
  };

  // Smart name display for mobile
  const getDisplayName = (fullName: string) => {
    if (isMobile && fullName.length > 15) {
      const parts = fullName.split(' ');
      if (parts.length > 1) {
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
      }
    }
    return fullName;
  };

  // Smart phone display
  const getDisplayPhone = (phone: string) => {
    if (isMobile && phone.length > 13) {
      return `${phone.slice(0, 13)}...`;
    }
    return phone;
  };

  return (
    <Box 
      display="flex" 
      alignItems="center" 
      gap={responsive.spacing.gap} 
      mb={3}
      sx={{
        position: "sticky",
        top: 0,
        bgcolor: "background.default",
        zIndex: 10,
        py: 2,
        mx: -2,
        px: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Back button - always icon on mobile */}
      <SmartButton
        variant="text"
        onClick={handleClose}
        icon={<ArrowLeft size={responsive.icon.medium.xs} />}
        tooltipText="Orqaga"
        iconOnly={isMobile}
        size="medium"
      >
        {!isMobile ? "Orqaga" : ""}
      </SmartButton>

      {/* Customer info - responsive layout */}
      <Box 
        width="100%" 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        sx={{ minWidth: 0 }} // Allow text truncation
      >
        {/* Avatar and info */}
        <Box display="flex" alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
          <Avatar
            sx={{
              width: responsive.avatar.medium,
              height: responsive.avatar.medium,
              mr: responsive.spacing.gap,
              bgcolor: "primary.main",
              fontSize: responsive.typography.body1,
              fontWeight: 700,
            }}
          >
            {customer.fullName.charAt(0)}
          </Avatar>
          
          <Box sx={{ minWidth: 0, flex: 1 }}>
            {/* Name - responsive */}
            <Typography 
              variant="h6" 
              color="primary.main"
              sx={{
                fontSize: responsive.typography.h6,
                fontWeight: 700,
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getDisplayName(customer.fullName)}
            </Typography>
            
            {/* Phone - responsive */}
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontSize: responsive.typography.body2,
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getDisplayPhone(customer.phoneNumber)}
            </Typography>
          </Box>
        </Box>

        {/* More actions button - only show if needed */}
        <SmartButton
          variant="text"
          icon={<MoreVertical size={responsive.icon.medium.xs} />}
          tooltipText="Ko'proq"
          iconOnly={true}
          onClick={() => {
            // TODO: Implement more actions
            console.log("More actions clicked");
          }}
        />
      </Box>
    </Box>
  );
};

export default DialogHeaderImproved;