import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { FC } from "react";
import {
  MdArrowBack,
} from "react-icons/md";
import { ICustomer } from "../../types/ICustomer";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCustomerDetails } from "../../store/slices/customerSlice";

interface IProps {
  customer: ICustomer;
  onClose: () => void;
}

const DialogHeader: FC<IProps> = ({
  customer,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  return (
    <Box display="flex" alignItems="center" gap={2} mb={3}>
      <IconButton
        onClick={() => {
          onClose();
          dispatch(setCustomerDetails(null));
        }}
        size="large"
        sx={{
          pl: 0,
          minWidth: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MdArrowBack />
      </IconButton>
      <Box width="100%" display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{ width: 40, height: 40, mr: 2, bgcolor: "primary.main" }}
          >
            {customer.firstName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" color="primary.main">
              {customer.firstName} {customer.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {customer.phoneNumber}
            </Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default DialogHeader;
