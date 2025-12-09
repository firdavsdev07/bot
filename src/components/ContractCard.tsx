import { FC } from "react";
import { Paper, Typography, Box, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { DollarSign, Calendar, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { ICustomerContract } from "../types/ICustomer";
import { borderRadius, shadows } from "../theme/colors";

interface ContractCardProps {
  contract: ICustomerContract;
  variant?: "default" | "debtor" | "paid";
  onClick?: () => void;
}

const MotionPaper = motion(Paper);

const ContractCard: FC<ContractCardProps> = ({
  contract,
  variant = "default",
  onClick,
}) => {
  const totalDebt =
    (contract.monthlyPayment || 0) * (contract.durationMonths || 0);
  const totalPaid = contract.totalPaid || 0;
  const remainingDebt = contract.remainingDebt || 0;

  const getVariantStyles = () => {
    switch (variant) {
      case "debtor":
        return {
          borderColor: "error.main",
          borderWidth: "2px",
        };
      case "paid":
        return {
          borderColor: "success.main",
          borderWidth: "2px",
        };
      default:
        return {
          borderColor: "divider",
          borderWidth: "1px",
        };
    }
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={onClick ? { scale: 1.01, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      onClick={onClick}
      sx={{
        p: 2.5,
        mb: 2,
        bgcolor: "background.paper",
        border: "solid",
        ...getVariantStyles(),
        borderRadius: borderRadius.md,
        cursor: onClick ? "pointer" : "default",
        boxShadow: shadows.sm,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": onClick
          ? {
              boxShadow: shadows.md,
            }
          : {},
      }}
    >
      {/* Mahsulot nomi va status */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2.5}
        gap={1}
      >
        <Typography 
          variant="subtitle1" 
          fontWeight={700} 
          fontSize={{ xs: "0.95rem", sm: "1.05rem" }}
          sx={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
        >
          {contract.productName}
        </Typography>
        {variant === "paid" && (
          <Chip
            icon={<CheckCircle size={14} />}
            label="To'langan"
            size="small"
            color="success"
            sx={{ fontWeight: 600, "& .MuiChip-icon": { ml: 0.5 } }}
          />
        )}
        {variant === "debtor" && (
          <Chip
            icon={<AlertTriangle size={14} />}
            label="Qarzdor"
            size="small"
            color="error"
            sx={{ fontWeight: 600, "& .MuiChip-icon": { ml: 0.5 } }}
          />
        )}
      </Box>

      {/* Narx ma'lumotlari */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            bgcolor: "rgba(102, 126, 234, 0.08)",
            borderRadius: borderRadius.sm,
          }}
        >
          <DollarSign size={18} color="#667eea" />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Oylik to'lov
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {contract.monthlyPayment?.toLocaleString()} $
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            bgcolor: "rgba(79, 172, 254, 0.08)",
            borderRadius: borderRadius.sm,
          }}
        >
          <Calendar size={18} color="#4facfe" />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Muddat
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {contract.durationMonths} oy
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            bgcolor: "rgba(17, 153, 142, 0.08)",
            borderRadius: borderRadius.sm,
          }}
        >
          <TrendingUp size={18} color="#11998e" />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Jami qarz
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {totalDebt.toLocaleString()} $
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            bgcolor: "rgba(240, 147, 251, 0.08)",
            borderRadius: borderRadius.sm,
          }}
        >
          <CheckCircle size={18} color="#f093fb" />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              To'langan oylar
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {contract.paidMonthsCount || 0}/{contract.durationMonths || 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Jami ma'lumotlar */}
      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "2px solid",
          borderColor: "divider",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 2,
        }}
      >
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Jami
          </Typography>
          <Typography variant="body1" fontWeight={700} color="text.primary">
            {totalDebt.toLocaleString()} $
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            To'langan
          </Typography>
          <Typography variant="body1" fontWeight={700} color="success.main">
            {totalPaid.toLocaleString()} $
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Qarz
          </Typography>
          <Typography variant="body1" fontWeight={700} color="error.main">
            {remainingDebt.toLocaleString()} $
          </Typography>
        </Box>
      </Box>
    </MotionPaper>
  );
};

export default ContractCard;
