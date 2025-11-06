import { useState, FC } from "react";
import { Box } from "@mui/material";
// import TimePickerModal from "../PaymentExtensionDialog";
import { ICustomer } from "../../types/ICustomer";
import DialogHeader from "./DialogHeader";
import DialogTab from "./DialogTab";
import DialogTabCustomerInfo from "./DialogTabCustomerInfo";
import DialogTabPayment from "./DialogTabPayment";
import DialogTabNotes from "./DialogTabNotes";

const CustomerDetails: FC<{
  customer: ICustomer;
  onClose: () => void;
  isAdmin?: boolean;
}> = ({ customer, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Box sx={{ py: 2, px: 1 }}>
      <DialogHeader
        customer={customer}
        onClose={onClose}
      />
      <DialogTab activeTab={activeTab} setActiveTab={setActiveTab} />

      <Box>
        {activeTab === 0 && <DialogTabCustomerInfo customerId={customer._id} />}
        {activeTab === 1 && <DialogTabPayment customerId={customer._id} />}
        {activeTab === 2 && <DialogTabNotes customerId={customer._id} />}
      </Box>

      {/* <TimePickerModal
        open={extensionDialogOpen}
        onClose={() => setExtensionDialogOpen(false)}
        onConfirm={(isoString) => {
          console.log("Tanlangan vaqt:", isoString);
        }}
      /> */}
    </Box>
  );
};

export default CustomerDetails;
