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
      fullWidth
      maxWidth={false}
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
          maxWidth: "none !important",
          width: "100vw !important",
          height: "100vh !important",
          margin: "0 !important",
          left: "0 !important",
          right: "0 !important",
        },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "100%", p: 0, m: 0 }}>
        {customer && <CustomerDetails customer={customer} onClose={onClose} />}
      </Box>
    </Dialog>
  );
};

export default CustomerDialog;
