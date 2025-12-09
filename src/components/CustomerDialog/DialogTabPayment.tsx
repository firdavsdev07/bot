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
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getContract } from "../../store/actions/customerActions";
import { blue } from "@mui/material/colors";
import { ICustomerContract } from "../../types/ICustomer";
import ContractInfo from "../Drawer/ContractInfo";
import { PaymentScheduleNew } from "../PaymentSchedule";

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
    dispatch(getContract(customerId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

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

  // handleOpenDrawer o'chirildi - PaymentSchedule ichida drawer yo'q

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
                alignItems="flex-start"
                spacing={2}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="primary.main"
                    sx={{
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {contract.productName}
                  </Typography>
                </Box>{" "}
                <br />
                <Chip
                  label={`${contract.paidMonthsCount || 0}/${
                    contract.durationMonths || contract.period || 0
                  }`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    minWidth: "60px",
                    borderWidth: 2,
                  }}
                />
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
                nextPaymentDate={contract.nextPaymentDate} // ✅ To'g'rilandi: nextPaymentDate
                onPaymentSuccess={() => {
                  dispatch(getContract(customerId));
                }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );

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
      {isLoading && <CircularProgress sx={{ my: 4 }} />}

      {!isLoading &&
        customerContracts?.allContracts?.length === 0 &&
        customerContracts?.paidContracts?.length === 0 && (
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
