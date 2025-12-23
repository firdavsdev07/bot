import { useEffect, useState, useMemo } from "react";
import {
  List,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Box,
} from "@mui/material";
import { Search } from "lucide-react";
import CustomerListItem from "../components/CustomerItem";
import { ICustomer } from "../types/ICustomer";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getCustomers } from "../store/actions/customerActions";
import Loader from "../components/Loader/Loader";
import CustomerDialog from "../components/CustomerDialog/CustomerDialog";
import { borderRadius, shadows } from "../theme/colors";
import { useDebounce } from "../hooks/useDebounce";

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

export default function AllClientsPage({
  activeTabIndex,
  index,
}: TabPageProps) {
  const dispatch = useAppDispatch();
  const { customers, isLoading } = useSelector(
    (state: RootState) => state.customer
  );

  const [selectedClient, setSelectedClient] = useState<ICustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getCustomers());
    }
  }, [activeTabIndex, index]);

  const filteredClients = useMemo(() => {
    return customers.filter((customer) => {
      const fullName = customer.fullName.toLowerCase();
      return (
        fullName.includes(debouncedSearch.toLowerCase()) ||
        customer.phoneNumber.includes(debouncedSearch)
      );
    });
  }, [customers, debouncedSearch]);

  const handleClientClick = (client: ICustomer) => {
    setSelectedClient(client);
  };

  const handleCloseDetails = () => {
    setSelectedClient(null);
  };

  if (customers.length === 0 && isLoading) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 0, sm: 2, md: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          mb: 3,
          borderRadius: borderRadius.lg,
          bgcolor: "white",
          boxShadow: shadows.md,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <TextField
          fullWidth
          placeholder="Mijozlarni izlash..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#667eea" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: borderRadius.md,
              bgcolor: "grey.50",
              "& fieldset": { border: "none" },
              "&:hover": {
                bgcolor: "grey.100",
              },
            },
          }}
        />
      </Paper>

      {filteredClients.length > 0 ? (
        <List disablePadding>
          {filteredClients.map((customer) => (
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

      <CustomerDialog
        open={!!selectedClient}
        customer={selectedClient}
        onClose={handleCloseDetails}
      />
    </Box>
  );
}
