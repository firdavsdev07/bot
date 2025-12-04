import { useEffect, useState, useMemo } from "react";
import {
  List,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Box,
} from "@mui/material";
import { Search, AlertTriangle } from "lucide-react";
import CustomerListItem from "../components/CustomerItem";
import { ICustomer } from "../types/ICustomer";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getCustomersDebtor } from "../store/actions/customerActions";
import Loader from "../components/Loader/Loader";
import CustomerDialog from "../components/CustomerDialog/CustomerDialog";
import { borderRadius, shadows } from "../theme/colors";
import { useDebounce } from "../hooks/useDebounce";

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
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getCustomersDebtor());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabIndex, index]);

  const filteredDebtors = useMemo(() => {
    return customersDebtor.filter((customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return (
        fullName.includes(debouncedSearch.toLowerCase()) ||
        customer.phoneNumber.includes(debouncedSearch)
      );
    });
  }, [customersDebtor, debouncedSearch]);

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
    <Box
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 0, sm: 2, md: 3 },
      }}
    >
      <Box 
        sx={{ 
          p: { xs: 2, sm: 2.5 },
          mb: 3,
          background: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
          borderRadius: borderRadius.lg,
          color: "white",
          boxShadow: shadows.colored("rgba(235, 51, 73, 0.3)"),
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <AlertTriangle size={28} />
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
              Jami qarzdorlar
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {filteredDebtors.length}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Kechikkan to'lovlar
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: borderRadius.lg,
          bgcolor: "white",
          boxShadow: shadows.md,
        }}
      >
        <TextField
          fullWidth
          placeholder="Qarzdorlarni qidirish..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="medium"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#eb3349" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: borderRadius.md,
              bgcolor: "grey.50",
              "& fieldset": { border: "none" },
              "&:hover": {
                bgcolor: "rgba(235, 51, 73, 0.05)",
              },
            },
          }}
        />
      </Paper>

      {filteredDebtors.length > 0 ? (
        <>
          <List disablePadding>
            {filteredDebtors.map((customer) => (
              <CustomerListItem
                key={customer._id}
                customer={customer}
                onClick={handleClientClick}
                showDebtBadge
              />
            ))}
          </List>
        </>
      ) : (
        <Typography textAlign="center" color="text.secondary" mt={4}>
          ✅ Qarzdor mijozlar topilmadi.
        </Typography>
      )}

      {/* Mijoz ma'lumotlari dialog - Ma'lumotlar, To'lovlar, Izohlar tablari */}
      <CustomerDialog
        open={!!selectedClient}
        customer={selectedClient}
        onClose={handleCloseDetails}
        isDebtorPage
      />
    </Box>
  );
}
