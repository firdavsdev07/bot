import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { MdPayment } from "react-icons/md";
import { ICustomerContract } from "../../types/ICustomer";
import { IPaydata } from "../../types/IPayment";
import { payDebt, payNewDebt } from "../../store/actions/customerActions";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { getCurrencyCourse } from "../../store/actions/dashboardActions";
import { formatNumber } from "../../utils/format-number";
import { green, red } from "@mui/material/colors";

interface IProps {
  open: boolean;
  onClose: () => void;
  contract: ICustomerContract | null;
  customerId: string;
}

const PaymentModal: FC<IProps> = ({ open, onClose, contract, customerId }) => {
  const dispatch = useAppDispatch();
  const [cashSum, setCashSum] = useState("");
  const [cashDollar, setCashDollar] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState(0);
  const [currencyCourse, setCurrencyCourse] = useState(0);

  const reset = () => {
    setCashDollar("");
    setCashSum("");
    setNotes("");
    setAmount(0);
  };
  const { qoldiqUSD, qaytimUSD } = useMemo(() => {
    const dollar = parseFloat(cashDollar) || 0;
    const sum = parseFloat(cashSum) || 0;
    const kurs = currencyCourse;
    const tolov = Number(contract?.monthlyPayment);

    const total = dollar + sum / kurs;
    setAmount(Number(total.toFixed(2)));
    const qoldiq = tolov - total;

    return {
      qoldiqUSD: qoldiq,
      qaytimUSD: -1 * qoldiq,
    };
  }, [cashDollar, cashSum, currencyCourse, contract?.monthlyPayment]);

  const handleInputChange =
    (setter: (val: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\s/g, "");
      if (!/^\d*\.?\d*$/.test(rawValue)) return;
      setter(rawValue);
    };

  const handleSubmit = () => {
    if (!contract) return;

    const currencyDetails = {
      dollar: parseFloat(cashDollar) || 0,
      sum: parseFloat(cashSum) || 0,
    };

    if (contract.debtorId) {
      const data: IPaydata = {
        id: contract.debtorId,
        amount: Number(amount),

        notes: notes,
        customerId,
        currencyDetails,
        currencyCourse,
      };
      dispatch(payDebt(data));
    } else {
      const data: IPaydata = {
        id: contract._id,
        amount: Number(amount),
        notes: notes,
        customerId,
        currencyDetails,
        currencyCourse,
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

  const isDisabled = !(amount > 0 && notes !== "");

  useEffect(() => {
    const fetchCurrencyCourse = async () => {
      if (open) {
        const result = await dispatch(getCurrencyCourse());
        if (typeof result === "number") {
          setCurrencyCourse(result);
        }
      }
    };
    fetchCurrencyCourse();
  }, [dispatch, open]);

  return (
    <Dialog open={open} onClose={handleOnClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <MdPayment style={{ marginRight: 8 }} />
          {contract?.debtorId ? "Qarizdorlikni to'lash" : "Yangi to‘lov"}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="column"
          bgcolor={green[100]}
          borderRadius={2}
          p={1}
        >
          <Typography variant="h4" color={green[900]} fontWeight={700}>
            {currencyCourse}$
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          py={2}
          px={1}
          bgcolor={red[100]}
          borderRadius={1}
          my={1}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Oylik to'lov:
          </Typography>
          <Typography variant="h5">{contract?.monthlyPayment}$</Typography>
        </Stack>

        <TextField
          label="Naqt ($)"
          fullWidth
          margin="dense"
          value={formatNumber(Number(cashDollar))}
          onChange={handleInputChange(setCashDollar)}
          InputProps={{ endAdornment: <Chip label="$" size="small" /> }}
        />

        <TextField
          label="Naqt (so‘m)"
          fullWidth
          margin="dense"
          value={formatNumber(Number(cashSum))}
          onChange={handleInputChange(setCashSum)}
          InputProps={{
            endAdornment: <Chip label="so'm" size="small" />,
          }}
        />
        <Stack spacing={2} mt={3} borderTop="1px dashed #ccc" pt={2}>
          <Typography fontWeight="bold">QOLDI:</Typography>
          <Typography color={qoldiqUSD < 0 ? "error" : "text.primary"}>
            $ {formatNumber(Number(qoldiqUSD.toFixed(2)))}
          </Typography>
          <Typography color={qoldiqUSD < 0 ? "error" : "text.primary"}>
            so'm {formatNumber(Number((qoldiqUSD * currencyCourse).toFixed(2)))}
          </Typography>

          {qaytimUSD > 0 && (
            <>
              <Typography fontWeight="bold">SDACHI:</Typography>
              <Typography>
                $ {formatNumber(Number(qaytimUSD.toFixed(2)))}
              </Typography>
              <Typography>
                so'm{" "}
                {formatNumber(Number((qaytimUSD * currencyCourse).toFixed(2)))}
              </Typography>
            </>
          )}
        </Stack>

        <TextField
          label="Izoh"
          fullWidth
          multiline
          margin="normal"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Typography variant="subtitle2" mt={2} textAlign={"center"} my={1}>
          Umumiy to‘lov miqdori ($)
        </Typography>
        <TextField
          required
          label="Umumiy to‘lov ($)"
          fullWidth
          margin="dense"
          value={amount}
          aria-readonly
          disabled
          InputProps={{ endAdornment: <Chip label="$" size="small" /> }}
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
