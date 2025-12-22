import { Box, Typography } from "@mui/material";
import { Check, TriangleAlert } from "lucide-react";
import { FC } from "react";

interface PaymentCalculatorProps {
  amount: number;
  monthlyPayment: number;
}

export const PaymentCalculator: FC<PaymentCalculatorProps> = ({
  amount,
  monthlyPayment,
}) => {
  if (amount <= 0) return null;

  const difference = amount - monthlyPayment;
  const isUnderpaid = difference < -0.01;
  const isOverpaid = difference > 0.01;
  const isExact = Math.abs(difference) <= 0.01;

  if (isUnderpaid) {
    return (
      <Box
        sx={{
          p: 2,
          bgcolor: "#ffebee",
          borderRadius: 2,
          border: "2px solid #ef5350",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" color="error.main">
            <TriangleAlert />
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="error.main">
            Kam to'layapsiz
          </Typography>
        </Box>
        <Typography variant="body2" color="error.dark">
          Yana <strong>{Math.abs(difference).toFixed(2)} $</strong> to'lashingiz
          kerak
        </Typography>
        <Typography variant="caption" color="text.secondary">
          To'layotgan: {amount.toFixed(2)} $ | Kerak:{" "}
          {monthlyPayment.toFixed(2)} $
        </Typography>
      </Box>
    );
  }

  if (isOverpaid) {
    return (
      <Box
        sx={{
          p: 2,
          bgcolor: "#e3f2fd",
          borderRadius: 2,
          border: "2px solid #2196f3",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" color="info.main">
            <Check />
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" color="info.main">
            Ko'p to'layapsiz
          </Typography>
        </Box>
        <Typography variant="body2" color="info.dark">
          <strong>{difference.toFixed(2)} $</strong> ortiqcha to'layapsiz
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Bu summa keyingi oyga o'tkaziladi
        </Typography>
        <Typography variant="caption" color="text.secondary">
          To'layotgan: {amount.toFixed(2)} $ | Kerak:{" "}
          {monthlyPayment.toFixed(2)} $
        </Typography>
      </Box>
    );
  }

  if (isExact) {
    return (
      <Box
        sx={{
          p: 2,
          bgcolor: "#e8f5e9",
          borderRadius: 2,
          border: "2px solid #66bb6a",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" color="success.main">
            ✓
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="success.main"
          >
            To'g'ri summa
          </Typography>
        </Box>
        <Typography variant="body2" color="success.dark">
          Oylik to'lovga to'liq mos keladi
        </Typography>
        <Typography variant="caption" color="text.secondary">
          To'layotgan: {amount.toFixed(2)} $ = Kerak:{" "}
          {monthlyPayment.toFixed(2)} $
        </Typography>
      </Box>
    );
  }

  return null;
};
