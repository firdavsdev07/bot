import { useEffect, useState } from "react";
import {
  List,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import CustomerListItem from "../components/CustomerItem";
import { ICustomer } from "../types/ICustomer";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  getCustomersPayment,
  getContract,
} from "../store/actions/customerActions";
import Loader from "../components/Loader/Loader";
import { FaSearch } from "react-icons/fa";
import ContractCard from "../components/ContractCard";
import ContractInfo from "../components/Drawer/ContractInfo";
import { ICustomerContract } from "../types/ICustomer";
import { Check, TriangleAlert } from "lucide-react";

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

export default function CollectedPage({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { customersPayment, isLoading, customerContracts } = useSelector(
    (state: RootState) => state.customer
  );

  const [selectedClient, setSelectedClient] = useState<ICustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [selectedContract, setSelectedContract] =
    useState<ICustomerContract | null>(null);
  const [contractDrawerOpen, setContractDrawerOpen] = useState(false);

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getCustomersPayment());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabIndex, index]);

  const filteredDebtors = customersPayment.filter((customer) => {
    const fullName = customer.fullName.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm)
    );
  });

  const handleClientClick = async (client: ICustomer) => {
    setSelectedClient(client);
    setLoadingContracts(true);

    try {
      // Shartnomalarni yuklash
      await dispatch(getContract(client._id));
    } catch (error) {
      console.error("Collection - Error fetching contracts:", error);
    }

    setLoadingContracts(false);
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
  };

  if (customersPayment.length === 0 && isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Paper
        sx={{
          px: 2,
          py: 1.5,
          mb: 2,
          borderRadius: 2,
          background: "#f9fafb",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Undirilganlarni qidirish"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
            },
          }}
        />
      </Paper>

      {filteredDebtors.length > 0 ? (
        <List disablePadding>
          {filteredDebtors.map((customer) => (
            <CustomerListItem
              key={customer._id}
              customer={customer}
              onClick={handleClientClick}
            />
          ))}
        </List>
      ) : (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          Mijozlar topilmadi.
        </Typography>
      )}

      {/* Shartnomalar drawer */}
      {selectedClient && loadingContracts && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            zIndex: 1300,
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <CircularProgress />
            <Typography>Shartnomalar yuklanmoqda...</Typography>
          </Box>
        </Paper>
      )}

      {/* Shartnomalar ro'yxati */}
      {selectedClient &&
        !loadingContracts &&
        customerContracts &&
        (() => {
          return (
            <Paper
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: "70vh",
                overflow: "auto",
                zIndex: 1300,
                boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight={700}>
                  {selectedClient.fullName}
                </Typography>
                <Button onClick={handleCloseDetails} size="small">
                  Yopish
                </Button>
              </Box>

              {/* Agar hech qanday shartnoma bo'lmasa */}
              {(!customerContracts.allContracts ||
                customerContracts.allContracts.length === 0) &&
                (!customerContracts.debtorContracts ||
                  customerContracts.debtorContracts.length === 0) &&
                (!customerContracts.paidContracts ||
                  customerContracts.paidContracts.length === 0) && (
                  <Typography textAlign="center" color="text.secondary" mt={4}>
                    Bu mijozda shartnomalar topilmadi.
                  </Typography>
                )}

              {/* Faol shartnomalar */}
              {customerContracts.allContracts &&
                customerContracts.allContracts.length > 0 && (
                  <Box mb={2}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      mb={1}
                      fontWeight={600}
                    >
                      Faol shartnomalar
                    </Typography>
                    {customerContracts.allContracts.map((contract) => (
                      <ContractCard
                        key={contract._id}
                        contract={contract}
                        variant="default"
                        onClick={() => {
                          setSelectedContract(contract);
                          setContractDrawerOpen(true);
                        }}
                      />
                    ))}
                  </Box>
                )}

              {/* Qarzdorliklar */}
              {customerContracts.debtorContracts &&
                customerContracts.debtorContracts.length > 0 && (
                  <Box mb={2}>
                    <Typography
                      variant="subtitle2"
                      color="error.main"
                      mb={1}
                      fontWeight={700}
                    >
                      <TriangleAlert /> Qarzdorliklar
                    </Typography>
                    {customerContracts.debtorContracts.map((contract) => (
                      <ContractCard
                        key={contract._id}
                        contract={contract}
                        variant="debtor"
                        onClick={() => {
                          setSelectedContract(contract);
                          setContractDrawerOpen(true);
                        }}
                      />
                    ))}
                  </Box>
                )}

              {/* To'langan shartnomalar */}
              {customerContracts.paidContracts &&
                customerContracts.paidContracts.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="success.main"
                      mb={1}
                      fontWeight={600}
                    >
                      <Check /> To'langan shartnomalar
                    </Typography>
                    {customerContracts.paidContracts.map((contract) => (
                      <ContractCard
                        key={contract._id}
                        contract={contract}
                        variant="paid"
                        onClick={() => {
                          setSelectedContract(contract);
                          setContractDrawerOpen(true);
                        }}
                      />
                    ))}
                  </Box>
                )}
            </Paper>
          );
        })()}

      <ContractInfo
        open={contractDrawerOpen}
        onClose={() => setContractDrawerOpen(false)}
        contract={selectedContract}
        customerId={selectedClient?._id}
        readOnly={true}
      />
    </>
  );
}
