import type { FC } from "react";
import React, { useState } from "react";

import {
  Box,
  Chip,
  Paper,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from "@mui/material";
import { format, addMonths } from "date-fns";
import { MdCheckCircle, MdWarning, MdPayment, MdArrowUpward, MdArrowDownward } from "react-icons/md";


import PaymentModal from "../PaymentModal/PaymentModal";
import PaymentPostponeDialog from "../PaymentPostponeDialog";
import { IPayment } from "../../types/IPayment"; // Import the IPayment interface
import { StatusBadge } from "./StatusBadge";

interface PaymentScheduleItem {
  month: number;
  date: string;
  amount: number;
  isPaid: boolean;
  isInitial?: boolean;
}

interface PaymentScheduleProps {
  startDate: string;
  monthlyPayment: number;
  period: number;
  initialPayment?: number;
  initialPaymentDueDate?: string;
  contractId?: string;
  debtorId?: string; // Specific to nasiya-bot
  customerId?: string; // Specific to nasiya-bot
  remainingDebt?: number;
  totalPaid?: number;
  prepaidBalance?: number; // ✅ YANGI: Oldindan to'langan summa
  payments?: IPayment[]; // Use the imported IPayment interface
  onPaymentSuccess?: () => void;
  readOnly?: boolean;
}

const PaymentSchedule: FC<PaymentScheduleProps> = ({
  startDate,
  monthlyPayment,
  period,
  initialPayment = 0,
  initialPaymentDueDate,
  contractId,
  remainingDebt = 0,
  totalPaid = 0,
  prepaidBalance = 0, // ✅ YANGI
  payments = [],
  onPaymentSuccess,
  debtorId,
  customerId,
  readOnly,
}) => {
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    amount: number;
    isPayAll?: boolean;
    paymentId?: string; // For paying off remaining debt of a specific payment
    month?: number; // For new monthly payments
  }>({
    open: false,
    amount: 0,
    isPayAll: false,
    paymentId: undefined,
    month: undefined,
  });

  // ✅ YANGI: To'lovni kechiktirish uchun state
  const [postponeDialog, setPostponeDialog] = useState<{
    open: boolean;
    payment: IPayment | null;
    loading: boolean;
  }>({
    open: false,
    payment: null,
    loading: false,
  });
  
  React.useEffect(() => {
    // ✅ DEBUG: Payments o'zgarganda log chiqarish
    console.log("📦 Payments updated:", {
      totalPayments: payments.length,
      pendingPayments: payments.filter(p => p.status === 'PENDING').length,
      paidPayments: payments.filter(p => p.isPaid).length,
    });
  }, [payments]);

  React.useEffect(() => {
    // ✅ DEBUG: readOnly va boshqa props
    console.log("🔍 [POSTPONE] PaymentSchedule Props:", {
      readOnly,
      contractId,
      debtorId,
      customerId,
      canShowPostponeButton: !readOnly && (!!contractId || !!debtorId)
    });
  }, [readOnly, contractId, debtorId, customerId]);

  // To'lov jadvalini yaratish
  const generateSchedule = (): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const start = new Date(startDate);
    
    // 🔍 DEBUG: initialPayment qiymatini tekshirish
    // console.log('🔍 DEBUG - PaymentSchedule Props:', {
    //   initialPayment,
    //   initialPaymentDueDate,
    //   startDate,
    //   monthlyPayment,
    //   period,
    //   paymentsCount: payments.length,
    //   hasInitialPaymentRecord: payments.some(p => p.paymentType === "initial")
    // });

    // Boshlang'ich to'lov qilinganmi tekshirish - payments arraydan
    const initialPaymentRecord = payments.find(
      (p) => p.paymentType === "initial" && p.isPaid
    );
    const isInitialPaid = !!initialPaymentRecord;

    // Boshlang'ich to'lovni qo'shish
    if (initialPayment > 0) {
      const initialDate = initialPaymentDueDate
        ? new Date(initialPaymentDueDate)
        : start;

      schedule.push({
        month: 0,
        date: format(initialDate, "yyyy-MM-dd"),
        amount: initialPayment,
        isPaid: isInitialPaid,
        isInitial: true,
      });
    }

    // Oylik to'lovlarni sanasi bo'yicha tartiblash
    // ✅ MUHIM: confirmedAt bo'yicha tartiblaymiz (haqiqatda qachon to'langan)
    // Agar confirmedAt yo'q bo'lsa, date'dan foydalanamiz
    const monthlyPayments = payments
      .filter((p) => p.paymentType !== "initial" && p.isPaid)
      .sort((a, b) => {
        const dateA = a.confirmedAt
          ? new Date(a.confirmedAt)
          : new Date(a.date);
        const dateB = b.confirmedAt
          ? new Date(b.confirmedAt)
          : new Date(b.date);

        // Agar confirmedAt bir xil bo'lsa, date bo'yicha tartiblash
        if (dateA.getTime() === dateB.getTime()) {
          return new Date(a.date as string).getTime() - new Date(b.date as string).getTime();
        }

        return dateA.getTime() - dateB.getTime();
      });

    // Oylik to'lovlarni qo'shish
    for (let i = 1; i <= period; i++) {
      const paymentDate = addMonths(start, i);

      // Bu oy uchun to'lov mavjudmi tekshirish (index bo'yicha)
      const isPaid = i <= monthlyPayments.length;

      schedule.push({
        month: i,
        date: format(paymentDate, "yyyy-MM-dd"),
        amount: monthlyPayment,
        isPaid,
      });
    }

    return schedule;
  };

  const schedule = generateSchedule();
  const today = new Date();

  const handlePayment = (amount: number, paymentId?: string, month?: number) => {
    if (!contractId && !debtorId) {
        alert("Xatolik: Shartnoma ID topilmadi");
        return;
    }

    if (!customerId) {
        alert("Xatolik: Mijoz ID topilmadi");
        return;
    }
    
    // ✅ Agar bu oy uchun allaqachon PENDING to'lov bo'lsa, qayta yuborishni oldini olish
    if (month) {
      const hasPending = payments.some(p => p.status === 'PENDING' && p.targetMonth === month);
      if (hasPending) {
        console.warn(`⚠️ Month ${month} uchun PENDING to'lov mavjud, qayta yuborib bo'lmaydi!`);
        alert("Bu oy uchun to'lov allaqachon kutilmoqda. Kassa tasdiqini kuting.");
        return;
      }
    }
    
    setPaymentModal({ open: true, amount, paymentId, month });
  };

  const handlePayAll = () => {
    if (!contractId && !debtorId) {
        alert("Xatolik: Shartnoma ID topilmadi");
        return;
    }

    if (!customerId) {
        alert("Xatolik: Mijoz ID topilmadi");
        return;
    }
    
    // ✅ MUHIM: PENDING to'lovlar borligini tekshirish
    const hasPendingPayments = payments.some((p) => p.status === "PENDING");
    if (hasPendingPayments) {
      console.warn("⚠️ PENDING to'lovlar mavjud, barcha qarzni to'lash mumkin emas!");
      alert("To'lovlar kutilmoqda. Kassa tasdiqini kuting.");
      return;
    }
    
    setPaymentModal({ open: true, amount: remainingDebt || 0, isPayAll: true });
  };

  const handlePaymentSuccess = () => {
    console.log(`✅ To'lov muvaffaqiyatli yuborildi, shartnoma ma'lumotlari yangilanmoqda...`);
    
    setPaymentModal({
      open: false,
      amount: 0,
      isPayAll: false,
      paymentId: undefined,
      month: undefined,
    });
    
    // ✅ MUHIM: Backend payment yaratishi uchun biroz kutamiz
    // Bu PENDING statusni to'g'ri ko'rsatish uchun zarur
    setTimeout(() => {
      if (onPaymentSuccess) {
        console.log("🔄 Refreshing contract data to show PENDING status...");
        onPaymentSuccess();
      } else {
        console.warn("⚠️ onPaymentSuccess callback not provided");
      }
    }, 500); // 500ms kutamiz - backend payment yaratguncha
  };

  // ✅ YANGI: To'lovni kechiktirish funksiyasi
  const handlePostponePayment = (paymentItem: PaymentScheduleItem) => {
    // Bu oyga tegishli payment record'ni topish
    const targetPayment = payments.find(p => 
      p.targetMonth === paymentItem.month && 
      p.paymentType === "monthly" && 
      !p.isPaid
    );

    if (targetPayment) {
      setPostponeDialog({
        open: true,
        payment: targetPayment,
        loading: false,
      });
    } else {
      // Agar payment record yo'q bo'lsa, virtual payment yaratamiz
      const virtualPayment: IPayment = {
        _id: `temp-${paymentItem.month}`,
        amount: paymentItem.amount,
        date: paymentItem.date,
        isPaid: false,
        paymentType: "monthly",
        targetMonth: paymentItem.month,
        status: "PENDING",
        notes: {} as any,
        customerId: {} as any,
        managerId: {} as any,
      };

      setPostponeDialog({
        open: true,
        payment: virtualPayment,
        loading: false,
      });
    }
  };

  // ✅ YANGI: Kechiktirish tasdiqlash funksiyasi
  const handlePostponeConfirm = async (newDateTime: string) => {
    if (!postponeDialog.payment || !contractId) return;

    setPostponeDialog(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/postpone-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken') || localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          contractId,
          postponeDate: newDateTime,
          reason: 'Mijozning so\'rovi bo\'yicha kechiktirildi',
        }),
      });

      if (response.ok) {
        console.log('✅ To\'lov muvaffaqiyatli kechiktirildi');
        
        setPostponeDialog({
          open: false,
          payment: null,
          loading: false,
        });

        // Contractni yangilash
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }

        alert('To\'lov muvaffaqiyatli kechiktirildi!');
      } else {
        const errorData = await response.json();
        console.error('❌ Kechiktirish xatosi:', errorData);
        alert(errorData.message || 'Kechiktirish amalga oshmadi');
      }
    } catch (error) {
      console.error('❌ API xatosi:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    } finally {
      setPostponeDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // ✅ YANGI: Kechiktirish dialogini yopish
  const handlePostponeClose = () => {
    setPostponeDialog({
      open: false,
      payment: null,
      loading: false,
    });
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{ p: { xs: 1, sm: 1.5 }, border: 1, borderColor: "divider" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
          flexWrap="wrap"
          gap={1}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="600">
              To'lov jadvali
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {period} oylik • {schedule.filter((s) => s.isPaid).length}/
              {schedule.length} to'langan
            </Typography>
            {/* ✅ YANGI: prepaidBalance */}
            {prepaidBalance > 0 && (
              <Box 
                display="flex" 
                alignItems="center" 
                gap={0.5}
                sx={{
                  mt: 0.5,
                  px: 1,
                  py: 0.5,
                  bgcolor: "success.lighter",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "success.main"
                }}
              >
                <MdCheckCircle size={16} color="green" />
                <Typography variant="caption" fontWeight={600} color="success.main">
                  Oldindan: ${prepaidBalance.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>
          {remainingDebt > 0 && (contractId || debtorId) && (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handlePayAll}
              disabled={payments.some((p) => p.status === "PENDING")}
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem' },
                px: { xs: 1.5, sm: 2, md: 2.5 },
                py: { xs: 0.75, sm: 1, md: 1 },
                whiteSpace: 'nowrap',
                minWidth: 'auto'
              }}
            >
              Barchasini to'lash ({remainingDebt.toLocaleString()} $)
            </Button>
          )}
        </Box>

        <TableContainer sx={{ maxHeight: "60vh", overflowX: "auto" }}>
          <Table
            size="small"
            stickyHeader
            sx={{ minWidth: "100%", width: "100%" }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: 1,
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: 1,
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Belgilangan sana
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: 1,
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  To'langan sana
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: 1,
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Summa
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: 1,
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  To&apos;langan
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: 1,
                    px: { xs: 0.5, sm: 1, md: 2 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Holat
                </TableCell>
                {!readOnly && (contractId || debtorId) && (
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      bgcolor: "grey.50",
                      py: 1,
                      px: { xs: 0.5, sm: 1, md: 2 },
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Amal
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                let previousExcess = 0; // Oldingi oydan kelgan ortiqcha summa

                // ✅ To'lovlarni confirmedAt bo'yicha tartiblash (haqiqatda qachon to'langan)
                const sortedPayments = [...payments].sort((a, b) => {
                  const dateA = a.confirmedAt
                    ? new Date(a.confirmedAt)
                    : new Date(a.date);
                  const dateB = b.confirmedAt
                    ? new Date(b.confirmedAt)
                    : new Date(b.date);

                  // Agar confirmedAt bir xil bo'lsa, date bo'yicha tartiblash
                  if (dateA.getTime() === dateB.getTime()) {
                    return (
                      new Date(a.date as string).getTime() - new Date(b.date as string).getTime()
                    );
                  }

                  return dateA.getTime() - dateB.getTime();
                });

                // Oylik to'lovlarni ajratish (initial to'lovni chiqarib tashlash)
                const monthlyPayments = sortedPayments.filter(
                  (p) => p.paymentType !== "initial" && p.isPaid
                );

                return schedule.map((item, _index) => { // Changed index to _index
                  const isPast = new Date(item.date) < today;

                  // ✅ PENDING to'lov borligini tekshirish - JUDA MUHIM!
                  // Bu button'ni disable qiladi va qayta-qayta to'lovni oldini oladi
                  const finalPendingCheck = payments.some((p) => {
                    // PENDING statusda bo'lgan va bu oyga tegishli to'lovni tekshirish
                    return p.status === 'PENDING' && p.targetMonth === item.month;
                  });
                  
                  // 🔍 DEBUG: Log qilish
                  if (item.month <= 3) {
                    console.log(`🔍 [PaymentSchedule] Month ${item.month}:`, {
                      finalPendingCheck,
                      buttonWillBeDisabled: finalPendingCheck,
                      pendingForThisMonth: payments.filter(p => p.status === 'PENDING' && p.targetMonth === item.month).map(p => ({
                        _id: p._id,
                        status: p.status,
                        targetMonth: p.targetMonth,
                        amount: p.amount
                      }))
                    });
                  }

                  // Haqiqiy to'lov ma'lumotlarini topish
                  let actualPayment;

                  if (item.isInitial) {
                    // Boshlang'ich to'lov uchun
                    actualPayment = payments.find(
                      (p) => p.paymentType === "initial" && p.isPaid
                    );
                  } else {
                    // Oylik to'lovlar uchun - index bo'yicha topish (0-indexed)
                    // item.month 1 dan boshlanadi, shuning uchun -1 qilamiz
                    actualPayment = monthlyPayments[item.month - 1];
                  }

                  // Ortiqcha va kam to'langan summalarni tekshirish
                  const hasExcess =
                    actualPayment?.excessAmount != null &&
                    actualPayment.excessAmount > 0.01;

                  // ✅ KAM TO'LANGAN SUMMANI TEKSHIRISH (FIXED - ESKI TO'LOVLAR UCHUN HAM)
                  let remainingAmountToShow = 0;
                  let hasShortage = false;

                  // ✅ TUZATISH: Bot'da PENDING to'lovlarni ham hisoblash
                  // isPaid false bo'lsa ham, actualAmount mavjud bo'lishi mumkin
                  if (actualPayment && (item.isPaid || actualPayment.status === 'PENDING')) {
                    // PRIORITY 1: remainingAmount (backend'dan to'g'ridan-to'g'ri)
                    if (
                      actualPayment.remainingAmount != null &&
                      actualPayment.remainingAmount > 0.01
                    ) {
                      remainingAmountToShow = actualPayment.remainingAmount;
                      hasShortage = true;
                    }
                    // PRIORITY 2: actualAmount mavjud va expectedAmount'dan kam
                    else if (
                      actualPayment.actualAmount != null &&
                      actualPayment.actualAmount !== undefined
                    ) {
                      const expected =
                        actualPayment.expectedAmount ||
                        actualPayment.amount ||
                        item.amount;
                      const actual = actualPayment.actualAmount;
                      const diff = expected - actual;

                      if (diff > 0.01) {
                        remainingAmountToShow = diff;
                        hasShortage = true;
                      }
                    }
                    // PRIORITY 3: Status UNDERPAID
                    else if (actualPayment.status === "UNDERPAID") {
                      const expected =
                        actualPayment.expectedAmount ||
                        actualPayment.amount ||
                        item.amount;
                      const actual = actualPayment.amount;
                      const diff = expected - actual;

                      if (diff > 0.01) {
                        remainingAmountToShow = diff;
                        hasShortage = true;
                      }
                    }
                    // PRIORITY 4: ESKI TO'LOVLAR UCHUN - amount'ni tekshirish
                    // Agar actualAmount undefined bo'lsa, bu eski to'lov
                    // Eski to'lovlarda amount = actualAmount deb hisoblaymiz
                    // Agar amount < item.amount bo'lsa, kam to'langan
                    else if (
                      actualPayment.actualAmount === undefined ||
                      actualPayment.actualAmount === null
                    ) {
                      const expected = item.amount; // Oylik to'lov
                      const actual = actualPayment.amount; // Haqiqatda to'langan (eski to'lovlarda)
                      const diff = expected - actual;

                      if (diff > 0.01) {
                        remainingAmountToShow = diff;
                        hasShortage = true;
                      }
                    }
                  }

                  // ✅ HAQIQIY TO'LANGAN SUMMA
                  let actualPaidAmount = 0;
                  // ✅ TUZATISH: Bot'da PENDING to'lovlarni ham ko'rsatish
                  if ((item.isPaid || actualPayment?.status === 'PENDING') && actualPayment) {
                    // ✅ TUZATISH #10: Har doim actualAmount ishlatish (Web bilan uyg'un)
                    // actualAmount - haqiqatda to'langan summa (120$, 190$ emas)
                    actualPaidAmount = actualPayment.actualAmount || actualPayment.amount || 0;
                  }

                  // Kechikish kunlarini hisoblash
                  let delayDays = 0;
                  if (actualPayment && item.isPaid) {
                    const scheduledDate = new Date(item.date);
                    const paidDate = new Date(actualPayment.date as string);
                    delayDays = Math.floor(
                      (paidDate.getTime() - scheduledDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                  }

                  // KASKAD LOGIKA - Serverdan kelgan ma'lumotlarni ishlatish
                  const fromPreviousMonth = previousExcess; // Oldingi oydan kelgan
                  const monthlyPaymentAmount = item.amount; // Oylik to'lov

                  // Agar actualPayment mavjud bo'lsa, serverdan kelgan expectedAmount ni ishlatamiz
                  const needToPay = actualPayment?.expectedAmount
                    ? actualPayment.expectedAmount
                    : Math.max(0, monthlyPaymentAmount - fromPreviousMonth); // To'lash kerak

                  const actuallyPaid = actualPaidAmount; // To'langan

                  // Ortiqcha/Kam summani hisoblash
                  let toNextMonth = 0;
                  // No longer need a separate 'shortage' variable here as remainingAmountToShow handles it
                  // let shortage = 0; 

                  if (item.isPaid && actualPayment) {
                    // Serverdan kelgan ma'lumotlarni ishlatish
                    if (
                      actualPayment.excessAmount &&
                      actualPayment.excessAmount > 0.01
                    ) {
                      toNextMonth = actualPayment.excessAmount;
                    } else if (
                      actualPayment.remainingAmount &&
                      actualPayment.remainingAmount > 0.01
                    ) {
                      // shortage = actualPayment.remainingAmount; // Handled by remainingAmountToShow
                    } else {
                      // Agar server ma'lumoti bo'lmasa, o'zimiz hisoblash
                      const diff = actuallyPaid - needToPay;
                      if (diff > 0.01) {
                        toNextMonth = diff;
                      } else if (diff < -0.01) {
                        // shortage = Math.abs(diff); // Handled by remainingAmountToShow
                      }
                    }
                  }

                  // Keyingi oy uchun previousExcess ni yangilash
                  if (item.isPaid) {
                    previousExcess = toNextMonth;
                  } else {
                    previousExcess = 0; // Agar to'lanmagan bo'lsa, kaskad to'xtaydi
                  }

                  return (
                    <React.Fragment key={`payment-${item.month}`}>
                      <TableRow
                        sx={{
                          bgcolor: item.isPaid
                            ? "success.lighter"
                            : isPast && !item.isPaid
                              ? "error.lighter"
                              : "inherit",
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          "&:hover": {
                            bgcolor: item.isPaid
                              ? "success.light"
                              : isPast && !item.isPaid
                                ? "error.light"
                                : "grey.100",
                          },
                          "&:last-child": {
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          },
                        }}
                      >
                        {/* # */}
                        <TableCell
                          sx={{
                            py: 1,
                            px: { xs: 0.5, sm: 1, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {isPast && !item.isPaid && (
                              <MdWarning
                                size={16}
                                color="#d32f2f"
                              />
                            )}
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
                              color={
                                isPast && !item.isPaid
                                  ? "error.main"
                                  : "inherit"
                              }
                            >
                              {item.isInitial
                                ? "Boshlang'ich"
                                : `${item.month}-oy`}
                              {isPast && !item.isPaid && " (Kechikkan)"}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Belgilangan sana */}
                        <TableCell
                          sx={{
                            py: 1,
                            px: { xs: 0.5, sm: 1, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
                          >
                            {format(new Date(item.date), "dd.MM.yyyy")}
                          </Typography>
                        </TableCell>

                        {/* To'langan sana */}
                        <TableCell
                          sx={{
                            py: 1,
                            px: { xs: 0.5, sm: 1, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {item.isPaid ? (
                            <Typography
                              variant="body2"
                              fontSize="0.875rem"
                              color={
                                delayDays > 0 ? "error.main" : "success.main"
                              }
                            >
                              {item.isInitial
                                ? format(new Date(item.date), "dd.MM.yyyy")
                                : actualPayment && actualPayment.confirmedAt
                                  ? format(
                                      new Date(actualPayment.confirmedAt as string),
                                      "dd.MM.yyyy"
                                    )
                                  : actualPayment
                                    ? format(
                                        new Date(actualPayment.date as string),
                                        "dd.MM.yyyy"
                                      )
                                    : format(new Date(item.date), "dd.MM.yyyy")}
                              {!item.isInitial &&
                                delayDays > 0 &&
                                ` (+${delayDays})`}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>

                        {/* Summa - Oylik to'lov (har doim bir xil) */}
                        <TableCell
                          align="right"
                          sx={{
                            py: 1,
                            px: { xs: 0.5, sm: 1, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
                          >
                            {item.amount.toLocaleString()} $
                          </Typography>
                        </TableCell>

                        {/* To'langan */}
                        <TableCell
                          align="right"
                          sx={{
                            py: 1,
                            px: { xs: 0.5, sm: 1, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {item.isPaid ? (
                            <Box>
                              <Box display="flex" alignItems="center" gap={0.5} justifyContent="flex-end">
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  color="success.main"
                                >
                                  {actualPaidAmount.toLocaleString()} $
                                </Typography>
                                {/* ✅ YANGI: Status Badge */}
                                {actualPayment?.status && (
                                  <StatusBadge status={actualPayment.status} size="small" />
                                )}
                              </Box>
                              {hasShortage && remainingAmountToShow > 0.01 && (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    bgcolor: "error.lighter",
                                    borderRadius: 1,
                                  }}
                                >
                                  <MdArrowDownward
                                    size={14}
                                    color="#d32f2f"
                                  />
                                  <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    color="error.main"
                                  >
                                    {remainingAmountToShow.toLocaleString()} $
                                    kam
                                  </Typography>
                                </Box>
                              )}
                              {hasExcess && actualPayment?.excessAmount && (
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    bgcolor: "info.lighter",
                                    borderRadius: 1,
                                  }}
                                >
                                  <MdArrowUpward
                                    size={14}
                                    color="#0288d1"
                                  />
                                  <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    color="info.main"
                                  >
                                    {actualPayment.excessAmount.toLocaleString()}{" "}
                                    $ ortiqcha
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              —
                            </Typography>
                          )}
                        </TableCell>

                        {/* Holat */}
                        <TableCell
                          align="center"
                          sx={{
                            py: 1,
                            px: { xs: 0.5, sm: 1, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          <Chip
                            label={
                              item.isPaid
                                ? "Paid"
                                : isPast
                                  ? "Kechikkan"
                                  : "Kutilmoqda"
                            }
                            color={
                              item.isPaid
                                ? "success"
                                : isPast
                                  ? "error"
                                  : "default"
                            }
                            size="small"
                            sx={{
                              minWidth: { xs: "auto", sm: 90 },
                              fontSize: { xs: "0.65rem", sm: "0.75rem" },
                              height: { xs: 24, sm: 32 },
                            }}
                          />
                        </TableCell>

                        {/* Amal */}
                        {!readOnly && (contractId || debtorId) && (
                          <TableCell
                            align="center"
                            sx={{
                              py: 1,
                              px: { xs: 0.5, sm: 1, md: 2 },
                              borderBottom: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {!item.isPaid ? (
                              <Box display="flex" flexDirection="column" gap={0.5}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color={isPast ? "error" : "primary"}
                                  onClick={() => handlePayment(item.amount, undefined, item.month)}
                                  disabled={finalPendingCheck}
                                  startIcon={finalPendingCheck ? undefined : <MdPayment size={16} />}
                                  sx={{
                                    fontSize: { xs: "0.7rem", sm: "0.8125rem", md: "0.75rem" },
                                    px: { xs: 1, sm: 2, md: 1.5 },
                                    py: { xs: 0.5, sm: 0.75, md: 0.5 },
                                    whiteSpace: "nowrap",
                                    minWidth: { xs: 'auto', md: '120px' },
                                    maxHeight: { md: '32px' }
                                  }}
                                >
                                  {finalPendingCheck ? "⏳ Kutilmoqda..." : "To'lash"}
                                </Button>
                                
                                {/* ✅ ASOSIY: Kechiktirish tugmasi */}
                                {!item.isInitial && !finalPendingCheck && !readOnly && (
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    fullWidth
                                    onClick={() => {
                                      console.log('🕒 Kechiktirish tugmasi bosildi:', item);
                                      handlePostponePayment(item);
                                    }}
                                    startIcon={<MdWarning size={16} />}
                                    sx={{
                                      mt: 1,
                                      fontSize: "0.8rem",
                                      fontWeight: 700,
                                      minHeight: 40,
                                      textTransform: "none",
                                      backgroundColor: "#ff9800",
                                      color: "white",
                                      boxShadow: "0 2px 8px rgba(255, 152, 0, 0.3)",
                                      "&:hover": {
                                        backgroundColor: "#f57c00",
                                        boxShadow: "0 4px 12px rgba(255, 152, 0, 0.4)",
                                      },
                                    }}
                                  >
                                    🕒 KECHIKTIRISH
                                  </Button>
                                )}
                              </Box>
                            ) : hasShortage && remainingAmountToShow > 0.01 ? (
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                disabled={finalPendingCheck}
                                onClick={() => {
                                  if (!actualPayment?._id) {
                                    console.error("❌ Payment ID topilmadi!");
                                    alert(
                                      "Xatolik: To'lov ID topilmadi. Sahifani yangilang va qayta urinib ko'ring."
                                    );
                                    return;
                                  }

                                  handlePayment(
                                    remainingAmountToShow,
                                    actualPayment._id
                                );
                              }}
                              startIcon={finalPendingCheck ? undefined : <MdWarning size={16} />}
                              sx={{
                                animation: finalPendingCheck ? "none" : "pulse 2s infinite",
                                "@keyframes pulse": {
                                  "0%, 100%": { opacity: 1 },
                                  "50%": { opacity: 0.7 },
                                },
                                fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.7rem" },
                                px: { xs: 0.75, sm: 1.5, md: 1 },
                                py: { xs: 0.5, sm: 0.75, md: 0.5 },
                                whiteSpace: "nowrap",
                                minWidth: { xs: 'auto', md: '120px' },
                                maxHeight: { md: '32px' }
                              }}
                            >
                              {finalPendingCheck ? "⏳ Kutilmoqda..." : `Qarz (${remainingAmountToShow.toLocaleString()} $)`}
                            </Button>
                          ) : (
                            <Chip
                              label="To'langan"
                              color="success"
                              size="small"
                              icon={<MdCheckCircle size={16} />}
                              sx={{
                                fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                height: { xs: 24, sm: 32 },
                              }}
                            />
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                    </React.Fragment>
                  );
                });
              })()}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Xulosa - Ixcham */}
        <Box
          sx={{
            mt: 1.5,
            p: 1.5,
            bgcolor: "grey.50",
            borderRadius: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box display="flex" gap={3} flexWrap="wrap">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Umumiy
              </Typography>
              <Typography variant="body2" fontWeight="600">
                {(monthlyPayment * period + (initialPayment || 0)).toLocaleString()} $
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                To'langan
              </Typography>
              <Typography variant="body2" fontWeight="600" color="success.main">
                {totalPaid?.toLocaleString()} $
              </Typography>
            </Box>
            {remainingDebt && remainingDebt > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Qolgan
                </Typography>
                <Typography variant="body2" fontWeight="600" color="error.main">
                  {remainingDebt.toLocaleString()} $
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* To'lov modal */}
      {(contractId || debtorId) && customerId && (
        <PaymentModal
          open={paymentModal.open}
          amount={paymentModal.amount}
          contractId={contractId || debtorId || ""}
          isPayAll={paymentModal.isPayAll}
          paymentId={paymentModal.paymentId}
          onClose={() =>
            setPaymentModal({
              open: false,
              amount: 0,
              isPayAll: false,
              paymentId: undefined,
            })
          }
          onSuccess={handlePaymentSuccess}
          customerId={customerId}
          debtorId={debtorId}
          targetMonth={paymentModal.month}
        />
      )}

      {/* ✅ YANGI: To'lovni kechiktirish dialog */}
      {postponeDialog.open && postponeDialog.payment && (
        <PaymentPostponeDialog
          open={postponeDialog.open}
          onClose={handlePostponeClose}
          onConfirm={handlePostponeConfirm}
          payment={{
            amount: postponeDialog.payment.amount,
            date: postponeDialog.payment.date.toString(),
            isPostponedOnce: false, // Bu backend'dan kelishi kerak
          }}
          loading={postponeDialog.loading}
        />
      )}
    </>
  );
};

export default PaymentSchedule;