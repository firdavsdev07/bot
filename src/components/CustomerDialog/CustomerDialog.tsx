// import React from "react";
import { Dialog, Box } from "@mui/material";
import CustomerDetails from "./CustomerDetails";
import { ICustomer } from "../../types/ICustomer";

interface CustomerDialogProps {
  open: boolean;
  customer: ICustomer | null;
  onClose: () => void;
  isDebtorPage?: boolean;
}
const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  customer,
  onClose,
}) => {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#F9FAFB",
          scrollbarGutter: "stable",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "1px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {customer && <CustomerDetails customer={customer} onClose={onClose} />}
      </Box>
    </Dialog>
  );
};

export default CustomerDialog;
