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
import { BsCash, BsCashCoin } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { IExpenses } from "../../types/IExpenses";

interface DrawerProps {
  open: IExpenses | null;
  onClose: () => void;
}

const ExpensesInfo: FC<DrawerProps> = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={!!open}
      onClose={onClose}
      onOpen={() => {}}
      sx={{
        zIndex: 1301,
      }}
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
      <Box>
        {open ? (
          <>
            <Typography
              variant="h6"
              mb={2}
              fontWeight={700}
              color="primary.main"
            >
              Xarajat tafsilotlari
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <DrawerItem
                icon={<BsCashCoin size={22} />}
                label="Dollar:"
                value={open.currencyDetails.dollar.toLocaleString()}
                color={theme.palette.primary.main}
              />
              <DrawerItem
                icon={<BsCash size={22} />}
                label="So'm:"
                value={open.currencyDetails.sum.toLocaleString()}
                color={theme.palette.primary.main}
              />
              <DrawerItem
                icon={<CgNotes size={22} />}
                label="Izoh:"
                value={open.notes}
                color={theme.palette.primary.main}
              />
            </Stack>
          </>
        ) : (
          <Typography textAlign="center" color="text.secondary">
            Ma'lumotlar topilmadi.
          </Typography>
        )}
      </Box>
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

export default ExpensesInfo;
