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
import { DollarSign, CreditCard, FileText, Calendar } from "lucide-react";

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
  const [dollarAmount, setDollarAmount] = useState(0); // Bo'sh boshlanadi
  const [sumAmount, setSumAmount] = useState(0);
  const [currencyCourse, setCurrencyCourse] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextPaymentDate, setNextPaymentDate] = useState<string>(() => {
    // Default: Ertaga, 10:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
  }); // ✅ YANGI: Keyingi to'lov sanasi (sana + vaqt)
  
  // Jami summa (dollar + so'mni dollorga o'tkazgandan keyin)
  const totalAmountInDollar = dollarAmount + (sumAmount / currencyCourse);
  
  // ✅ YANGI: Kam to'lov ekanligini aniqlash
  const isUnderpaid = totalAmountInDollar > 0 && totalAmountInDollar < amount;
  const remainingDebt = amount - totalAmountInDollar;

  useEffect(() => {
    if (open) {
      console.log("💰 PaymentModal opened:", {
        amount,
        paymentId,
        isPayAll,
        contractId,
        debtorId,
        targetMonth
      });
      
      setDollarAmount(0); // Bo'sh boshlanadi
      setNote("");
      setError("");
      setNextPaymentDate(""); // ✅ YANGI: Reset next payment date
      
      const fetchCurrencyCourse = async () => {
        try {
          const res = await authApi.get("/dashboard/currency-course");
          console.log("🔍 Currency API Response:", res.data);
          if (res.data && res.data.course) {
            console.log("✅ Setting currency course:", res.data.course);
            setCurrencyCourse(res.data.course);
          } else {
            console.warn("⚠️ No course data received:", res.data);
          }
        } catch (err: any) {
          console.error("❌ Failed to load currency course:", err);
          console.error("Error details:", err?.response?.data);
        }
      };
      
      fetchCurrencyCourse();
    }
  }, [open, amount, paymentId, isPayAll, contractId, debtorId, targetMonth]);

  // Input qiymatini parse qilish (nuqta va vergulni qo'llab-quvvatlaydi)
  const parseInputNumber = (str: string): number => {
    // Faqat raqamlar, nuqta va vergulni qoldirish
    const cleaned = str.replace(/[^\d.,]/g, "");
    // Vergulni nuqtaga almashtirish
    const normalized = cleaned.replace(/,/g, "");
    return parseFloat(normalized) || 0;
  };

  const handleDollarChange = (value: string) => {
    // Faqat raqamlar va nuqtani qabul qilish
    if (value === "" || /^[\d.]*$/.test(value)) {
      const numValue = parseInputNumber(value);
      setDollarAmount(numValue);
    }
  };

  const handleSumChange = (value: string) => {
    // Faqat raqamlar va nuqtani qabul qilish
    if (value === "" || /^[\d.]*$/.test(value)) {
      const numValue = parseInputNumber(value);
      setSumAmount(numValue);
    }
  };

  const handleSubmit = async () => {
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
    if (totalAmountInDollar <= 0) {
      setError("To'lov summasi 0 dan katta bo'lishi kerak.");
      setLoading(false);
      return;
    }

    // ✅ YANGI: Kam to'lov bo'lsa, nextPaymentDate MAJBURIY
    if (isUnderpaid && !nextPaymentDate) {
      setError("Kam to'lov qilganda keyingi to'lov sanasini belgilang!");
      setLoading(false);
      return;
    }

    const basePayload = {
      amount: totalAmountInDollar, // Jami summa dolarda
      notes: note.trim(),
      customerId,
      currencyDetails: {
        dollar: dollarAmount,
        sum: sumAmount,
      },
      currencyCourse,
      targetMonth: targetMonth || 1, // ✅ Backend validator talab qiladi
      nextPaymentDate: nextPaymentDate || undefined, // ✅ YANGI: Kam to'lov bo'lsa yuboriladi
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
          amount: totalAmountInDollar, // Jami summa dolarda
          notes: note.trim(),
          currencyDetails: {
            dollar: dollarAmount,
            sum: sumAmount,
          },
          currencyCourse,
          nextPaymentDate: nextPaymentDate || undefined, // ✅ YANGI
        });
        
        // Success notification
        if (response.data.payment?.remainingAmount > 0) {
          console.log(`⚠️ Qarz qisman to'landi. Hali ${response.data.payment.remainingAmount}$ qoldi`);
        } else {
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

      console.log("✅ To'lov muvaffaqiyatli yuborildi");
      
      // ✅ YANGI: Agar kam to'lov bo'lsa va nextPaymentDate belgilangan bo'lsa, Reminder yaratish
      if (isUnderpaid && nextPaymentDate && contractId && targetMonth) {
        try {
          console.log("📅 Kam to'lov aniqlandi, Reminder yaratilmoqda...");
          
          const reminderResponse = await authApi.post("/payment/postpone-payment", {
            contractId: contractId,
            postponeDate: new Date(nextPaymentDate).toISOString(),
            reason: `Kam to'lov: $${remainingDebt.toFixed(2)} qoldi`,
            targetMonth: targetMonth,
          });
          
          console.log("✅ Reminder muvaffaqiyatli yaratildi:", reminderResponse.data);
        } catch (reminderErr: any) {
          console.error("⚠️ Reminder yaratishda xatolik (to'lov qabul qilindi):", reminderErr);
          // To'lov qabul qilingani uchun error ko'rsatmaymiz
        }
      }
      
      onSuccess();
      
      setTimeout(() => {
        setLoading(false);
        setDollarAmount(0);
        setSumAmount(0);
        setNote("");
        setError("");
        setNextPaymentDate(""); // ✅ YANGI: Reset
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
      fullScreen={window.innerWidth < 640} // Mobile uchun fullScreen
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: borderRadius.lg },
          boxShadow: shadows.xl,
          m: { xs: 0, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>
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
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {isPayAll ? "Barcha qarzni to'lash" : 
               isDebtPayment ? "Qolgan qarzni to'lash" : 
               "To'lov qilish"}
              {/* ✅ Qaysi oy uchun to'lov */}
              {targetMonth && !isPayAll && (
                <Typography component="span" color="primary.main" sx={{ ml: 1, fontSize: "1.1rem" }}>
                  ({targetMonth}-oy)
                </Typography>
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              {isDebtPayment ? `${targetMonth}-oy uchun qolgan qism` :
               isPayAll ? "Barcha to'lovlar" : 
               targetMonth ? `${targetMonth}-oylik to'lov` : "To'lov ma'lumotlari"}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5 }, mt: 1 }}>
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
            {isUnderpaid && (
              <Box 
                mt={1.5} 
                p={1.5} 
                bgcolor="rgba(235, 51, 73, 0.2)" 
                borderRadius={1}
                border="1px solid rgba(235, 51, 73, 0.4)"
              >
                <Typography variant="body2" fontWeight={600}>
                  ⚠️ Kam to'lov: ${remainingDebt.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, display: "block", mt: 0.5 }}>
                  Qolgan qarzni qachon to'lashingizni belgilang ⬇️
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
            label="Dollar"
            type="number"
            value={dollarAmount === 0 ? "" : dollarAmount}
            onChange={(e) => handleDollarChange(e.target.value)}
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

          <TextField
            fullWidth
            label="So'm"
            type="number"
            value={sumAmount === 0 ? "" : sumAmount}
            onChange={(e) => handleSumChange(e.target.value)}
            placeholder="0"
            InputProps={{
              endAdornment: <InputAdornment position="end">so'm</InputAdornment>,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: borderRadius.md,
              }
            }}
          />

          <Box
            sx={{
              p: 2,
              bgcolor: "background.neutral",
              borderRadius: borderRadius.md,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Kurs: 1$ = {currencyCourse.toLocaleString()} so'm
            </Typography>
            {sumAmount > 0 && (
              <Typography variant="caption" color="primary.main" fontWeight="bold">
                Jami: {dollarAmount.toFixed(2)} $ + {sumAmount.toFixed(0)} so'm = {totalAmountInDollar.toFixed(2)} $
              </Typography>
            )}
          </Box>

          {totalAmountInDollar > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <PaymentCalculator
                amount={totalAmountInDollar}
                monthlyPayment={amount}
              />
            </motion.div>
          )}

          {/* ✅ YANGI: Kam to'lov bo'lsa - keyingi to'lov sanasi MAJBURIY */}
          {isUnderpaid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Calendar size={20} color="#EF4444" />
                  <Typography variant="subtitle2" fontWeight={600} color="error.main">
                    Qolgani qachon to'laysiz? *
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  type="datetime-local"
                  value={nextPaymentDate}
                  onChange={(e) => setNextPaymentDate(e.target.value)}
                  required
                  error={isUnderpaid && !nextPaymentDate}
                  helperText={isUnderpaid && !nextPaymentDate ? "Kam to'lov qilganda sana va vaqt majburiy!" : `Qolgan $${remainingDebt.toFixed(2)} ni to'lash sanasi va vaqti`}
                  InputProps={{
                    inputProps: {
                      min: new Date(new Date().setHours(new Date().getHours() + 1))
                        .toISOString()
                        .slice(0, 16), // Hozirdan 1 soat keyin
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: borderRadius.md,
                      backgroundColor: "rgba(239, 68, 68, 0.05)",
                      borderColor: "error.main",
                    },
                    "& .MuiFormHelperText-root": {
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>
            </motion.div>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Izoh (ixtiyoriy)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="To'lov haqida qo'shimcha ma'lumot... (majburiy emas)"
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
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, gap: 1.5, flexDirection: { xs: "column", sm: "row" } }}>
        <Button 
          onClick={onClose} 
          disabled={loading} 
          fullWidth 
          variant="outlined" 
          sx={{ 
            py: { xs: 1.25, sm: 1.5 },
            borderRadius: borderRadius.md,
            fontWeight: 600,
            minWidth: { xs: "100%", sm: "auto" },
            "&:disabled": {
              opacity: 0.6,
            },
          }}
        >
          Bekor qilish
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || totalAmountInDollar <= 0 || (isUnderpaid && !nextPaymentDate)}
          fullWidth
          sx={{ 
            py: { xs: 1.25, sm: 1.5 },
            fontSize: { xs: "0.9rem", sm: "1rem" },
            fontWeight: 700,
            borderRadius: borderRadius.md,
            background: loading 
              ? "rgba(0, 0, 0, 0.12)" 
              : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            boxShadow: loading 
              ? "none" 
              : shadows.colored("rgba(17, 153, 142, 0.3)"),
            minWidth: { xs: "100%", sm: "auto" },
            whiteSpace: "nowrap",
            "&:hover": {
              background: loading 
                ? "rgba(0, 0, 0, 0.12)" 
                : "linear-gradient(135deg, #0d7a72 0%, #2dd46d 100%)",
            },
            "&:disabled": {
              background: "rgba(0, 0, 0, 0.12)",
              color: "rgba(0, 0, 0, 0.38)",
            },
          }}
        >
          {loading 
            ? "Kutish..." 
            : isPayAll 
              ? "✓ Barchasini to'lash" 
              : "✓ To'lov qilish"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;