import {
  Box,
  SwipeableDrawer,
  Typography,
  Divider,
  Stack,
  useTheme,
  Avatar,
} from "@mui/material";
import { FC } from "react";
import { ICustomerContract } from "../../types/ICustomer";
import {
  MdAttachMoney,
  MdDoneAll,
  MdOutlineMoneyOff,
  MdDateRange,
} from "react-icons/md";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  contract: ICustomerContract | null;
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  contract: ICustomerContract | null;
}

const ContractInfo: FC<DrawerProps> = ({ open, onClose, contract }) => {
  const theme = useTheme();

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      sx={{ zIndex: 1301 }}
      PaperProps={{
        sx: {
          borderRadius: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          bgcolor: "#F9FAFB",
          p: 3,
        },
      }}
    >
      {contract ? (
        <Box>
          <Typography variant="h6" fontWeight={700} mb={1} color="primary.main">
            {contract.productName}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Shartnoma tafsilotlari
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2}>
            <DrawerItem
              icon={<MdAttachMoney size={22} />}
              label="Umumiy qarz"
              value={`${contract.totalDebt.toLocaleString()}$`}
              color={theme.palette.primary.main}
            />
            <DrawerItem
              icon={<MdDoneAll size={22} />}
              label="To'langan"
              value={`${contract.totalPaid.toLocaleString()}$`}
              color="green"
            />
            <DrawerItem
              icon={<MdOutlineMoneyOff size={22} />}
              label="Qolgan"
              value={`${contract.remainingDebt.toLocaleString()}$`}
              color="red"
            />
            <DrawerItem
              icon={<MdDateRange size={22} />}
              label="Oylik to‘lov"
              value={`${contract.monthlyPayment.toLocaleString()}$`}
              color={theme.palette.info.main}
            />
          </Stack>
        </Box>
      ) : (
        <Typography textAlign="center" color="text.secondary">
          Ma'lumotlar topilmadi.
        </Typography>
      )}
    </SwipeableDrawer>
  );
};

const DrawerItem: FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <Box
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      borderRadius: 2,
      background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
      boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
    }}
  >
    <Avatar sx={{ bgcolor: color, width: 36, height: 36, mr: 2 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
        {value}
      </Typography>
    </Box>
  </Box>
);

export default ContractInfo;
