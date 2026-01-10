import { memo } from "react";
import {
  Paper,
  Typography,
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ').format(amount);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return parts[0].charAt(0);
  };

  // Oylik to'lov summasi (faqat bir oy uchun)
  const monthlyAmount = contract.monthlyPayment || 0;

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
      {/* Top: To'lov kuni (left, ko'k) va Kechikish (right, qizil) */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography
          fontSize={{ xs: "0.8rem", sm: "0.85rem" }}
          fontWeight={700}
          color="#1976d2"
        >
          {(contract.originalPaymentDay || (contract.initialPaymentDueDate ? new Date(contract.initialPaymentDueDate).getDate() : 0)).toString().padStart(2, "0")}
        </Typography>

        {!contract.isPending && contract.delayDays > 0 && (
          <Typography
            fontSize={{ xs: "0.8rem", sm: "0.85rem" }}
            fontWeight={700}
            color={getDelayColor(contract.delayDays)}
          >
            {contract.delayDays > 99 ? "99+" : contract.delayDays}
          </Typography>
        )}
        
        {contract.isPending && (
          <Typography
            fontSize={{ xs: "0.7rem", sm: "0.75rem" }}
            fontWeight={700}
            color="#0288d1"
          >
            Tasdiq
          </Typography>
        )}
      </Stack>

      {/* Mijoz ismi (uzun bo'lsa - initials) */}
      <Typography
        fontWeight={700}
        fontSize={{ xs: "0.85rem", sm: "0.9rem" }}
        color="text.primary"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          mb: 0.3,
        }}
      >
        {contract.fullName.length > 20 ? getInitials(contract.fullName) : contract.fullName}
      </Typography>

      {/* Mahsulot nomi */}
      <Typography
        fontSize={{ xs: "0.7rem", sm: "0.75rem" }}
        color="text.secondary"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          mb: 0.3,
        }}
      >
        {contract.productName}
      </Typography>

      {/* To'lov ID va To'langan/Jami oylar */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        {contract.paymentId && (
          <Typography
            fontSize={{ xs: "0.65rem", sm: "0.7rem" }}
            fontWeight={600}
            color="primary.main"
          >
            {contract.paymentId}
          </Typography>
        )}
        
        {contract.paidMonthsCount !== undefined && contract.period && (
          <Typography
            fontSize={{ xs: "0.7rem", sm: "0.75rem" }}
            fontWeight={600}
            color="text.secondary"
          >
            {contract.paidMonthsCount}/{contract.period}
          </Typography>
        )}
      </Stack>

      {/* Oylik to'lov summasi - KATTA */}
      <Typography
        fontWeight={700}
        fontSize={{ xs: "1.1rem", sm: "1.2rem" }}
        color={getDelayColor(contract.delayDays || 0)}
      >
        {formatCurrency(monthlyAmount)} $
      </Typography>
    </MotionPaper>
  );
});

ContractDebtorItem.displayName = 'ContractDebtorItem';

export default ContractDebtorItem;
