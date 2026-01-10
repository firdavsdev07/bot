import { memo } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Clock, Package, Calendar, AlertCircle } from "lucide-react";
import { IDebtorContract } from "../types/ICustomer";
import { borderRadius, shadows } from "../theme/colors";

interface ContractDebtorItemProps {
  contract: IDebtorContract;
  onClick: (contract: IDebtorContract) => void;
}

const MotionPaper = motion(Paper);

const ContractDebtorItem: React.FC<ContractDebtorItemProps> = memo(({
  contract,
  onClick,
}) => {
  const getDelayColor = (days: number) => {
    if (days > 30) return "#d32f2f";
    if (days > 7) return "#ed6c02";
    return "#2e7d32";
  };

  const getDelayBgColor = (days: number) => {
    if (days > 30) return "rgba(211, 47, 47, 0.1)";
    if (days > 7) return "rgba(237, 108, 2, 0.1)";
    return "rgba(46, 125, 50, 0.1)";
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  // Calculate paid months
  const getPaidMonths = () => {
    if (contract.paidMonthsCount !== undefined) {
      return contract.paidMonthsCount;
    }
    if (contract.period && contract.monthlyPayment && contract.initialPayment !== undefined) {
      return Math.floor((contract.totalPaid - contract.initialPayment) / contract.monthlyPayment);
    }
    return 0;
  };

  const paidMonths = getPaidMonths();
  const totalMonths = contract.period || 0;
  const progress = totalMonths > 0 ? (paidMonths / totalMonths) * 100 : 0;

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: shadows.lg }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(contract)}
      sx={{
        borderRadius: borderRadius.lg,
        mb: 2,
        p: { xs: 2, sm: 2.5 },
        bgcolor: "background.paper",
        border: "2px solid",
        borderColor: contract.isPending ? "#0288d1" : "#f44336",
        boxShadow: shadows.md,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          bgcolor: contract.isPending ? "#0288d1" : getDelayColor(contract.delayDays || 0),
        },
      }}
    >
      {/* Header: Ism va Status */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Box flex={1}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              fontSize: { xs: "1rem", sm: "1.1rem" },
              color: "text.primary",
              mb: 0.5,
            }}
          >
            {contract.fullName}
          </Typography>
          
          {/* To'lov ID */}
          {contract.paymentId && (
            <Chip
              label={contract.paymentId}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.7rem",
                fontWeight: 600,
                bgcolor: "#e3f2fd",
                color: "#1976d2",
                "& .MuiChip-label": { px: 1 }
              }}
            />
          )}
        </Box>

        {/* Status Badge */}
        {contract.isPending ? (
          <Chip
            icon={<Clock size={14} />}
            label="Tasdiq kutilmoqda"
            size="small"
            sx={{
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 700,
              bgcolor: "#e3f2fd",
              color: "#0288d1",
              animation: "pulse 2s infinite ease-in-out",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.7 },
              },
            }}
          />
        ) : (
          <Chip
            icon={<AlertCircle size={14} />}
            label={`${contract.delayDays > 99 ? "99+" : contract.delayDays} kun`}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 700,
              bgcolor: getDelayBgColor(contract.delayDays),
              color: getDelayColor(contract.delayDays),
            }}
          />
        )}
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      {/* Product Info */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
        <Package size={16} color="#666" />
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
            color: "text.secondary",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {contract.productName}
        </Typography>
      </Stack>

      {/* Progress Bar */}
      {totalMonths > 0 && (
        <Box mb={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
              To'lov jarayoni
            </Typography>
            <Typography variant="caption" fontWeight={700} fontSize="0.75rem" color="primary.main">
              {paidMonths}/{totalMonths} oy
            </Typography>
          </Stack>
          <Box
            sx={{
              width: "100%",
              height: 6,
              bgcolor: "#e0e0e0",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: "100%",
                bgcolor: progress >= 100 ? "#4caf50" : "#2196f3",
                transition: "width 0.5s ease",
                borderRadius: 3,
              }}
            />
          </Box>
        </Box>
      )}

      {/* Footer: Qarz ma'lumoti */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          p: 1.5,
          bgcolor: getDelayBgColor(contract.delayDays || 0),
          borderRadius: borderRadius.sm,
        }}
      >
        <Box flex={1}>
          <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
            Qarz
          </Typography>
          <Typography variant="body2" fontWeight={700} color={getDelayColor(contract.delayDays || 0)} fontSize="0.9rem">
            {formatCurrency(contract.remainingDebt)} $
          </Typography>
        </Box>

        {(contract.originalPaymentDay || contract.initialPaymentDueDate) && (
          <Box flex={1} textAlign="right">
            <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
              To'lov kuni
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
              <Calendar size={14} color="#666" />
              <Typography variant="body2" fontWeight={700} fontSize="0.9rem">
                {(contract.originalPaymentDay || new Date(contract.initialPaymentDueDate!).getDate()).toString().padStart(2, "0")}-kun
              </Typography>
            </Stack>
          </Box>
        )}
      </Stack>
    </MotionPaper>
  );
});

ContractDebtorItem.displayName = 'ContractDebtorItem';

export default ContractDebtorItem;
