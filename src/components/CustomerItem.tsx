import {
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { ICustomer } from "../types/ICustomer";

interface CustomerListItemProps {
  customer: ICustomer;
  onClick: (customer: ICustomer) => void;
  showDebtBadge?: boolean;
}

const CustomerListItem: React.FC<CustomerListItemProps> = ({
  customer,
  onClick,
  showDebtBadge = false,
}) => {
  const theme = useTheme();

  return (
    <ListItemButton
      onClick={() => onClick(customer)}
      sx={{
        borderRadius: 2,
        my: 1,
        px: 3,
        py: 2,
        background: showDebtBadge
          ? "linear-gradient(135deg, #fff5f5, #ffffff)"
          : "linear-gradient(135deg, #f0f4ff, #ffffff)",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        transition: "0.3s",
        border: showDebtBadge ? "1px solid #ffcdd2" : "none",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          bgcolor: theme.palette.grey[100],
        },
      }}
    >
      <Avatar
        sx={{
          mr: 2,
          bgcolor: showDebtBadge
            ? theme.palette.error.main
            : theme.palette.primary.main,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        {customer.firstName.charAt(0)}
      </Avatar>

      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight={600} fontSize="1rem" color="primary.main">
              {customer.firstName} {customer.lastName}
            </Typography>
            {showDebtBadge && (
              <Box
                sx={{
                  bgcolor: "error.main",
                  color: "white",
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}
              >
                QARZDOR
              </Box>
            )}
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary">
              📞 {customer.phoneNumber}
            </Typography>
          </Box>
        }
      />
    </ListItemButton>
  );
};

export default CustomerListItem;
