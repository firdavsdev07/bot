import { memo } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
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

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2, boxShadow: shadows.md }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(contract)}
      sx={{
        borderRadius: borderRadius.sm,
        mb: 1,
        p: { xs: 1.25, sm: 1.5 },
        bgcolor: "background.paper",
        border: "1.5px solid",
        borderColor: contract.isPending ? "#0288d1" : "#f44336",
        boxShadow: shadows.sm,
        cursor: "pointer",
        position: "relative",
        transition: "all 0.2s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          bgcolor: contract.isPending ? "#0288d1" : getDelayColor(contract.delayDays || 0),
        },
      }}
    >
      {/* Bitta qator: Ism + Status */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          <Typography
            fontWeight={700}
            sx={{
              fontSize: { xs: "0.9rem", sm: "0.95rem" },
              color: "text.primary",
            }}
          >
            {contract.fullName}
          </Typography>
        </Box>

        {/* Status Badge */}
        {contract.isPending ? (
          <Chip
            label="Tasdiq"
            size="small"
            sx={{
              height: 20,
              fontSize: "0.6rem",
              fontWeight: 700,
              bgcolor: "#e3f2fd",
              color: "#0288d1",
              "& .MuiChip-label": { px: 0.7 }
            }}
          />
        ) : (
          <Chip
            label={`${contract.delayDays > 99 ? "99+" : contract.delayDays} kun`}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.6rem",
              fontWeight: 700,
              bgcolor: getDelayBgColor(contract.delayDays),
              color: getDelayColor(contract.delayDays),
              "& .MuiChip-label": { px: 0.7 }
            }}
          />
        )}
      </Stack>

      {/* Ikkinchi qator: Ma'lumotlar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        sx={{ mt: 0.8 }}
      >
        {/* Qarz */}
        <Typography fontSize={{ xs: "0.75rem", sm: "0.8rem" }} color="text.secondary">
          <Typography component="span" fontWeight={700} color={getDelayColor(contract.delayDays || 0)} fontSize={{ xs: "0.85rem", sm: "0.9rem" }}>
            {formatCurrency(contract.remainingDebt)}$
          </Typography>
        </Typography>

        {/* To'lov ID */}
        {contract.paymentId && (
          <Typography fontSize={{ xs: "0.7rem", sm: "0.75rem" }} fontWeight={600} color="primary.main">
            {contract.paymentId}
          </Typography>
        )}

        {/* To'lov kuni */}
        <Typography fontSize={{ xs: "0.75rem", sm: "0.8rem" }} color="text.secondary">
          {(contract.originalPaymentDay || (contract.initialPaymentDueDate ? new Date(contract.initialPaymentDueDate).getDate() : 0)).toString().padStart(2, "0")}-kun
        </Typography>
        
        {/* To'langan oylar */}
        {totalMonths > 0 && (
          <Typography fontSize={{ xs: "0.75rem", sm: "0.8rem" }} fontWeight={600} color="primary.main">
            {paidMonths}/{totalMonths}
          </Typography>
        )}
      </Stack>
    </MotionPaper>
  );
});

ContractDebtorItem.displayName = 'ContractDebtorItem';

export default ContractDebtorItem;
