import {
  Box,
  SwipeableDrawer,
  Typography,
  IconButton,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { FC, useState, useMemo } from "react";
import { ICustomerContract } from "../../types/ICustomer";
import { X, Calendar, CreditCard, AlertTriangle } from "lucide-react";
import { getContract } from "../../store/actions/customerActions";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import PaymentModal from "../PaymentModal/PaymentModal";
import ModernDateTimePicker from "../ModernDateTimePicker";
import authApi from "../../server/auth";
import { useAlert } from "../AlertSystem";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  contract: ICustomerContract | null;
  customerId?: string;
  onPaymentSuccess?: () => void;
  readOnly?: boolean;
  selectedMonth?: number | null;
}

const ContractInfo: FC<DrawerProps> = ({
  open,
  onClose,
  contract,
  customerId,
  onPaymentSuccess: externalOnPaymentSuccess,
  readOnly = false,
  selectedMonth = null,
}) => {
  const dispatch = useAppDispatch();
  const { showError, showSuccess } = useAlert();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [dateChangeModalOpen, setDateChangeModalOpen] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false); // Close modal first
    
    if (customerId) {
      dispatch(getContract(customerId));
    }
    if (externalOnPaymentSuccess) {
      externalOnPaymentSuccess();
    }
  };

  const handleDateChange = async (newDate: Date) => {
    try {
      await authApi.put(`/contract/update-payment-date`, {
        contractId: contract?._id,
        newPaymentDate: newDate.toISOString(),
      });
      showSuccess("Sana muvaffaqiyatli o'zgartirildi", "Muvaffaqiyat");
      if (customerId) {
        dispatch(getContract(customerId));
      }
      if (externalOnPaymentSuccess) {
        externalOnPaymentSuccess();
      }
      setDateChangeModalOpen(false);
    } catch (error) {
      console.error("To'lov sanasini o'zgartirishda xatolik:", error);
      showError("Sana o'zgartirishda xatolik yuz berdi", "Xatolik");
    }
  };

  const { amountToPay, paymentForDeficit } = useMemo(() => {
    if (!contract) return { amountToPay: 0, paymentForDeficit: undefined };

    // Find the next pending payment or underpaid payment
    const paymentForDeficit = contract.payments?.find(p => 
      p.status === 'PENDING' || (p.status === 'UNDERPAID' && p.remainingAmount && p.remainingAmount > 0)
    );
    
    if (paymentForDeficit && paymentForDeficit.remainingAmount && paymentForDeficit.remainingAmount > 0) {
      return { 
        amountToPay: paymentForDeficit.remainingAmount, 
        paymentForDeficit: paymentForDeficit
      };
    }
    
    const lastConfirmedPayment = contract.payments
      ?.filter(p => p.status === 'PAID' || p.status === 'OVERPAID')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      [0];

    const previousExcess = lastConfirmedPayment?.excessAmount || 0;
    const monthlyPayment = contract.monthlyPayment || 0;
    
    return { 
      amountToPay: Math.max(0, monthlyPayment - previousExcess),
      paymentForDeficit: undefined, // Not a deficit payment
    };
  }, [contract, selectedMonth]);

  if (!contract) {
    return null; // Keep it simple, parent handles open state
  }

  const nextPaymentDate = contract.nextPaymentDate ? new Date(contract.nextPaymentDate) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (nextPaymentDate) {
    nextPaymentDate.setHours(0, 0, 0, 0);
  }
  const isOverdue = nextPaymentDate && nextPaymentDate.getTime() < today.getTime();
  
  const hasPendingPayment = contract.payments?.some(p => p.status === 'PENDING');

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        sx={{ zIndex: 1300 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            bgcolor: "#F9FAFB",
            p: 3,
            maxHeight: "90vh",
            overflow: "auto",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {contract.productName}
              {selectedMonth && ` - ${selectedMonth}-oy`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {contract.paidMonthsCount || 0}/{contract.durationMonths || 0} oy to'langan
            </Typography>
            {contract.contractId && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                ID: {contract.contractId}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} size="small">
            <X size={24} />
          </IconButton>
        </Box>

        <Box sx={{ p: 2.5, mb: 2, bgcolor: isOverdue ? "#ffebee" : "#e3f2fd", borderRadius: 2, border: `2px solid ${isOverdue ? "#ef5350" : "#1976d2"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          {nextPaymentDate ? (
            <Box>
              <Stack spacing={1.5}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Oylik to'lov
                </Typography>
                <Typography variant="h5" fontWeight={700} color={isOverdue ? "error.main" : "primary.main"}>
                  {contract.monthlyPayment.toLocaleString()} $
                </Typography>
                <Divider sx={{ borderStyle: "dashed" }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Calendar size={18} color={isOverdue ? "#eb3349" : "#667eea"} />
                    <Typography variant="body2" color="text.secondary">
                      Keyingi to'lov
                    </Typography>
                  </Stack>
                  <Typography variant="body2" fontWeight={600}>
                    {nextPaymentDate.toLocaleDateString("uz-UZ")}
                  </Typography>
                </Stack>
                {!readOnly && (
                  <Button 
                    size="small" 
                    startIcon={<Calendar size={18} />} 
                    onClick={() => setDateChangeModalOpen(true)}
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      mt: 1,
                      py: { xs: 0.75, md: 0.5 },
                      fontSize: { xs: '0.875rem', md: '0.8125rem' },
                      maxWidth: { md: '220px' },
                      mx: { md: 'auto' }
                    }}
                  >
                    Sanani o'zgartirish
                  </Button>
                )}
              </Stack>
            </Box>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 1 }}>
              <AlertTriangle size={20} color="#f093fb" />
              <Typography variant="body2" color="warning.dark" fontWeight={500}>
                To'lov sanasi aniqlanmagan
              </Typography>
            </Stack>
          )}
        </Box>

        {!readOnly && (
          hasPendingPayment ? (
            <Button fullWidth variant="contained" size="large" disabled sx={{ mb: 3, py: 1.5 }}>
              Tasdiqlash kutilmoqda
            </Button>
          ) : (
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              startIcon={<CreditCard size={18} />} 
              onClick={() => setPaymentModalOpen(true)} 
              sx={{ 
                mb: 3, 
                py: { xs: 1.5, md: 1.2 },
                fontSize: { xs: '0.95rem', md: '0.875rem' },
                maxWidth: { md: '300px' },
                mx: { md: 'auto' }
              }}
            >
              To'lov
            </Button>
          )
        )}

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
            Shartnoma ma'lumotlari
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Jami qarz:</Typography>
              <Typography variant="body2" fontWeight={600}>{contract.totalDebt?.toLocaleString() || 0} $</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">To'langan:</Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">{contract.totalPaid?.toLocaleString() || 0} $</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Qolgan:</Typography>
              <Typography variant="body2" fontWeight={600} color="error.main">{contract.remainingDebt?.toLocaleString() || 0} $</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Oylik to'lov:</Typography>
              <Typography variant="body2" fontWeight={600}>{contract.monthlyPayment?.toLocaleString() || 0} $</Typography>
            </Box>
          </Box>
        </Box>


      </SwipeableDrawer>

      {paymentModalOpen && (
        <PaymentModal
          open={paymentModalOpen}
          amount={amountToPay}
          contractId={contract._id}
          paymentId={paymentForDeficit?._id}
          customerId={customerId}
          targetMonth={selectedMonth || undefined}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <ModernDateTimePicker
        open={dateChangeModalOpen}
        onClose={() => setDateChangeModalOpen(false)}
        onConfirm={handleDateChange}
        initialDate={contract.nextPaymentDate ? new Date(contract.nextPaymentDate) : new Date()}
        minDate={new Date()}
      />
    </>
  );
};

export default ContractInfo;