import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { MdPayment } from "react-icons/md";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IExpenses } from "../../types/IExpenses";
import { formatNumber } from "../../utils/format-number";
import {
  addExpenses,
  updateExpenses,
} from "../../store/actions/expensesActions";
import { closeExpensesModal } from "../../store/slices/expensesSlice";

const defaultFormValues: IExpenses = {
  id: "",
  notes: "",
  currencyDetails: {
    dollar: 0,
    sum: 0,
  },
};

const ExpensesDialog = () => {
  const dispatch = useAppDispatch();
  const { expensesModal } = useSelector((state: RootState) => state.expenses);
  const cash = expensesModal.data;

  const [formValues, setFormValues] = useState<IExpenses>(defaultFormValues);

  useEffect(() => {
    if (expensesModal?.type === "edit" && cash) {
      setFormValues({
        id: cash.id,
        currencyDetails: {
          sum: cash?.currencyDetails?.sum || 0,
          dollar: cash?.currencyDetails?.dollar || 0,
        },
        notes: cash?.notes || "",
      });
    } else {
      setFormValues(defaultFormValues);
    }
  }, [cash, expensesModal?.type]);

  const handleClose = useCallback(() => {
    setFormValues(defaultFormValues);
    dispatch(closeExpensesModal());
  }, [dispatch]);

  const handleSubmit = () => {
    if (expensesModal.type == "add") {
      dispatch(addExpenses(formValues));
    } else {
      dispatch(updateExpenses(formValues));
    }
    handleClose();
  };

  const isDisabled =
    (formValues.currencyDetails.dollar > 0 ||
      formValues.currencyDetails.sum > 0) &&
    formValues.notes.trim() !== "";

  return (
    <Dialog
      open={!!expensesModal?.type}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <MdPayment style={{ marginRight: 8 }} />
          To‘lov ma’lumotlari
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          label={`Miqdor Dollar`}
          fullWidth
          margin="dense"
          value={formatNumber(formValues.currencyDetails.dollar)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormValues((prev) => ({
              ...prev,
              currencyDetails: {
                ...prev.currencyDetails,
                dollar: Number(value),
              },
            }));
          }}
          InputProps={{
            endAdornment: <Chip label={"$"} size="small" />,
          }}
        />
        <TextField
          label={`Miqdor (${formValues.currencyDetails.sum})`}
          fullWidth
          margin="dense"
          value={formatNumber(formValues.currencyDetails.sum)}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormValues((prev) => ({
              ...prev,
              currencyDetails: {
                ...prev.currencyDetails,
                sum: Number(value),
              },
            }));
          }}
          InputProps={{
            endAdornment: <Chip label={"so'm"} size="small" />,
          }}
        />

        <TextField
          label="Izoh"
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={formValues.notes}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              notes: e.target.value,
            }))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Bekor qilish</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isDisabled}
        >
          Saqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExpensesDialog;
