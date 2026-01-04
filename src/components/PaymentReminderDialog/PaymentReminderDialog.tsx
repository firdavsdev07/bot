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
  currentReminderComment?: string | null;
  paymentDate: string | Date; // Original payment date
  onSuccess?: () => void;
}

const PaymentReminderDialog: FC<PaymentReminderDialogProps> = ({
  open,
  onClose,
  contractId,
  targetMonth,
  currentReminderDate,
  currentReminderComment,
  paymentDate,
  onSuccess,
}) => {
  const { showSuccess, showError } = useAlert();
  
  // Format initial date
  const formatDateForInput = (date: string | Date | null | undefined) => {
    if (!date) {
      // Default: empty string (kalendarda ko'rinmasligi uchun)
      return "";
    }
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return "";
      }
      return format(d, "yyyy-MM-dd");
    } catch {
      return "";
    }
  };

  const [reminderDate, setReminderDate] = useState<string>(
    formatDateForInput(currentReminderDate)
  );
  const [reminderComment, setReminderComment] = useState<string>(
    currentReminderComment || ""
  );
  const [loading, setLoading] = useState(false);

  const handleSetReminder = async () => {
    try {
      setLoading(true);
      
      console.log("🔔 Setting reminder:", {
        contractId,
        targetMonth,
        targetMonthType: typeof targetMonth,
        reminderDate,
        reminderDateType: typeof reminderDate
      });
      
      await setPaymentReminder({
        contractId,
        targetMonth,
        reminderDate,
        reminderComment: reminderComment.trim() || undefined,
      });

      showSuccess("Eslatma muvaffaqiyatli belgilandi", "Eslatma");
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error("❌ Error setting reminder:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
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
      
      console.log("🔕 Removing reminder:", {
        contractId,
        targetMonth,
        targetMonthType: typeof targetMonth
      });
      
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
      console.error("❌ Error removing reminder:", error);
      console.error("Error details:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
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
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
            📅 Asl to'lov sanasi: {(() => {
              try {
                if (!paymentDate) return '-';
                const d = new Date(paymentDate);
                return isNaN(d.getTime()) ? '-' : format(d, "dd.MM.yyyy");
              } catch {
                return '-';
              }
            })()}
          </Typography>
          {currentReminderDate && (
            <Typography variant="caption" color="warning.main" sx={{ display: "block" }}>
              🔔 O'rnatilgan eslatma: {formatDateForInput(currentReminderDate) ? format(new Date(currentReminderDate), "dd.MM.yyyy") : '-'}
            </Typography>
          )}
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
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
          helperText="Eslatma uchun sana tanlang"
        />

        <TextField
          label="Izoh (ixtiyoriy)"
          fullWidth
          multiline
          rows={3}
          value={reminderComment}
          onChange={(e) => setReminderComment(e.target.value)}
          placeholder="Eslatma uchun izoh yozing..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
          helperText="Bu izoh faqat siz uchun ko'rinadi"
        />

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          💡 Bu to'lov sanasini o'zgartirmaydi, faqat sizga eslatma sifatida xizmat qiladi
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1.5, flexWrap: "wrap" }}>
        {currentReminderDate && (
          <Button
            onClick={handleRemoveReminder}
            variant="outlined"
            color="error"
            disabled={loading}
            sx={{
              borderRadius: 1.5,
              minWidth: 100,
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
            minWidth: 90,
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
