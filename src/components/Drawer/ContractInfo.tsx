import {
  Box,
  SwipeableDrawer,
  Typography,
  Divider,
  Stack,
  useTheme,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { FC } from "react";
import { ICustomerContract } from "../../types/ICustomer";
import {
  MdAttachMoney,
  MdDoneAll,
  MdOutlineMoneyOff,
  MdDateRange,
  MdHistory,
} from "react-icons/md";

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
          maxHeight: "80vh",
          overflow: "auto",
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
              value={`${contract.totalDebt?.toLocaleString() || 0} $`}
              color={theme.palette.primary.main}
            />
            <DrawerItem
              icon={<MdDoneAll size={22} />}
              label="To'langan"
              value={`${contract.totalPaid?.toLocaleString() || 0} $`}
              color="green"
            />
            <DrawerItem
              icon={<MdOutlineMoneyOff size={22} />}
              label="Qolgan"
              value={`${contract.remainingDebt?.toLocaleString() || 0} $`}
              color="red"
            />
            <DrawerItem
              icon={<MdDateRange size={22} />}
              label="Oylik to'lov"
              value={`${contract.monthlyPayment?.toLocaleString() || 0} $`}
              color={theme.palette.info.main}
            />
          </Stack>

          {contract.payments && contract.payments.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <MdHistory size={20} style={{ marginRight: 8 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    To'lovlar tarixi
                  </Typography>
                </Box>

                <List sx={{ bgcolor: "#fff", borderRadius: 2, p: 0 }}>
                  {contract.payments.map((payment, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        borderBottom:
                          index < contract.payments!.length - 1
                            ? "1px solid #f0f0f0"
                            : "none",
                        py: 1.5,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" fontWeight={600}>
                              {payment.amount.toLocaleString()} $
                            </Typography>
                            <Chip
                              label={
                                payment.isPaid ? "To'langan" : "Kutilmoqda"
                              }
                              size="small"
                              color={payment.isPaid ? "success" : "warning"}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {new Date(payment.date).toLocaleDateString(
                              "uz-UZ",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}
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
      bgcolor: "#fff",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <Avatar sx={{ bgcolor: color, width: 36, height: 36, mr: 2 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  </Box>
);

export default ContractInfo;
