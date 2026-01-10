import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ChevronDown, Wallet } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getContract, getCustomersDebtor } from "../../store/actions/customerActions";
import { blue } from "@mui/material/colors";
import { ICustomerContract } from "../../types/ICustomer";
import ContractInfo from "../Drawer/ContractInfo";
import { PaymentScheduleNew } from "../PaymentSchedule";
import { responsive } from "../../theme/responsive";

interface IProps {
  customerId: string;
}

const DialogTabPayment: FC<IProps> = ({ customerId }) => {
  const dispatch = useAppDispatch();
  const { customerContracts, isLoading } = useSelector(
    (state: RootState) => state.customer
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContract, setSelectedContract] =
    useState<ICustomerContract | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    console.log("🔍 Fetching contracts for:", customerId);
    dispatch(getContract(customerId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  // ✅ Response'ni kuzatish
  useEffect(() => {
    console.log("📦 customerContracts updated:", {
      isNull: customerContracts === null,
      isUndefined: customerContracts === undefined,
      allContracts: customerContracts?.allContracts?.length,
      paidContracts: customerContracts?.paidContracts?.length,
      data: customerContracts,
    });
  }, [customerContracts]);

  useEffect(() => {
    if (selectedContract && customerContracts) {
      const allContracts = [
        ...customerContracts.allContracts,
        ...customerContracts.paidContracts,
      ];
      const updatedContract = allContracts.find(
        (c) => c._id === selectedContract._id
      );
      if (updatedContract) {
        setSelectedContract(updatedContract);
      }
    }
  }, [customerContracts, selectedContract]);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedContract(null);
    setSelectedMonth(null);
  };

  const renderContracts = (
    title: string,
    contracts: ICustomerContract[],
    highlightColor?: string
  ) => (
    <>
      <Typography
        variant="subtitle1"
        fontWeight="medium"
        mt={3}
        mb={2}
        color="text.secondary"
      >
        {title}
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        {contracts.map((contract) => (
          <Accordion
            key={contract._id}
            elevation={0}
            disableGutters
            sx={{
              borderRadius: "12px !important",
              bgcolor: highlightColor || "#fff",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
              border: "1px solid",
              borderColor: "divider",
              "&:before": { display: "none" },
              "&.Mui-expanded": {
                margin: 0,
                boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown size={20} color="#667eea" />}
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: 1.5,
                "& .MuiAccordionSummary-content": {
                  my: 1,
                },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                {/* Left side - Product name and payment info in column */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* 1-qator: Product nomi with Day badge */}
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {/* Day badge - NEW */}
                    {(contract.originalPaymentDay || contract.initialPaymentDueDate) && (
                      <Chip
                        label={(contract.originalPaymentDay || new Date(contract.initialPaymentDueDate!).getDate()).toString().padStart(2, "0")}
                        size="small"
                        sx={{
                          height: { xs: 20, sm: 22 },
                          minWidth: { xs: 26, sm: 30 },
                          fontSize: { xs: "0.65rem", sm: "0.7rem" },
                          fontWeight: 700,
                          bgcolor: "primary.main",
                          color: "white",
                          "& .MuiChip-label": {
                            px: { xs: 0.4, sm: 0.6 }
                          }
                        }}
                      />
                    )}
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="primary.main"
                      sx={{
                        fontSize: responsive.typography.body1,
                        lineHeight: 1.3,
                        wordWrap: "break-word",
                      }}
                    >
                      {contract.productName}
                    </Typography>
                  </Box>
                  
                  {/* 2-qator: To'lov va Progress chiplar */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      icon={<Wallet size={14} />}
                      label={`${contract.monthlyPayment.toLocaleString()} $`}
                      size="small"
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 600,
                        "& .MuiChip-icon": { color: "white" },
                        fontSize: responsive.typography.caption,
                      }}
                    />
                    <Chip
                      label={`${contract.paidMonthsCount || 0}/${
                        contract.durationMonths || contract.period || 0
                      }`}
                      size="small"
                      color="success"
                      sx={{
                        fontWeight: 600,
                        fontSize: responsive.typography.caption,
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, px: { xs: 1.5, sm: 2 }, pb: 2 }}>
              <PaymentScheduleNew
                contractId={contract._id || ""}
                customerId={customerId}
                period={contract.durationMonths || contract.period || 12}
                monthlyPayment={contract.monthlyPayment}
                initialPayment={contract.initialPayment || 0}
                initialPaymentDueDate={
                  contract.initialPaymentDueDate || contract.startDate
                }
                startDate={contract.startDate || ""}
                payments={contract.payments || []}
                remainingDebt={contract.remainingDebt || 0}
                totalPaid={contract.totalPaid || 0}
                prepaidBalance={contract.prepaidBalance || 0}
                readOnly={false}
                nextPaymentDate={contract.nextPaymentDate}
                onPaymentSuccess={() => {
                  // ✅ TUZATISH: Force refresh - hamma ma'lumotlarni yangilash
                  dispatch(getContract(customerId));
                  dispatch(getCustomersDebtor()); // ✅ Qarzdorlar ro'yxatini ham yangilash (ko'k rang uchun)
                }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );

  // ✅ Xatolik holatini tekshirish
  const hasError = !isLoading && !customerContracts;
  const isEmpty = !isLoading && customerContracts?.allContracts?.length === 0 && customerContracts?.paidContracts?.length === 0;

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Loading */}
      {isLoading && (
        <Box sx={{ my: 4, textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Shartnomalar yuklanmoqda...
          </Typography>
        </Box>
      )}

      {/* Xatolik */}
      {hasError && (
        <Paper sx={{ p: 3, borderRadius: 2, width: "100%", bgcolor: "error.lighter" }}>
          <Typography variant="h6" color="error.main" gutterBottom>
            ⚠️ Xatolik yuz berdi
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Shartnomalarni yuklashda xatolik. Iltimos, qayta urinib ko'ring.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", display: "block", mt: 1 }}>
            Customer ID: {customerId}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", display: "block" }}>
            customerContracts: {customerContracts === null ? "null" : customerContracts === undefined ? "undefined" : "exists"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(getContract(customerId))}
            sx={{ mt: 2 }}
          >
            Qayta urinish
          </Button>
        </Paper>
      )}

      {/* Bo'sh holat */}
      {isEmpty && (
        <Paper sx={{ p: 2, borderRadius: 2, width: "100%" }}>
          <Typography variant="body2" color="text.secondary">
            To'lovlar mavjud emas.
          </Typography>
        </Paper>
      )}

      {customerContracts?.allContracts &&
        customerContracts.allContracts.length > 0 &&
        renderContracts("Faol shartnomalar", customerContracts.allContracts)}

      {customerContracts?.paidContracts &&
        customerContracts.paidContracts.length > 0 &&
        renderContracts(
          "Bajarilgan shartnomalar",
          customerContracts.paidContracts,
          blue[50]
        )}

      <ContractInfo
        open={drawerOpen}
        onClose={handleCloseDrawer}
        contract={selectedContract}
        customerId={customerId}
        selectedMonth={selectedMonth}
      />
    </Box>
  );
};

export default DialogTabPayment;
