import { useEffect, useState, useMemo } from "react";
import {
  List,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { Search, AlertTriangle, Calendar, X } from "lucide-react";
import ContractDebtorItem from "../components/ContractDebtorItem";
import { IDebtorContract, ICustomer } from "../types/ICustomer";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getCustomersDebtor } from "../store/actions/customerActions";
import Loader from "../components/Loader/Loader";
import CustomerDialog from "../components/CustomerDialog/CustomerDialog";
import { borderRadius, shadows } from "../theme/colors";
import { useDebounce } from "../hooks/useDebounce";
import dayjs from "../utils/dayjs-config";

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

export default function DebtorsPage({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { customersDebtor, isLoading } = useSelector(
    (state: RootState) => state.customer
  );

  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (activeTabIndex === index) {
      const dateFilter = selectedDate && selectedDate.trim() !== "" ? selectedDate : undefined;
      dispatch(getCustomersDebtor(dateFilter));
    }
  }, [activeTabIndex, index, selectedDate, dispatch]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleShowAll = () => {
    setSelectedDate("");
  };

  const filteredDebtors = useMemo(() => {
    const filtered = customersDebtor.filter((contract) => {
      const fullName = contract.fullName.toLowerCase();
      const productName = contract.productName?.toLowerCase() || "";
      return (
        fullName.includes(debouncedSearch.toLowerCase()) ||
        contract.phoneNumber.includes(debouncedSearch) ||
        productName.includes(debouncedSearch.toLowerCase())
      );
    });
    
    // Yangi qarzdorlar (kam kechikkan) birinchi bo'lsin
    return filtered.sort((a, b) => {
      // Avval delayDays bo'yicha (kichik -> katta)
      if (a.delayDays !== b.delayDays) {
        return a.delayDays - b.delayDays;
      }
      // Agar delayDays teng bo'lsa, qarzi bo'yicha (katta -> kichik)
      return b.remainingDebt - a.remainingDebt;
    });
  }, [customersDebtor, debouncedSearch]);

  const handleContractClick = (contract: IDebtorContract) => {
    // Mijozni CustomerDialog'da ochish uchun ICustomer formatiga o'tkazish
    const customer: ICustomer = {
      _id: contract.customerId,
      fullName: contract.fullName,
      phoneNumber: contract.phoneNumber,
    };
    setSelectedCustomer(customer);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  if (isLoading) {
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
          background: "#ef4444",
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
        <Stack spacing={2}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 0.5,
                  color: "text.primary",
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}
              >
                <Calendar size={18} />
                Sana bo'yicha filter
              </Typography>
              
              {selectedDate && (
                <Chip
                  label="Tozalash"
                  onClick={handleShowAll}
                  size="small"
                  color="error"
                  variant="filled"
                  deleteIcon={<X size={14} />}
                  onDelete={handleShowAll}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 28,
                    "& .MuiChip-deleteIcon": {
                      fontSize: "1rem",
                    },
                  }}
                />
              )}
            </Box>

            <TextField
              fullWidth
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              size="medium"
              placeholder="Sanani tanlang"
              InputProps={{
                sx: {
                  borderRadius: borderRadius.md,
                  bgcolor: "grey.50",
                  "& fieldset": { 
                    border: "1.5px solid #e0e0e0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#eb3349",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#eb3349",
                    borderWidth: "2px",
                  },
                  "& input": {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  },
                },
              }}
              helperText={
                selectedDate
                  ? `${dayjs(selectedDate).format("DD MMMM YYYY")} gacha bo'lgan kechikkan to'lovlar`
                  : "Bugungi kungacha barcha kechikkan to'lovlar"
              }
              FormHelperTextProps={{
                sx: { 
                  fontSize: "0.75rem",
                  color: selectedDate ? "error.main" : "success.main",
                  fontWeight: 500,
                  mt: 0.75,
                }
              }}
            />
          </Box>

          <TextField
            fullWidth
            placeholder="Ism, familiya yoki telefon raqam bo'yicha qidiring..."
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
                "&.Mui-focused": {
                  bgcolor: "rgba(235, 51, 73, 0.05)",
                },
              },
            }}
          />
        </Stack>
      </Paper>

      {filteredDebtors.length > 0 ? (
        <>
          <List disablePadding>
            {filteredDebtors.map((contract) => (
              <ContractDebtorItem
                key={contract._id}
                contract={contract}
                onClick={handleContractClick}
              />
            ))}
          </List>
        </>
      ) : (
        <Paper
          sx={{
            p: 3,
            textAlign: "center",
            borderRadius: borderRadius.lg,
            bgcolor: "grey.50",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Qarzdor shartnomalar topilmadi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedDate 
              ? `${dayjs(selectedDate).format("DD MMMM YYYY")} sanasiga qadar qarzdor shartnomalar yo'q`
              : "Bugungi kunga qadar qarzdor shartnomalar yo'q"}
          </Typography>
        </Paper>
      )}

      <CustomerDialog
        open={!!selectedCustomer}
        customer={selectedCustomer}
        onClose={handleCloseDetails}
      />
    </Box>
  );
}
