import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { MdPayment } from "react-icons/md";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getContract } from "../../store/actions/customerActions";
import { red } from "@mui/material/colors";
import { ICustomerContract } from "../../types/ICustomer";
import ContractInfo from "../Drawer/ContractInfo";
import PaymentModal from "../PaymentModal/PaymentModal";

interface IProps {
  customerId: string;
}

import { blue } from "@mui/material/colors";

const DialogTabPayment: FC<IProps> = ({ customerId }) => {
  const dispatch = useAppDispatch();
  const { customerContracts, isLoading } = useSelector(
    (state: RootState) => state.customer
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContract, setSelectedContract] =
    useState<ICustomerContract | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(getContract(customerId));
  }, [customerId, dispatch]);

  const handleOpenDrawer = (contract: ICustomerContract) => {
    console.log("teret");

    setSelectedContract(contract);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedContract(null);
  };

  const handleOpenPayment = (contract: ICustomerContract) => {
    setSelectedContract(contract);
    setPaymentDialogOpen(true);
  };

  const handleClosePayment = () => {
    setSelectedContract(null);
    setPaymentDialogOpen(false);
  };

  const renderContracts = (
    title: string,
    contracts: ICustomerContract[],
    highlightColor?: string,
    noPay?: boolean
  ) => (
    <>
      <Typography
        variant="subtitle1"
        fontWeight="medium"
        mt={3}
        mb={1}
        color="text.secondary"
      >
        {title}
      </Typography>
      <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {contracts.map((contract) => (
          <ListItem
            key={contract._id}
            component={Paper}
            onClick={() => handleOpenDrawer(contract)}
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              bgcolor: highlightColor || "#fff",
              transition: "0.2s ease",
              "&:hover": {
                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
              },
              px: 2,
              py: 1.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {contract.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  💰 Oylik: {contract.monthlyPayment.toLocaleString()} $
                </Typography>
                <Typography
                  variant="caption"
                  color="primary.main"
                  fontWeight={600}
                >
                  📅{" "}
                  {new Date().toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
              {!noPay && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<MdPayment />}
                  sx={{ borderRadius: 2, bgcolor: "text.main" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenPayment(contract);
                  }}
                >
                  To'lov
                </Button>
              )}
            </Box>

            {/* To'lov ma'lumotlari */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1,
                pt: 1,
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Jami qarz
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {contract.totalDebt?.toLocaleString() || 0} $
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  To'langan
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {contract.totalPaid?.toLocaleString() || 0} $
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Qolgan
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {contract.remainingDebt?.toLocaleString() || 0} $
                </Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={2} color="primary.main">
          To‘lovlar Tarixi
        </Typography>

        {isLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && customerContracts?.allContracts.length === 0 && (
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              To‘lovlar mavjud emas
            </Typography>
          </Paper>
        )}

        {customerContracts?.paidContracts &&
          customerContracts?.paidContracts?.length > 0 &&
          renderContracts(
            "Amalga oshirilgan to‘lovlar",
            customerContracts.paidContracts,
            blue[50],
            true
          )}

        {customerContracts?.debtorContracts &&
          customerContracts?.debtorContracts?.length > 0 &&
          renderContracts(
            "Qarzdorliklar",
            customerContracts.debtorContracts,
            red[100]
          )}

        {customerContracts?.allContracts &&
          customerContracts?.allContracts?.length > 0 &&
          renderContracts("Faol shartnomalar", customerContracts.allContracts)}
      </Box>

      <ContractInfo
        open={drawerOpen}
        onClose={handleCloseDrawer}
        contract={selectedContract}
      />

      <PaymentModal
        open={paymentDialogOpen}
        onClose={handleClosePayment}
        contract={selectedContract}
        customerId={customerId}
      />
    </Paper>
  );
};

export default DialogTabPayment;
