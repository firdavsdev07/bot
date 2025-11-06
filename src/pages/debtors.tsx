import { lazy, useEffect, useState } from "react";
import {
  List,
  Paper,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import CustomerListItem from "../components/CustomerItem";
import { ICustomer } from "../types/ICustomer";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getCustomersDebtor } from "../store/actions/customerActions";
import Loader from "../components/Loader/Loader";
import { FaSearch } from "react-icons/fa";

const CustomerDialog = lazy(
  () => import("../components/CustomerDialog/CustomerDialog")
);

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

export default function DebtorsPage({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { customersDebtor, isLoading } = useSelector(
    (state: RootState) => state.customer
  );

  const [selectedClient, setSelectedClient] = useState<ICustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getCustomersDebtor());
    }
  }, [activeTabIndex, dispatch, index]);

  const filteredDebtors = customersDebtor.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm)
    );
  });

  const handleClientClick = (client: ICustomer) => {
    setSelectedClient(client);
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
  };

  if (customersDebtor.length === 0 && isLoading) {
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
          background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Qarzdorlarni qidirish"
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
              // showDebtStatus
            />
          ))}
        </List>
      ) : (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          Qarzdor mijozlar topilmadi.
        </Typography>
      )}

      <CustomerDialog
        open={!!selectedClient}
        customer={selectedClient}
        onClose={handleCloseDetails}
        isDebtorPage
      />
    </>
  );
}
