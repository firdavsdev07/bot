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
    <Box sx={{ py: 1, px: 0, width: "100%", maxWidth: "100%", m: 0 }}>
      <Box sx={{ px: 1 }}>
        <DialogHeader
          customer={customer}
          onClose={onClose}
        />
        <DialogTab activeTab={activeTab} setActiveTab={setActiveTab} />
      </Box>

      <Box sx={{ width: "100%", maxWidth: "100%", px: 0 }}>
        {activeTab === 0 && <DialogTabPayment customerId={customer._id} />}
        {activeTab === 1 && <DialogTabCustomerInfo customerId={customer._id} />}
        {activeTab === 2 && <DialogTabNotes customerId={customer._id} />}
      </Box>


    </Box>
  );
};

export default CustomerDetails;
