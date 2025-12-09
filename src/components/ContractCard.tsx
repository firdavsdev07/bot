import { FC } from "react";
import { Paper, Typography, Box, Chip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
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
        p: { xs: 1.5, sm: 2, md: 2.5 },
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
        alignItems="flex-start"
        justifyContent="space-between"
        mb={2.5}
        gap={1}
      >
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="subtitle1" 
            fontWeight={700} 
            fontSize={{ xs: "0.7rem", sm: "0.85rem", md: "1rem" }}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              lineHeight: { xs: 1.2, sm: 1.3 },
              mb: 0.3,
            }}
          >
            {contract.productName}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            fontSize={{ xs: "0.55rem", sm: "0.65rem" }}
          >
            {contract.paidMonthsCount || 0}/{contract.durationMonths || 0} oy to'langan
          </Typography>
        </Box>
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
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: { xs: 1.5, sm: 2 },
          mb: 2.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            p: { xs: 1, sm: 1.5 },
            bgcolor: "rgba(17, 153, 142, 0.08)",
            borderRadius: borderRadius.sm,
          }}
        >
          <TrendingUp size={isMobile ? 14 : 18} color="#11998e" />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" fontSize={{ xs: "0.65rem", sm: "0.75rem" }}>
              Jami qarz
            </Typography>
            <Typography variant="body2" fontWeight={700} fontSize={{ xs: "0.75rem", sm: "0.875rem" }}>
              {totalDebt.toLocaleString()} $
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            p: { xs: 1, sm: 1.5 },
            bgcolor: "rgba(79, 172, 254, 0.08)",
            borderRadius: borderRadius.sm,
          }}
        >
          <Calendar size={isMobile ? 14 : 18} color="#4facfe" />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" fontSize={{ xs: "0.65rem", sm: "0.75rem" }}>
              Muddat
            </Typography>
            <Typography variant="body2" fontWeight={700} fontSize={{ xs: "0.75rem", sm: "0.875rem" }}>
              {contract.durationMonths} oy
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
          gridTemplateColumns: { xs: "1fr 1fr 1fr", sm: "1fr 1fr 1fr" },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5} fontSize={{ xs: "0.65rem", sm: "0.75rem" }}>
            Jami
          </Typography>
          <Typography variant="body1" fontWeight={700} color="text.primary" fontSize={{ xs: "0.8rem", sm: "1rem" }}>
            {totalDebt.toLocaleString()} $
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5} fontSize={{ xs: "0.65rem", sm: "0.75rem" }}>
            To'langan
          </Typography>
          <Typography variant="body1" fontWeight={700} color="success.main" fontSize={{ xs: "0.8rem", sm: "1rem" }}>
            {totalPaid.toLocaleString()} $
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5} fontSize={{ xs: "0.65rem", sm: "0.75rem" }}>
            Qarz
          </Typography>
          <Typography variant="body1" fontWeight={700} color="error.main" fontSize={{ xs: "0.8rem", sm: "1rem" }}>
            {remainingDebt.toLocaleString()} $
          </Typography>
        </Box>
      </Box>
    </MotionPaper>
  );
};

export default ContractCard;
