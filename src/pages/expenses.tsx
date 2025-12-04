import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";
import { Plus, DollarSign, Banknote } from "lucide-react";
import { borderRadius, shadows } from "../theme/colors";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { IExpenses } from "../types/IExpenses";
import {
  getActiveExpenses,
  getInActiveExpenses,
} from "../store/actions/expensesActions";
import { openExpensesModal } from "../store/slices/expensesSlice";
import ExpensesTab from "../sestions/Expenses/ExpensesTab";
import ActionExpenses from "../sestions/Expenses/action/action-expenses";
import ExpensesDialog from "../sestions/Expenses/ExpensesDialog";
import ExpensesInfo from "../sestions/Expenses/ExpensesInfo";

type TabPageProps = {
  activeTabIndex: number;
  index: number;
};

export default function ExpensesView({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { activeExpenses, inActiveExpenses } = useSelector(
    (state: RootState) => state.expenses
  );

  const [activeTab, setActiveTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState<IExpenses | null>(null);

  const handleOpenDrawer = (expenses: IExpenses) => {
    setDrawerOpen(expenses);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(null);
  };

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getActiveExpenses());
      dispatch(getInActiveExpenses());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabIndex, index]);
  const totalUSD = activeExpenses?.reduce((acc, exp) => {
    return acc + exp.currencyDetails.dollar;
  }, 0);

  const totalUZS = activeExpenses?.reduce((acc, exp) => {
    return acc + exp.currencyDetails.sum;
  }, 0);
  return (
    <Box 
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(2, 1fr)" }, 
          gap: 2, 
          mb: 3 
        }}
      >
        <Paper
          sx={{
            p: 2.5,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: borderRadius.lg,
            color: "white",
            boxShadow: shadows.colored("rgba(102, 126, 234, 0.3)"),
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <DollarSign size={24} />
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
              Dollar
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={700}>
            {totalUSD?.toLocaleString()} $
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2.5,
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderRadius: borderRadius.lg,
            color: "white",
            boxShadow: shadows.colored("rgba(79, 172, 254, 0.3)"),
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Banknote size={24} />
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
              So'm
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={700}>
            {totalUZS?.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => {
            dispatch(openExpensesModal({ type: "add", data: undefined }));
          }}
          sx={{
            ml: "auto",
            py: 1.5,
            px: 3,
            borderRadius: borderRadius.md,
            fontWeight: 700,
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            boxShadow: shadows.colored("rgba(17, 153, 142, 0.3)"),
            "&:hover": {
              background: "linear-gradient(135deg, #0d7a72 0%, #2dd46d 100%)",
            },
          }}
        >
          Qo'shish
        </Button>
      </Box>
      <ExpensesTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <Box>
        {activeTab === 0 && (
          <List sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {activeExpenses?.map((expenses) => (
              <ListItem
                key={expenses.id}
                component={Paper}
                sx={{
                  cursor: "pointer",
                  borderRadius: borderRadius.md,
                  boxShadow: shadows.sm,
                  bgcolor: "background.paper",
                  mb: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: shadows.md,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleOpenDrawer(expenses)}
                secondaryAction={<ActionExpenses expenses={expenses} />}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" gap={5}>
                      {expenses.currencyDetails.dollar > 0 && (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {`${expenses.currencyDetails.dollar.toLocaleString()}$`}
                        </Typography>
                      )}
                      {expenses.currencyDetails.sum > 0 && (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {`${expenses.currencyDetails.sum.toLocaleString()} so‘m`}
                        </Typography>
                      )}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="subtitle1" color="text.secondary">
                      {expenses.notes}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        {activeTab === 1 && (
          <List sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {inActiveExpenses?.map((expenses) => (
              <ListItem
                key={expenses.id}
                component={Paper}
                sx={{
                  cursor: "pointer",
                  borderRadius: borderRadius.md,
                  boxShadow: shadows.sm,
                  bgcolor: "rgba(102, 126, 234, 0.05)",
                  mb: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: shadows.md,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleOpenDrawer(expenses)}
                // secondaryAction={<ActionExpenses expenses={expenses} />}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" gap={5}>
                      {expenses.currencyDetails.dollar > 0 && (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {`${expenses.currencyDetails.dollar.toLocaleString()}$`}
                        </Typography>
                      )}
                      {expenses.currencyDetails.sum > 0 && (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                        >
                          {`${expenses.currencyDetails.sum.toLocaleString()} so‘m`}
                        </Typography>
                      )}
                    </Stack>
                  }
                  secondary={
                    <Typography variant="subtitle1" color="text.secondary">
                      {expenses.notes}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <ExpensesDialog />
      <ExpensesInfo open={drawerOpen} onClose={handleCloseDrawer} />
    </Box>
  );
}
