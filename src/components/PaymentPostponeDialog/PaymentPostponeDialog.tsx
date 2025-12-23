import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
} from "@mui/material";
import { Calendar, CalendarDays, Clock } from "lucide-react";

interface PaymentPostponeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newDate: string) => void;
  payment: {
    amount: number;
    date: string;
    isPostponedOnce?: boolean;
  };
  loading?: boolean;
  currentPostponeDate?: string;
}

const PaymentPostponeDialog: React.FC<PaymentPostponeDialogProps> = ({
  open,
  onClose,
  onConfirm,
  payment,
  loading = false,
  currentPostponeDate,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState(() => {
    if (currentPostponeDate) {
      const existingDate = new Date(currentPostponeDate);
      return existingDate.toISOString().slice(0, 16);
    }

    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 1); // 1 soat keyingi
    defaultTime.setMinutes(0);
    defaultTime.setSeconds(0);
    defaultTime.setMilliseconds(0);
    return defaultTime.toISOString().slice(0, 16);
  });

  const currentDate = useMemo(() => new Date(payment.date), [payment.date]);
  const selectedDate = useMemo(
    () => new Date(selectedDateTime),
    [selectedDateTime]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("uz-UZ", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24 soatlik format
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedDateTime);
  };

  const isValidDate = selectedDate > currentDate;

  const today = new Date();
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const selectedDateOnly = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  const daysDifference = Math.round(
    (selectedDateOnly.getTime() - todayOnly.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "warning.main",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={24} color="white" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              To'lov eslatmasi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Eslatma sanasini belgilang
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {/* Hozirgi to'lov ma'lumotlari */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "grey.50",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            To'lov ma'lumotlari:
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {formatCurrency(payment.amount)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(currentDate)} - {formatTime(currentDate)}
            </Typography>
          </Box>
        </Box>

        {/* Ogohlantirish */}
        {payment.isPostponedOnce && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Diqqat!</strong> Bu to'lov allaqachon bir marta
              kechiktirilgan. Yana kechiktirish tavsiya etilmaydi.
            </Typography>
          </Alert>
        )}

        {/* Yangi sana tanlash */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Eslatma sanasi va vaqti:
          </Typography>

          <Box display="flex" gap={2}>
            {/* Sana tanlash */}
            <Box flex={1}>
              <Typography variant="caption" color="text.secondary">
                Sana
              </Typography>
              <input
                type="date"
                value={selectedDateTime.split("T")[0]}
                onChange={(e) => {
                  const time = selectedDateTime.split("T")[1] || "10:00";
                  setSelectedDateTime(`${e.target.value}T${time}`);
                }}
                min={new Date().toISOString().split("T")[0]}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </Box>

            {/* Vaqt tanlash - Custom 24-hour selector */}
            <Box flex={1}>
              <Typography variant="caption" color="text.secondary">
                Vaqt (24 soat)
              </Typography>
              <Box display="flex" gap={1}>
                {/* Soat */}
                <select
                  value={selectedDateTime.split("T")[1]?.split(":")[0] || "10"}
                  onChange={(e) => {
                    const date = selectedDateTime.split("T")[0];
                    const minute =
                      selectedDateTime.split("T")[1]?.split(":")[1] || "00";
                    setSelectedDateTime(`${date}T${e.target.value}:${minute}`);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <Typography sx={{ alignSelf: "center", fontWeight: "bold" }}>
                  :
                </Typography>

                {/* Daqiqa */}
                <select
                  value={selectedDateTime.split("T")[1]?.split(":")[1] || "00"}
                  onChange={(e) => {
                    const date = selectedDateTime.split("T")[0];
                    const hour =
                      selectedDateTime.split("T")[1]?.split(":")[0] || "10";
                    setSelectedDateTime(`${date}T${hour}:${e.target.value}`);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px 8px",
                    border: "2px solid #e0e0e0",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    outline: "none",
                    backgroundColor: "white",
                  }}
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tanlangan sana ko'rsatish */}
        {isValidDate && (
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.lighter",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "primary.light",
            }}
          >
            <Typography variant="subtitle2" color="primary.dark" gutterBottom>
              <CalendarDays /> Eslatma sanasi:
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1" fontWeight={600} color="primary.main">
                {formatDate(selectedDate)}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Clock size={16} color="#1976d2" />
                <Typography variant="body2" color="primary.dark">
                  {formatTime(selectedDate)}
                </Typography>
              </Box>
            </Box>
            <Box mt={1}>
              <Chip
                label={
                  daysDifference === 0
                    ? "Bugun eslatma"
                    : daysDifference === 1
                    ? "Ertaga eslatma"
                    : daysDifference > 1
                    ? `${daysDifference} kundan keyin`
                    : `${Math.abs(daysDifference)} kun oldin` // Bu holat bo'lmasligi kerak
                }
                size="small"
                color={daysDifference <= 1 ? "info" : "warning"}
                variant="outlined"
              />
            </Box>
          </Box>
        )}

        {/* Xato xabar */}
        {!isValidDate && selectedDateTime && (
          <Alert severity="error">
            Eslatma sanasi to'lov sanasidan keyingi bo'lishi kerak!
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
          }}
          disabled={loading}
        >
          Bekor qilish
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          fullWidth
          disabled={!isValidDate || loading}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 700,
            background: "#f59e0b",
            "&:hover": {
              background: "#d97706",
            },
          }}
        >
          {loading ? "Saqlanmoqda..." : "Eslatma o'rnatish"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPostponeDialog;
