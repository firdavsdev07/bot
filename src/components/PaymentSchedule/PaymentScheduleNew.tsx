import { FC, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Button,
  Typography,
  Stack,
  Collapse,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { format, addMonths } from "date-fns";
import {
  MdCheckCircle,
  MdPayment,
  MdArrowDownward,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { AlertCircle, Clock } from "lucide-react";
import { useAlert } from "../AlertSystem";
import PaymentModal from "../PaymentModal/PaymentModal";
import { IPayment } from "../../types/IPayment";
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
  debtorId?: string;
  customerId?: string;
  remainingDebt?: number;
  totalPaid?: number;
  prepaidBalance?: number;
  payments?: IPayment[];
  onPaymentSuccess?: () => void;
  readOnly?: boolean;
  nextPaymentDate?: string; // ✅ YANGI: Kechiktirilgan to'lov sanasi
}

const PaymentScheduleNew: FC<PaymentScheduleProps> = ({
  startDate,
  monthlyPayment,
  period,
  initialPayment = 0,
  initialPaymentDueDate,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const { showError, showWarning } = useAlert();
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    amount: number;
    isPayAll?: boolean;
    paymentId?: string;
    month?: number;
    isDebtPayment?: boolean; // ✅ YANGI: Qarz to'lovi flag'i
    originalAmount?: number; // ✅ YANGI: Asosiy oylik to'lov miqdori
  }>({
    open: false,
    amount: 0,
    isPayAll: false,
    paymentId: undefined,
    month: undefined,
    isDebtPayment: false,
    originalAmount: undefined,
  });


  // To'lov jadvalini yaratish
  const generateSchedule = (): PaymentScheduleItem[] => {
    const schedule: PaymentScheduleItem[] = [];
    const start = new Date(startDate);

    const initialPaymentRecord = payments.find(
      (p) => p.paymentType === "initial" && p.isPaid
    );
    const isInitialPaid = !!initialPaymentRecord;

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

    const monthlyPayments = payments
      .filter((p) => p.paymentType !== "initial" && p.isPaid)
      .sort((a, b) => {
        const dateA = a.confirmedAt ? new Date(a.confirmedAt) : new Date(a.date);
        const dateB = b.confirmedAt ? new Date(b.confirmedAt) : new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          return new Date(a.date as string).getTime() - new Date(b.date as string).getTime();
        }
        return dateA.getTime() - dateB.getTime();
      });

    for (let i = 1; i <= period; i++) {
      const paymentDate = addMonths(start, i);
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
  const paidCount = schedule.filter((s) => s.isPaid).length;
  const progress = (paidCount / schedule.length) * 100;

  const handlePayment = (amount: number, paymentId?: string, month?: number, isDebtPayment = false, originalAmount?: number) => {
    if (!contractId && !debtorId) {
      alert("Xatolik: Shartnoma ID topilmadi");
      return;
    }
    if (!customerId) {
      alert("Xatolik: Mijoz ID topilmadi");
      return;
    }
    
    // ✅ MUHIM: PENDING tekshiruvi - modal ochishdan oldin
    if (month) {
      const hasPending = payments.some(
        (p) => p.status === "PENDING" && p.targetMonth === month
      );
      
      if (hasPending) {
        console.warn(`⚠️ Month ${month} uchun PENDING to'lov mavjud, qayta yuborib bo'lmaydi!`);
        showWarning("Bu oy uchun to'lov allaqachon kutilmoqda. Kassa tasdiqini kuting.", "Kutilmoqda");
        return;
      }
    }
    
    setPaymentModal({ open: true, amount, paymentId, month, isDebtPayment, originalAmount });
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
    
    setPaymentModal({
      open: false,
      amount: 0,
      isPayAll: false,
      paymentId: undefined,
      month: undefined,
      isDebtPayment: false,
      originalAmount: undefined,
    });
    
    // ✅ MUHIM: Backend payment yaratishi uchun biroz kutamiz
    // Bu PENDING statusni to'g'ri ko'rsatish uchun zarur
    setTimeout(() => {
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }, 500); // 500ms kutamiz - backend payment yaratguncha
  };

  const toggleExpand = (month: number) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  // ✅ TUZATILDI: To'lovni kechiktirish funksiyasi

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight={700}>
              To'lov jadvali
            </Typography>
            <Chip
              label={`${paidCount}/${schedule.length}`}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 700,
              }}
            />
          </Stack>
          
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.2)",
              "& .MuiLinearProgress-bar": {
                bgcolor: "success.light",
                borderRadius: 4,
              },
            }}
          />
          
          <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.9 }}>
            {progress.toFixed(0)}% bajarildi
          </Typography>

          {prepaidBalance > 0 && (
            <Box
              sx={{
                mt: 1.5,
                p: 1,
                bgcolor: "rgba(76, 175, 80, 0.2)",
                borderRadius: 1,
                border: "1px solid rgba(76, 175, 80, 0.5)",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <MdCheckCircle size={16} />
                <Typography variant="caption" fontWeight={600}>
                  Oldindan to'langan: ${prepaidBalance.toFixed(2)}
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Summary Stats */}
        <Box
          sx={{
            p: 2,
            bgcolor: "grey.50",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary" display="block">
              Umumiy
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              ${(monthlyPayment * period + (initialPayment || 0)).toLocaleString()}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary" display="block">
              To'langan
            </Typography>
            <Typography variant="body2" fontWeight={700} color="success.main">
              ${totalPaid?.toLocaleString()}
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary" display="block">
              Qolgan
            </Typography>
            <Typography variant="body2" fontWeight={700} color="error.main">
              ${remainingDebt?.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Pay All Button */}
        {remainingDebt > 0 && (contractId || debtorId) && !readOnly && (
          <Box sx={{ p: 2, pt: 0, bgcolor: "grey.50" }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              size="large"
              onClick={handlePayAll}
              disabled={payments.some((p) => p.status === "PENDING")}
              startIcon={<MdPayment size={20} />}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              Barchasini to'lash (${remainingDebt.toLocaleString()})
            </Button>
          </Box>
        )}

        {/* Payment Table */}
        <TableContainer sx={{ maxHeight: isMobile ? "40vh" : "60vh" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: { xs: 0.5, sm: 1 }, fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" } }}>
                  {isMobile ? "Oy" : "To'lov"}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, py: { xs: 0.5, sm: 1 }, fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" } }}>
                  {isMobile ? "Sana" : "Muddat"}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, py: { xs: 0.5, sm: 1 }, fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" } }}>
                  Summa
                </TableCell>
                {!isMobile && (
                  <TableCell sx={{ fontWeight: 700, py: { xs: 0.5, sm: 1 }, fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" } }}>
                    Holat
                  </TableCell>
                )}
                <TableCell sx={{ fontWeight: 700, py: { xs: 0.5, sm: 1 }, fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" } }} align="right">
                  Amal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map((item) => {
            const isPast = new Date(item.date) < today;
            const isExpanded = expandedMonth === item.month;

            // Payment details
            const monthlyPayments = payments
              .filter((p) => p.paymentType !== "initial" && p.isPaid)
              .sort((a, b) => {
                const dateA = a.confirmedAt ? new Date(a.confirmedAt) : new Date(a.date);
                const dateB = b.confirmedAt ? new Date(b.confirmedAt) : new Date(b.date);
                return dateA.getTime() - dateB.getTime();
              });

            let actualPayment;
            if (item.isInitial) {
              actualPayment = payments.find((p) => p.paymentType === "initial" && p.isPaid);
            } else {
              actualPayment = monthlyPayments[item.month - 1];
            }

            // ✅ PENDING payment check - o'sha oyga to'lov kutilmoqda
            const hasPendingPayment = payments.some(
              (p) => p.status === "PENDING" && p.targetMonth === item.month
            );

            // ✅ REJECTED payment check - rad etilgan to'lov (yana to'lash mumkin)
            const hasRejectedPayment = payments.some(
              (p) => p.status === "REJECTED" && p.targetMonth === item.month
            );

            console.log(`🔍 [PaymentScheduleNew] Month ${item.month}:`, {
              hasPendingPayment,
              hasRejectedPayment,
              buttonWillBeDisabled: hasPendingPayment,
              totalPayments: payments.length,
              pendingPaymentsAll: payments.filter(p => p.status === "PENDING").map(p => ({
                _id: p._id,
                targetMonth: p.targetMonth,
                status: p.status,
                amount: p.amount,
              })),
              thisMonthPayments: payments.filter(p => p.targetMonth === item.month).map(p => ({
                _id: p._id,
                status: p.status,
                isPaid: p.isPaid,
                amount: p.amount,
              })),
            });

            const hasShortage =
              actualPayment?.remainingAmount != null && actualPayment.remainingAmount > 0.01;
            // const hasExcess = false;
              // actualPayment?.excessAmount != null && actualPayment.excessAmount > 0.01;

            // ✅ TUZATISH: To'langan summani to'g'ri aniqlash
            // 1. KAM to'lov (remainingAmount > 0): actualAmount ishlatish (60$)
            // 2. TO'LIQ yoki ORTIQCHA to'lov: amount ishlatish (140$ yoki 148$)
            let actualPaidAmount = 0;
            if (item.isPaid && actualPayment) {
              if (hasShortage && actualPayment.remainingAmount && actualPayment.remainingAmount > 0.01) {
                // ✅ KAM to'lov: haqiqatda to'langan summa
                actualPaidAmount = actualPayment.actualAmount || actualPayment.amount || 0;
              } else {
                // ✅ TO'LIQ/ORTIQCHA to'lov: kutilgan summa (amount)
                actualPaidAmount = actualPayment.amount || actualPayment.expectedAmount || 0;
              }
            }

            let delayDays = 0;
            if (actualPayment && item.isPaid) {
              const scheduledDate = new Date(item.date);
              const paidDate = new Date(actualPayment.date as string);
              delayDays = Math.floor(
                (paidDate.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24)
              );
            }

            return (
              <>
                {/* Main Table Row */}
                <TableRow 
                  key={`payment-${item.month}`}
                  hover
                  sx={{ 
                    cursor: "pointer",
                    bgcolor: item.isPaid ? "success.lighter" : 
                            isPast && !item.isPaid ? "error.lighter" : "inherit",
                    "&:hover": {
                      bgcolor: item.isPaid ? "success.light" : 
                              isPast && !item.isPaid ? "error.light" : "grey.50"
                    }
                  }}
                  onClick={() => toggleExpand(item.month)}
                >
                  {/* Month/Type Column */}
                  <TableCell sx={{ py: { xs: 0.75, sm: 1.5 } }}>
                    <Stack direction="row" alignItems="center" spacing={isMobile ? 0.5 : 1}>
                      {isPast && !item.isPaid && !isMobile && <AlertCircle size={16} color="#d32f2f" />}
                      {item.isPaid && !isMobile && <MdCheckCircle size={18} color="#2e7d32" />}
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={isPast && !item.isPaid ? "error.main" : "text.primary"}
                        sx={{ fontSize: { xs: "0.65rem", sm: "0.8rem", md: "0.875rem" } }}
                      >
                        {item.isInitial 
                          ? (isMobile ? "0" : "Boshlang'ich") 
                          : isMobile 
                            ? `${item.month}` 
                            : `${item.month}-oy`
                        }
                      </Typography>
                    </Stack>
                  </TableCell>
                  
                  {/* Date Column */}
                  <TableCell sx={{ py: { xs: 0.75, sm: 1.5 } }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.8rem" } }}
                    >
                      {format(new Date(item.date), isMobile ? "dd.MM" : "dd.MM.yyyy")}
                    </Typography>
                  </TableCell>
                  
                  {/* Amount Column */}
                  <TableCell sx={{ py: { xs: 0.75, sm: 1.5 } }}>
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.8rem", md: "0.875rem" } }}
                    >
                      ${item.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  
                  {/* Status Column (Desktop only) */}
                  {!isMobile && (
                    <TableCell sx={{ py: { xs: 0.75, sm: 1.5 } }}>
                      {actualPayment?.status ? (
                        <StatusBadge status={actualPayment.status} size="small" />
                      ) : (
                        <Chip
                          label={isPast && !item.isPaid ? "Kechikkan" : !item.isPaid ? "Kutilmoqda" : "To'langan"}
                          size="small"
                          color={isPast && !item.isPaid ? "error" : !item.isPaid ? "default" : "success"}
                          variant={!item.isPaid ? "outlined" : "filled"}
                          sx={{ 
                            fontSize: "0.65rem", 
                            height: 20,
                            minWidth: 60
                          }}
                        />
                      )}
                    </TableCell>
                  )}
                  
                  {/* Action Column */}
                  <TableCell sx={{ py: { xs: 0.75, sm: 1.5 } }} align="right">
                    <Stack direction="row" spacing={isMobile ? 0.25 : 0.5} justifyContent="flex-end" alignItems="center">
                      {!readOnly && (contractId || debtorId) && !item.isPaid && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color={isPast ? "error" : "primary"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePayment(item.amount, undefined, item.month);
                            }}
                            disabled={hasPendingPayment}
                            sx={{
                              minWidth: isMobile ? 35 : 60,
                              fontSize: { xs: "0.5rem", sm: "0.65rem", md: "0.7rem" },
                              py: { xs: 0.2, sm: 0.25 },
                              px: isMobile ? 0.4 : 1,
                              height: isMobile ? 24 : "auto",
                            }}
                          >
                            {hasPendingPayment ? (isMobile ? "⏳" : "Kutish") : "To'la"}
                          </Button>
                          
                        </>
                      )}
                      
                      {/* Qarz tugmasi - kam to'lov uchun */}
                      {!readOnly && (contractId || debtorId) && item.isPaid && hasShortage && actualPayment?.remainingAmount && actualPayment.remainingAmount > 0.01 && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          disabled={hasPendingPayment}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!actualPayment?._id) {
                              showError("To'lov ID topilmadi", "Xatolik");
                              return;
                            }
                            handlePayment(actualPayment.remainingAmount!, actualPayment._id, item.month, true, item.amount);
                          }}
                          sx={{
                            minWidth: isMobile ? 45 : 55,
                            fontSize: { xs: "0.55rem", sm: "0.6rem", md: "0.7rem" },
                            py: 0.25,
                          }}
                        >
                          Qarz
                        </Button>
                      )}
                      
                      {/* Pending/Success chip uchun */}
                      {hasPendingPayment && !isMobile && (
                        <Chip
                          icon={<Clock size={12} />}
                          label="Kutish"
                          size="small"
                          color="warning"
                          variant="outlined"
                          sx={{ 
                            fontSize: "0.65rem", 
                            height: 20,
                          }}
                        />
                      )}
                      
                      {item.isPaid && !hasShortage && (
                        <Chip
                          icon={<MdCheckCircle size={12} />}
                          label="OK"
                          size="small"
                          color="success"
                          sx={{ fontSize: "0.65rem", height: 20 }}
                        />
                      )}
                      
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleExpand(item.month); }}>
                        {isExpanded ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
                
                {/* Expanded Details Row */}
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={isMobile ? 4 : 5}>
                    <Collapse in={isExpanded}>
                      <Box sx={{ py: 1.5, px: 2, bgcolor: "grey.50" }}>
                        <Stack spacing={1}>
                          {/* Badges row - kam to'lov, kechikish */}
                          {(hasShortage || delayDays > 0) && (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {hasShortage && actualPayment?.remainingAmount && (
                                <Chip
                                  icon={<MdArrowDownward size={12} />}
                                  label={`Kam to'lov: $${actualPayment.remainingAmount.toLocaleString()}`}
                                  size="small"
                                  color="error"
                                  sx={{ fontSize: "0.7rem", height: 22 }}
                                />
                              )}
                              {delayDays > 0 && (
                                <Chip
                                  icon={<Clock size={12} />}
                                  label={`${delayDays} kun kechikkan`}
                                  size="small"
                                  color="warning"
                                  sx={{ fontSize: "0.7rem", height: 22 }}
                                />
                              )}
                            </Stack>
                          )}
                          
                          {/* Payment details */}
                          {item.isPaid && actualPayment && (
                            <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                              <Typography variant="body2" fontSize="0.8rem">
                                <strong>To'langan:</strong> ${actualPaidAmount.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" fontSize="0.8rem">
                                <strong>Sana:</strong> {actualPayment.confirmedAt
                                  ? format(new Date(actualPayment.confirmedAt as string), "dd.MM.yyyy HH:mm")
                                  : format(new Date(actualPayment.date as string), "dd.MM.yyyy")}
                              </Typography>
                            </Stack>
                          )}
                          
                          {/* Notes */}
                          {actualPayment?.notes && (
                            <Typography variant="body2" fontSize="0.8rem" color="text.secondary">
                              <strong>Izoh:</strong> {typeof actualPayment.notes === 'string' 
                                ? actualPayment.notes 
                                : (actualPayment.notes as any)?.text || '-'}
                            </Typography>
                          )}
                          
                        </Stack>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            );
          })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Payment Modal */}
      {(contractId || debtorId) && customerId && (
        <PaymentModal
          open={paymentModal.open}
          amount={paymentModal.amount}
          contractId={contractId || debtorId || ""}
          isPayAll={paymentModal.isPayAll}
          paymentId={paymentModal.paymentId}
          isDebtPayment={paymentModal.isDebtPayment} // ✅ YANGI: Qarz to'lovi flag'i
          originalAmount={paymentModal.originalAmount} // ✅ YANGI: Asosiy oylik to'lov miqdori
          onClose={() =>
            setPaymentModal({
              open: false,
              amount: 0,
              isPayAll: false,
              paymentId: undefined,
              month: undefined,
              isDebtPayment: false,
              originalAmount: undefined,
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

export default PaymentScheduleNew;
