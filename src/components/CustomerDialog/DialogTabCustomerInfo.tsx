import { Box, Divider, Typography, Grid } from "@mui/material";
import { FC, useEffect } from "react";
import { User, Phone, MapPin, DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { getCustomer } from "../../store/actions/customerActions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { borderRadius, shadows } from "../../theme/colors";

interface IProps {
  customerId: string;
}

const DialogTabCustomerInfo: FC<IProps> = ({ customerId }) => {
  const dispatch = useAppDispatch();
  const { customerDetails, isLoading } = useSelector(
    (state: RootState) => state.customer
  );

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomer(customerId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  // Loading holati
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "300px",
        }}
      >
        <Box textAlign="center">
          <Typography variant="h6" color="primary.main" mb={2}>
            Yuklanmoqda...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Ma'lumot yo'q holati
  if (!customerDetails) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="error.main" mb={2}>
          Ma'lumot topilmadi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Mijoz ma'lumotlari yuklanmadi yoki xatolik yuz berdi.
        </Typography>
      </Box>
    );
  }

  const {
    fullName,
    phoneNumber,
    address,
    totalDebt = 0,
    totalPaid = 0,
    remainingDebt = 0,
    delayDays,
  } = customerDetails;

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Ism - har doim bor */}
        <InfoCard 
          icon={<User size={20} />} 
          label="Ism" 
          value={fullName} 
        />
        
        {/* Telefon - faqat agar bor bo'lsa */}
        {phoneNumber && phoneNumber.trim() && (
          <InfoCard 
            icon={<Phone size={20} />} 
            label="Telefon" 
            value={phoneNumber} 
          />
        )}
        
        {/* Manzil - faqat agar bor bo'lsa */}
        {address && address.trim() && (
          <InfoCard 
            icon={<MapPin size={20} />} 
            label="Manzil" 
            value={address} 
          />
        )}
      </Grid>

      <Divider sx={{ my: 2.5 }} />

      <Grid container spacing={2}>
        <InfoCard
          icon={<DollarSign size={20} />}
          label="Jami qarz"
          value={`${totalDebt.toLocaleString()} $`}
          color="primary.main"
        />
        <InfoCard
          icon={<CheckCircle size={20} />}
          label="To'langan"
          value={`${totalPaid.toLocaleString()} $`}
          color="success.main"
        />
        <InfoCard
          icon={<AlertCircle size={20} />}
          label="Qoldiq"
          value={`${remainingDebt.toLocaleString()} $`}
          color="error.main"
        />
        
        {/* Kechikish - faqat agar bor bo'lsa */}
        {delayDays !== undefined && delayDays > 0 && (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                borderRadius: borderRadius.md,
                background:
                  delayDays > 30
                    ? "rgba(239, 68, 68, 0.1)"
                    : delayDays > 7
                    ? "rgba(245, 158, 11, 0.1)"
                    : "rgba(16, 185, 129, 0.1)",
                border: "2px solid",
                borderColor:
                  delayDays > 30
                    ? "error.main"
                    : delayDays > 7
                    ? "warning.main"
                    : "success.main",
                boxShadow: shadows.sm,
              }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: delayDays > 30
                    ? "error.main"
                    : delayDays > 7
                    ? "warning.main"
                    : "success.main",
                  borderRadius: borderRadius.sm,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={20} color="white" />
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Kechikish
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={
                    delayDays > 30
                      ? "error.main"
                      : delayDays > 7
                      ? "warning.main"
                      : "success.main"
                  }
                >
                  {delayDays} kun
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DialogTabCustomerInfo;

const InfoCard: FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}> = ({ icon, label, value, color }) => (
  <Grid size={{ xs: 12, sm: 6 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: borderRadius.md,
        p: 2,
        boxShadow: shadows.sm,
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: shadows.md,
          borderColor: color || "primary.light",
        },
      }}
    >
      <Box
        sx={{
          p: 1,
          bgcolor: color ? `${color}15` : "primary.lighter",
          borderRadius: borderRadius.sm,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color || "primary.main",
        }}
      >
        {icon}
      </Box>
      <Box flex={1}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={700}
          color={color || "text.primary"}
          sx={{ mt: 0.25 }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  </Grid>
);
