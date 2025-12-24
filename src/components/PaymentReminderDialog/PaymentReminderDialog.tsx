import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Bell, X } from "lucide-react";
import { format } from "date-fns";
import { setPaymentReminder, removePaymentReminder } from "../../server/payment";
import { useAlert } from "../AlertSystem";

interface PaymentReminderDialogProps {
  open: boolean;
  onClose: () => void;
  contractId: string;
  targetMonth: number;
  currentReminderDate?: string | Date | null;
  paymentDate: string | Date; // Original payment date
  onSuccess?: () => void;
}

const PaymentReminderDialog: FC<PaymentReminderDialogProps> = ({
  open,
  onClose,
  contractId,
  targetMonth,
  currentReminderDate,
  paymentDate,
  onSuccess,
}) => {
  const { showSuccess, showError } = useAlert();
  
  // Format initial date
  const formatDateForInput = (date: string | Date | null | undefined) => {
    if (!date) {
      // Default: tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return format(tomorrow, "yyyy-MM-dd");
    }
    return format(new Date(date), "yyyy-MM-dd");
  };

  const [reminderDate, setReminderDate] = useState<string>(
    formatDateForInput(currentReminderDate)
  );
  const [loading, setLoading] = useState(false);

  const handleSetReminder = async () => {
    try {
      setLoading(true);
      
      await setPaymentReminder({
        contractId,
        targetMonth,
        reminderDate,
      });

      showSuccess("Eslatma muvaffaqiyatli belgilandi", "Eslatma");
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error("Error setting reminder:", error);
      showError(
        error?.response?.data?.message || "Eslatma belgilashda xatolik",
        "Xatolik"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveReminder = async () => {
    try {
      setLoading(true);
      
      await removePaymentReminder({
        contractId,
        targetMonth,
      });

      showSuccess("Eslatma o'chirildi", "Eslatma");
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error("Error removing reminder:", error);
      showError(
        error?.response?.data?.message || "Eslatma o'chirishda xatolik",
        "Xatolik"
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const minDate = format(today, "yyyy-MM-dd");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: 400,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Bell size={20} />
          <Typography variant="h6" fontWeight={600}>
            Eslatma belgilash
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>{targetMonth}-oy</strong> to'lovi uchun eslatma
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Asl to'lov sanasi: {format(new Date(paymentDate), "dd.MM.yyyy")}
          </Typography>
        </Box>

        <TextField
          type="date"
          label="Eslatma sanasi"
          fullWidth
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: minDate,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          💡 Bu to'lov sanasini o'zgartirmaydi, faqat sizga eslatma sifatida xizmat qiladi
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        {currentReminderDate && (
          <Button
            onClick={handleRemoveReminder}
            variant="outlined"
            color="error"
            disabled={loading}
            sx={{
              borderRadius: 1.5,
            }}
          >
            O'chirish
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 1.5,
          }}
        >
          Bekor
        </Button>
        <Button
          onClick={handleSetReminder}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 1.5,
            minWidth: 100,
          }}
        >
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentReminderDialog;
