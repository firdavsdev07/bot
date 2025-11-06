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
}

const CustomerListItem: React.FC<CustomerListItemProps> = ({
  customer,
  onClick,
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
        background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        transition: "0.3s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          bgcolor: theme.palette.grey[100],
        },
      }}
    >
      <Avatar
        sx={{
          mr: 2,
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        {customer.firstName.charAt(0)}
      </Avatar>

      <ListItemText
        primary={
          <Typography fontWeight={600} fontSize="1rem" color="primary.main">
            {customer.firstName} {customer.lastName}
          </Typography>
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
