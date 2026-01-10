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
import {
  MdCheckCircle,
  MdWarning,
  MdPayment,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";

import PaymentModal from "../PaymentModal/PaymentModal";
import { IPayment } from "../../types/IPayment"; // Import the IPayment interface
import { StatusBadge } from "./StatusBadge";
import { borderRadius, shadows } from "../../theme/colors";
import { CalendarDays } from "lucide-react";

interface PaymentScheduleItem {
  month: number;
  date: string;
  amount: number;
  isPaid: boolean;
  isInitial?: boolean;
}

interface PaymentScheduleProps {
  startDate: string;
  nextPaymentDate?: string; // ✅ YANGI: Birinchi oylik to'lov sanasi
  monthlyPayment: number;
  period: number;
  initialPayment?: number;
  initialPaymentDueDate?: string;
  contractId?: string;
  debtorId?: string; // Specific to nasiya-bot
  customerId?: string; // Specific to nasiya-bot
  remainingDebt?: number;
  totalPaid?: number;
  prepaidBalance?: number;
  payments?: IPayment[]; // Use the imported IPayment interface
  onPaymentSuccess?: () => void;
  readOnly?: boolean;
}

const PaymentSchedule: FC<PaymentScheduleProps> = ({
  startDate,
  nextPaymentDate,
  monthlyPayment,
  period,
  initialPayment = 0,
  contractId,
  remainingDebt = 0,
  totalPaid = 0,
  prepaidBalance = 0,
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


  const generateSchedule = (): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const start = new Date(startDate);

    const initialPaymentRecord = payments.find(
      (p) => p.paymentType === "initial" && p.isPaid
    );
    const isInitialPaid = !!initialPaymentRecord;

    // ✅ TUZATISH: Boshlang'ich to'lov = startDate (shartnoma tuzilgan kun)
    if (initialPayment > 0) {
      schedule.push({
        month: 0,
        date: format(start, "yyyy-MM-dd"),
        amount: initialPayment,
        isPaid: isInitialPaid,
        isInitial: true,
      });
    }

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
          return (
            new Date(a.date as string).getTime() -
            new Date(b.date as string).getTime()
          );
        }

        return dateA.getTime() - dateB.getTime();
      });

    // ✅ TUZATISH: nextPaymentDate dan boshlab oylar qo'shamiz
    // startDate emas, nextPaymentDate - bu birinchi oylik to'lov sanasi
    const firstMonthlyPaymentDate = nextPaymentDate ? new Date(nextPaymentDate) : addMonths(start, 1);

    // Oylik to'lovlarni qo'shish
    for (let i = 1; i <= period; i++) {
      // ✅ TUZATILDI: nextPaymentDate dan (i-1) oy qo'shish
      // i=1 -> nextPaymentDate (birinchi oy)
      // i=2 -> nextPaymentDate + 1 oy (ikkinchi oy)
      const paymentDate = addMonths(firstMonthlyPaymentDate, i - 1);

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

  const handlePayment = (
    amount: number,
    paymentId?: string,
    month?: number
  ) => {
    if (!contractId && !debtorId) {
      alert("Xatolik: Shartnoma ID topilmadi");
      return;
    }

    if (!customerId) {
      alert("Xatolik: Mijoz ID topilmadi");
      return;
    }

    if (month) {
      const hasPending = payments.some(
        (p) => p.status === "PENDING" && p.targetMonth === month
      );
      if (hasPending) {
        alert(
          "Bu oy uchun to'lov allaqachon kutilmoqda. Kassa tasdiqini kuting."
        );
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

    const hasPendingPayments = payments.some((p) => p.status === "PENDING");
    if (hasPendingPayments) {
      alert("To'lovlar kutilmoqda. Kassa tasdiqini kuting.");
      return;
    }

    setPaymentModal({ open: true, amount: remainingDebt || 0, isPayAll: true });
  };

  const handlePaymentSuccess = () => {
    setPaymentModal({
      open: false,
      amount: 0,
      isPayAll: false,
      paymentId: undefined,
      month: undefined,
    });

    setTimeout(() => {
      if (onPaymentSuccess) {
        onPaymentSuccess();
      } else {
        console.warn(" onPaymentSuccess callback not provided");
      }
    }, 500); // 500ms kutamiz - backend payment yaratguncha
  };


  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, sm: 1.5, md: 2 },
          border: 1,
          borderColor: "divider",
          borderRadius: borderRadius.md,
          boxShadow: shadows.sm,
        }}
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
                  borderColor: "success.main",
                }}
              >
                <MdCheckCircle size={16} color="green" />
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="success.main"
                >
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
                fontSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem" },
                px: { xs: 1.5, sm: 2, md: 2.5 },
                py: { xs: 0.75, sm: 1, md: 1 },
                whiteSpace: "nowrap",
                minWidth: "auto",
              }}
            >
              Barchasini to'lash ({remainingDebt.toLocaleString()} $)
            </Button>
          )}
        </Box>

        <TableContainer
          sx={{
            overflowX: "auto",
            overflowY: "visible",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              height: { xs: "4px", sm: "6px" },
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.3)",
              },
            },
          }}
        >
          <Table
            size="small"
            sx={{ minWidth: { xs: "600px", sm: "700px", md: "100%" }, width: "100%" }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
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
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Belgilangan
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  To'langan
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
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
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  To'landi
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    bgcolor: "grey.50",
                    py: { xs: 0.75, sm: 1 },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
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
                      py: { xs: 0.75, sm: 1 },
                      px: { xs: 1, sm: 1.5, md: 2 },
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
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
                let previousExcess = 0;

                const sortedPayments = [...payments].sort((a, b) => {
                  const dateA = a.confirmedAt
                    ? new Date(a.confirmedAt)
                    : new Date(a.date);
                  const dateB = b.confirmedAt
                    ? new Date(b.confirmedAt)
                    : new Date(b.date);

                  if (dateA.getTime() === dateB.getTime()) {
                    return (
                      new Date(a.date as string).getTime() -
                      new Date(b.date as string).getTime()
                    );
                  }

                  return dateA.getTime() - dateB.getTime();
                });

                const monthlyPayments = sortedPayments.filter(
                  (p) => p.paymentType !== "initial" && p.isPaid
                );

                return schedule.map((item, _index) => {
                  // Changed index to _index
                  const isPast = new Date(item.date) < today;

                  const finalPendingCheck = payments.some((p) => {
                    return (
                      p.status === "PENDING" && p.targetMonth === item.month
                    );
                  });

                  let actualPayment;

                  if (item.isInitial) {
                    // Boshlang'ich to'lov uchun
                    actualPayment = payments.find(
                      (p) => p.paymentType === "initial" && p.isPaid
                    );
                  } else {
                    actualPayment = monthlyPayments[item.month - 1];
                  }

                  // Ortiqcha va kam to'langan summalarni tekshirish
                  const hasExcess =
                    actualPayment?.excessAmount != null &&
                    actualPayment.excessAmount > 0.01;

                  let remainingAmountToShow = 0;
                  let hasShortage = false;

                  if (
                    actualPayment &&
                    (item.isPaid || actualPayment.status === "PENDING")
                  ) {
                    if (
                      actualPayment.remainingAmount != null &&
                      actualPayment.remainingAmount > 0.01
                    ) {
                      remainingAmountToShow = actualPayment.remainingAmount;
                      hasShortage = true;
                    } else if (
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
                    } else if (
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

                  let actualPaidAmount = 0;
                  if (
                    (item.isPaid || actualPayment?.status === "PENDING") &&
                    actualPayment
                  ) {
                    actualPaidAmount =
                      actualPayment.actualAmount || actualPayment.amount || 0;
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

                  const fromPreviousMonth = previousExcess; // Oldingi oydan kelgan
                  const monthlyPaymentAmount = item.amount; // Oylik to'lov

                  const needToPay = actualPayment?.expectedAmount
                    ? actualPayment.expectedAmount
                    : Math.max(0, monthlyPaymentAmount - fromPreviousMonth); // To'lash kerak

                  const actuallyPaid = actualPaidAmount; // To'langan

                  let toNextMonth = 0;

                  if (item.isPaid && actualPayment) {
                    if (
                      actualPayment.excessAmount &&
                      actualPayment.excessAmount > 0.01
                    ) {
                      toNextMonth = actualPayment.excessAmount;
                    } else if (
                      actualPayment.remainingAmount &&
                      actualPayment.remainingAmount > 0.01
                    ) {
                    } else {
                      const diff = actuallyPaid - needToPay;
                      if (diff > 0.01) {
                        toNextMonth = diff;
                      } else if (diff < -0.01) {
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
                            py: { xs: 0.75, sm: 1 },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={0.5}>
                            {isPast && !item.isPaid && (
                              <MdWarning size={14} color="#d32f2f" />
                            )}
                            <Typography
                              variant="body2"
                              fontWeight="600"
                              fontSize={{ xs: "0.75rem", sm: "0.8rem", md: "0.875rem" }}
                              color={
                                isPast && !item.isPaid
                                  ? "error.main"
                                  : "inherit"
                              }
                            >
                              {item.isInitial ? "0" : item.month}
                              {isPast && !item.isPaid && (
                                <Box
                                  component="span"
                                  sx={{ display: { xs: "none", md: "inline" } }}
                                >
                                  {" (Kechikkan)"}
                                </Box>
                              )}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Belgilangan sana */}
                        <TableCell
                          sx={{
                            py: { xs: 0.75, sm: 1 },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontSize={{ xs: "0.7rem", sm: "0.75rem", md: "0.875rem" }}
                          >
                            {(() => {
                              try {
                                if (!item.date) return '-';
                                const d = new Date(item.date);
                                return isNaN(d.getTime()) ? '-' : format(d, "dd.MM");
                              } catch {
                                return '-';
                              }
                            })()}
                          </Typography>
                        </TableCell>

                        {/* To'langan sana */}
                        <TableCell
                          sx={{
                            py: { xs: 0.75, sm: 1 },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {item.isPaid ? (
                            <Typography
                              variant="body2"
                              fontSize={{ xs: "0.7rem", sm: "0.75rem", md: "0.875rem" }}
                              color={
                                delayDays > 0 ? "error.main" : "success.main"
                              }
                            >
                              {actualPayment && actualPayment.confirmedAt
                                ? format(
                                    new Date(
                                      actualPayment.confirmedAt as string
                                    ),
                                    "dd.MM"
                                  )
                                : actualPayment
                                ? format(
                                    new Date(actualPayment.date as string),
                                    "dd.MM"
                                  )
                                : (() => {
                                    try {
                                      if (!item.date) return '-';
                                      const d = new Date(item.date);
                                      return isNaN(d.getTime()) ? '-' : format(d, "dd.MM");
                                    } catch {
                                      return '-';
                                    }
                                  })()}
                              {!item.isInitial &&
                                delayDays > 0 &&
                                ` (+${delayDays})`}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.disabled" fontSize={{ xs: "0.7rem", sm: "0.875rem" }}>
                              —
                            </Typography>
                          )}
                        </TableCell>

                        {/* Summa - Oylik to'lov (har doim bir xil) */}
                        <TableCell
                          align="right"
                          sx={{
                            py: { xs: 0.75, sm: 1 },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            fontSize={{ xs: "0.7rem", sm: "0.75rem", md: "0.875rem" }}
                          >
                            {item.amount.toLocaleString()}
                          </Typography>
                        </TableCell>

                        {/* To'langan */}
                        <TableCell
                          align="right"
                          sx={{
                            py: { xs: 0.75, sm: 1 },
                            px: { xs: 1, sm: 1.5, md: 2 },
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          {item.isPaid ? (
                            <Box>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={0.5}
                                justifyContent="flex-end"
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  color="success.main"
                                >
                                  {actualPaidAmount.toLocaleString()} $
                                </Typography>
                                {actualPayment?.status && (
                                  <StatusBadge
                                    status={actualPayment.status}
                                    size="small"
                                  />
                                )}
                              </Box>
                              {hasShortage && remainingAmountToShow > 0.01 && (
                                <Box sx={{ mt: 0.5 }}>
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 0.5,
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
                                  {actualPayment?.nextPaymentDate && (
                                    <Box
                                      sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        mt: 0.5,
                                        px: 1,
                                        py: 0.25,
                                        bgcolor: "warning.lighter",
                                        borderRadius: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        fontWeight="600"
                                        color="warning.dark"
                                      >
                                        <CalendarDays />{" "}
                                        {format(
                                          new Date(
                                            actualPayment.nextPaymentDate
                                          ),
                                          "dd.MM.yyyy"
                                        )}
                                      </Typography>
                                    </Box>
                                  )}
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
                                  <MdArrowUpward size={14} color="#0288d1" />
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
                            {finalPendingCheck ? (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                —
                              </Typography>
                            ) : !item.isPaid ? (
                              <Button
                                size="small"
                                variant="contained"
                                color={isPast ? "error" : "primary"}
                                onClick={() =>
                                  handlePayment(
                                    item.amount,
                                    undefined,
                                    item.month
                                  )
                                }
                                startIcon={<MdPayment size={16} />}
                                sx={{
                                  fontSize: {
                                    xs: "0.7rem",
                                    sm: "0.8125rem",
                                    md: "0.875rem",
                                  },
                                  px: { xs: 1.5, sm: 2, md: 2.5 },
                                  py: { xs: 0.75, sm: 1, md: 1 },
                                  whiteSpace: "nowrap",
                                  minWidth: { xs: "80px", md: "120px" },
                                }}
                              >
                                To'lash
                              </Button>
                            ) : hasShortage &&
                              remainingAmountToShow > 0.01 &&
                              !finalPendingCheck ? (
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={() => {
                                  if (!actualPayment?._id) {
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
                                startIcon={<MdWarning size={16} />}
                                sx={{
                                  animation: "pulse 2s infinite",
                                  "@keyframes pulse": {
                                    "0%, 100%": { opacity: 1 },
                                    "50%": { opacity: 0.7 },
                                  },
                                  fontSize: {
                                    xs: "0.65rem",
                                    sm: "0.75rem",
                                    md: "0.7rem",
                                  },
                                  px: { xs: 0.75, sm: 1.5, md: 1 },
                                  py: { xs: 0.5, sm: 0.75, md: 0.5 },
                                  whiteSpace: "nowrap",
                                  minWidth: { xs: "auto", md: "120px" },
                                  maxHeight: { md: "32px" },
                                }}
                              >
                                {`Qarz (${remainingAmountToShow.toLocaleString()} $)`}
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
                {(
                  monthlyPayment * period +
                  (initialPayment || 0)
                ).toLocaleString()}{" "}
                $
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

    </>
  );
};

export default PaymentSchedule;
