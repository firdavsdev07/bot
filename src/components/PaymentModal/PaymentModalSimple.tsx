import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { MdPayment } from "react-icons/md";
import { ICustomerContract } from "../../types/ICustomer";
import { IPaydata } from "../../types/IPayment";
import { payDebt, payNewDebt } from "../../store/actions/customerActions";
import { useAppDispatch } from "../../hooks/useAppDispatch";

interface IProps {
  open: boolean;
  onClose: () => void;
  contract: ICustomerContract | null;
  customerId: string;
}

const PaymentModal: FC<IProps> = ({ open, onClose, contract, customerId }) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const reset = () => {
    setAmount("");
    setNotes("");
  };

  const handleSubmit = () => {
    if (!contract) return;

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) return;

    const currencyDetails = {
      dollar: paymentAmount,
      sum: 0,
    };

    if (contract.debtorId) {
      const data: IPaydata = {
        id: contract.debtorId,
        amount: paymentAmount,
        notes: notes,
        customerId,
        currencyDetails,
        currencyCourse: 12500,
      };
      dispatch(payDebt(data));
    } else {
      const data: IPaydata = {
        id: contract._id,
        amount: paymentAmount,
        notes: notes,
        customerId,
        currencyDetails,
        currencyCourse: 12500,
      };
      dispatch(payNewDebt(data));
    }

    onClose();
    reset();
  };

  const handleOnClose = () => {
    reset();
    onClose();
  };

  const isDisabled = !(parseFloat(amount) > 0 && notes !== "");

  return (
    <Dialog open={open} onClose={handleOnClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <MdPayment style={{ marginRight: 8 }} />
          To'lov qilish
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mb: 2, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Oylik to'lov:
          </Typography>
          <Typography variant="h6">{contract?.monthlyPayment} $</Typography>
        </Box>

        <TextField
          label="To'lov miqdori ($)"
          fullWidth
          margin="dense"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />

        <TextField
          label="Izoh"
          fullWidth
          multiline
          margin="normal"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="To'lov haqida izoh..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose}>Bekor qilish</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isDisabled}
        >
          Saqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
