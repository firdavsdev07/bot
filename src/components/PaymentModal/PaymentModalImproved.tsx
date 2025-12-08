import { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Divider,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Calendar,
  FileText,
  CreditCard,
  CheckCircle,
  X,
} from "lucide-react";
import SmartButton from "../SmartButton/SmartButton";
import { responsive } from "../../theme/responsive";
import { borderRadius } from "../../theme/colors";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentData) => void;
  loading?: boolean;
  title?: string;
  initialData?: Partial<PaymentData>;
}

interface PaymentData {
  amount: number;
  notes: string;
  paymentDate: string;
}

interface FormErrors {
  amount?: string;
  notes?: string;
  paymentDate?: string;
}

const PaymentModalImproved: FC<PaymentModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  title = "To'lov qo'shish",
  initialData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    notes: "",
    paymentDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Summa kiritilishi shart";
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = "Sana kiritilishi shart";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: 0,
      notes: "",
      paymentDate: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile} // Full screen on mobile
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          mx: isMobile ? 0 : 2,
          my: isMobile ? 0 : 2,
          maxHeight: isMobile ? "100vh" : "90vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "primary.50",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CreditCard size={responsive.icon.medium.xs} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: responsive.typography.h6,
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>
          </Box>

          {/* Close button for mobile */}
          {isMobile && (
            <SmartButton
              variant="text"
              onClick={handleClose}
              icon={<X size={responsive.icon.medium.xs} />}
              iconOnly={true}
              tooltipText="Yopish"
            />
          )}
        </Box>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ py: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          
          {/* Amount Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <DollarSign size={responsive.icon.small.xs} color="#666" />
                <Typography 
                  variant="subtitle2" 
                  fontWeight={600}
                  sx={{ fontSize: responsive.typography.body1 }}
                >
                  To'lov summasi
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                placeholder="Summani kiriting..."
                error={!!errors.amount}
                helperText={errors.amount}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: borderRadius.md,
                    fontSize: responsive.typography.body1,
                  },
                }}
                InputProps={{
                  sx: { 
                    height: responsive.button.height.md,
                    fontSize: responsive.typography.body1,
                  }
                }}
              />
            </Box>
          </motion.div>

          {/* Date Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Calendar size={responsive.icon.small.xs} color="#666" />
                <Typography 
                  variant="subtitle2" 
                  fontWeight={600}
                  sx={{ fontSize: responsive.typography.body1 }}
                >
                  To'lov sanasi
                </Typography>
              </Box>
              <TextField
                fullWidth
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                error={!!errors.paymentDate}
                helperText={errors.paymentDate}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: borderRadius.md,
                  },
                }}
                InputProps={{
                  sx: { 
                    height: responsive.button.height.md,
                    fontSize: responsive.typography.body1,
                  }
                }}
              />
            </Box>
          </motion.div>

          {/* Notes Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <FileText size={responsive.icon.small.xs} color="#666" />
                <Typography 
                  variant="subtitle2" 
                  fontWeight={600}
                  sx={{ fontSize: responsive.typography.body1 }}
                >
                  Izoh (ixtiyoriy)
                </Typography>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={isMobile ? 3 : 4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Qo'shimcha izoh..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: borderRadius.md,
                  },
                }}
                InputProps={{
                  sx: { 
                    fontSize: responsive.typography.body1,
                  }
                }}
              />
            </Box>
          </motion.div>

          {/* Info Alert */}
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: borderRadius.md,
              fontSize: responsive.typography.body2,
            }}
          >
            To'lov ma'lumotlarini diqqat bilan tekshiring
          </Alert>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          gap: { xs: 1, sm: 1.5 },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {!isMobile && (
          <SmartButton
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            icon={<X size={responsive.icon.small.xs} />}
            tooltipText="Bekor qilish"
          >
            Bekor qilish
          </SmartButton>
        )}

        <SmartButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          loading={loading}
          icon={<CheckCircle size={responsive.icon.small.xs} />}
          tooltipText="Saqlash"
          fullWidth={isMobile}
        >
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </SmartButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModalImproved;