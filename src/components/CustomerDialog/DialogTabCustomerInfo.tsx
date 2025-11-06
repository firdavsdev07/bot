import { Box, Divider, Typography, Grid, Avatar } from "@mui/material";
import { FC, useEffect } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { getCustomer } from "../../store/actions/customerActions";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MdLocationOn, MdPhone, MdPerson, MdAttachMoney } from "react-icons/md";

interface IProps {
  customerId: string;
}

const DialogTabCustomerInfo: FC<IProps> = ({ customerId }) => {
  const dispatch = useAppDispatch();
  const { customerDetails } = useSelector((state: RootState) => state.customer);

  useEffect(() => {
    if (customerId) {
      dispatch(getCustomer(customerId));
    }
  }, [customerId, dispatch]);

  if (!customerDetails) return null;

  const {
    firstName,
    lastName,
    phoneNumber,
    address,
    totalDebt = 0,
    totalPaid = 0,
    remainingDebt = 0,
  } = customerDetails;

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Title */}
      <Box mb={3}>
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          Mijoz Ma'lumotlari
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Foydalanuvchi profili va to'lov holati
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <InfoCard
          icon={<MdPerson />}
          label="Ism"
          value={`${firstName} ${lastName}`}
        />
        <InfoCard icon={<MdPhone />} label="Telefon" value={phoneNumber} />
        {address && (
          <InfoCard icon={<MdLocationOn />} label="Manzil" value={address} />
        )}
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 3 }} />

      {/* Debt Info */}
      <Typography variant="subtitle1" fontWeight="medium" mb={2}>
        Qarzdorlik holati
      </Typography>
      <Grid container spacing={2}>
        <InfoCard
          icon={<MdAttachMoney />}
          label="Jami qarz"
          value={`${totalDebt.toLocaleString()}$`}
        />
        <InfoCard
          icon={<MdAttachMoney />}
          label="To'langan"
          value={`${totalPaid.toLocaleString()}$`}
          color="success.main"
        />
        <InfoCard
          icon={<MdAttachMoney />}
          label="Qoldiq"
          value={`${remainingDebt.toLocaleString()}$`}
          color="error.main"
        />
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
        bgcolor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Avatar sx={{ bgcolor: "#f5f5f5", color: "primary.main", mr: 2 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color={color || "primary.main"}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  </Grid>
);
