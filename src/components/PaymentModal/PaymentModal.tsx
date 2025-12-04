import { FC, useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { DollarSign, CreditCard, FileText } from "lucide-react";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { payAllRemaining, payDebt, payNewDebt } from "../../store/actions/customerActions";
import { PaymentCalculator } from "../PaymentCalculator";
import authApi from "../../server/auth";
import { IPaydata } from "../../types/IPayment";
import { borderRadius, shadows } from "../../theme/colors";

interface PaymentModalProps {
  open: boolean;
  amount: number;
  contractId: string;
  paymentId?: string;
  isPayAll?: boolean;
  customerId?: string;
  debtorId?: string;
  targetMonth?: number;
  isDebtPayment?: boolean; // ✅ YANGI: Qarz to'lovi flag'i
  originalAmount?: number; // ✅ YANGI: Asosiy oylik to'lov miqdori (context uchun)
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: FC<PaymentModalProps> = ({
  open,
  amount,
  contractId,
  paymentId,
  isPayAll,
  customerId,
  debtorId,
  targetMonth,
  isDebtPayment = false, // ✅ YANGI: Qarz to'lovi flag'i
  originalAmount, // ✅ YANGI: Asosiy oylik to'lov miqdori
  onClose,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const [note, setNote] = useState("");
  const [dollarAmount, setDollarAmount] = useState(amount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currencyCourse, setCurrencyCourse] = useState(12500); // Default qiymat

  useEffect(() => {
    if (open) {
      // ✅ DEBUG: Modal ochilganda amount'ni tekshirish
      console.log("💰 PaymentModal opened:", {
        amount,
        paymentId,
        isPayAll,
        contractId,
        debtorId,
        targetMonth
      });
      
      setDollarAmount(amount);
      setNote("");
      setError("");
      
      const fetchCurrencyCourse = async () => {
        try {
          const res = await authApi.get("/dashboard/currency-course");
          if (res.data) {
            setCurrencyCourse(res.data);
          }
        } catch (err) {
          console.error("❌ Failed to load currency course:", err);
        }
      };
      
      fetchCurrencyCourse();
    }
  }, [open, amount, paymentId, isPayAll, contractId, debtorId, targetMonth]);

  const handleSubmit = async () => {
    // ✅ Agar allaqachon yuborilayotgan bo'lsa, qayta yuborishni oldini olish
    if (loading) {
      console.warn("⚠️ To'lov allaqachon yuborilmoqda, iltimos kuting...");
      return;
    }

    setLoading(true);
    setError("");

    if (!customerId) {
      setError("Mijoz ID topilmadi.");
      setLoading(false);
      return;
    }
    if (!contractId && !debtorId) {
      setError("Shartnoma yoki qarz ID topilmadi.");
      setLoading(false);
      return;
    }
    if (dollarAmount <= 0) {
      setError("To'lov summasi 0 dan katta bo'lishi kerak.");
      setLoading(false);
      return;
    }

    const basePayload = {
      amount: dollarAmount,
      notes: note.trim(),
      customerId,
      currencyDetails: {
        dollar: dollarAmount,
        sum: 0,
      },
      currencyCourse,
      targetMonth: targetMonth || 1, // ✅ Backend validator talab qiladi
    };

    try {
      if (isPayAll) {
        const payload = { ...basePayload, id: contractId };
        await dispatch(payAllRemaining(payload)).unwrap();
      } else if (paymentId) {
        // ✅ TUZATISH: Qolgan qarzni to'lash - Web bilan bir xil endpoint
        // payDebt Debtor ID kutadi, lekin paymentId Payment ID
        // Shuning uchun to'g'ridan-to'g'ri API chaqiramiz
        const response = await authApi.post("/payment/pay-remaining", {
          paymentId: paymentId,
          amount: dollarAmount,
          notes: note.trim(),
          currencyDetails: {
            dollar: dollarAmount,
            sum: 0,
          },
          currencyCourse,
        });
        
        // Success notification
        if (response.data.payment?.remainingAmount > 0) {
          console.log(`⚠️ Qarz qisman to'landi. Hali ${response.data.payment.remainingAmount}$ qoldi`);
        } else {
          // console.log("✅ Qolgan qarz to'liq to'landi!");
        }
      } else {
        const payload: IPaydata = {
            ...basePayload,
            id: debtorId || contractId,
            targetMonth: targetMonth,
        };
        if(debtorId) {
            await dispatch(payDebt(payload)).unwrap();
        } else {
            await dispatch(payNewDebt(payload)).unwrap();
        }
      }

      console.log("✅ To'lov muvaffaqiyatli yuborildi, modal yopilmoqda...");
      
      // ✅ Modal'ni yopish va onSuccess chaqirish
      onSuccess();
      
      // ✅ Modal yopilgandan keyin tozalash
      setTimeout(() => {
        setLoading(false);
        setDollarAmount(0);
        setNote("");
        setError("");
      }, 100);
      
    } catch (err: any) {
      console.error("❌ Payment error:", err);
      const errorMessage = err.message || "To'lovda xatolik yuz berdi.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.xl,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 1,
              bgcolor: "primary.main",
              borderRadius: borderRadius.sm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreditCard size={24} color="white" />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            {isPayAll ? "Barcha qarzni to'lash" : 
             isDebtPayment ? "Qolgan qarzni to'lash" : 
             "To'lov qilish"}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert severity="error" sx={{ borderRadius: borderRadius.md }}>
                {error}
              </Alert>
            </motion.div>
          )}
          
          <Box 
            sx={{ 
              p: 2.5, 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: borderRadius.md,
              color: "white",
              boxShadow: shadows.colored("rgba(102, 126, 234, 0.3)"),
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <DollarSign size={20} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {isDebtPayment ? "Qolgan qarz:" : 
                 isPayAll ? "Jami qolgan qarz:" : 
                 "To'lanadigan summa:"}
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {amount.toLocaleString()} $
            </Typography>
            
            {/* ✅ YANGI: Qarz to'lovida context ko'rsatish */}
            {isDebtPayment && originalAmount && (
              <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mt: 0.5 }}>
                Asosiy oylik to'lov: ${originalAmount.toLocaleString()} dan qolgan qism
              </Typography>
            )}
            
            {/* ✅ YANGI: Ortiqcha to'lash haqida ogohlantirish */}
            {dollarAmount > amount && (
              <Box 
                mt={1.5} 
                p={1.5} 
                bgcolor="rgba(56, 239, 125, 0.2)" 
                borderRadius={1}
                border="1px solid rgba(56, 239, 125, 0.4)"
              >
                <Typography variant="body2" fontWeight={600}>
                  💰 Ortiqcha: ${(dollarAmount - amount).toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, display: "block", mt: 0.5 }}>
                  Bu summa keyingi oyga avtomatik o'tkaziladi (kassa tasdiqlangandan keyin)
                </Typography>
              </Box>
            )}

            {/* ✅ YANGI: Kam to'lash haqida ogohlantirish */}
            {dollarAmount > 0 && dollarAmount < amount && (
              <Box 
                mt={1.5} 
                p={1.5} 
                bgcolor="rgba(235, 51, 73, 0.2)" 
                borderRadius={1}
                border="1px solid rgba(235, 51, 73, 0.4)"
              >
                <Typography variant="body2" fontWeight={600}>
                  ⚠️ Kam to'lov: ${(amount - dollarAmount).toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, display: "block", mt: 0.5 }}>
                  Qolgan qarz keyinroq to'lanishi kerak
                </Typography>
              </Box>
            )}

            {/* ✅ YANGI: Barchasini to'lash haqida ma'lumot */}
            {isPayAll && (
              <Box 
                mt={1.5} 
                p={1.5} 
                bgcolor="rgba(56, 239, 125, 0.2)" 
                borderRadius={1}
                border="1px solid rgba(56, 239, 125, 0.4)"
              >
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  ℹ️ Barcha qolgan oylar uchun to'lov amalga oshiriladi
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            label="To'lov summasi"
            type="number"
            value={dollarAmount}
            onChange={(e) => setDollarAmount(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DollarSign size={20} color="#667eea" />
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">$</InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: borderRadius.md,
              }
            }}
          />

          {dollarAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <PaymentCalculator
                amount={dollarAmount}
                monthlyPayment={amount}
              />
            </motion.div>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Izoh"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="To'lov haqida qo'shimcha ma'lumot..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                  <FileText size={20} color="#6B7280" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: borderRadius.md,
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1.5 }}>
        <Button 
          onClick={onClose} 
          disabled={loading} 
          fullWidth 
          variant="outlined" 
          sx={{ 
            py: 1.5,
            borderRadius: borderRadius.md,
            fontWeight: 600,
          }}
        >
          Bekor qilish
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || dollarAmount <= 0}
          fullWidth
          sx={{ 
            py: 1.5, 
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: borderRadius.md,
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            boxShadow: shadows.colored("rgba(17, 153, 142, 0.3)"),
            "&:hover": {
              background: "linear-gradient(135deg, #0d7a72 0%, #2dd46d 100%)",
            },
          }}
        >
          {loading 
            ? "Yuklanmoqda..." 
            : isPayAll 
              ? "✓ Barchasini to'lash" 
              : "✓ To'lov qilish"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;