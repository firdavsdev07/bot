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
import { MdAdd } from "react-icons/md";
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
  }, [activeTabIndex, dispatch, index]);
  const totalUSD = activeExpenses?.reduce((acc, exp) => {
    return acc + exp.currencyDetails.dollar;
  }, 0);

  const totalUZS = activeExpenses?.reduce((acc, exp) => {
    return acc + exp.currencyDetails.sum;
  }, 0);
  return (
    <Box p={1}>
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" color="primary.main">
          Jami harajat
        </Typography>
        <Typography variant="h6" color="primary.main">
          {totalUSD?.toLocaleString()} $
        </Typography>
        <Typography variant="h6" color="primary.main">
          {totalUZS?.toLocaleString()} so'm
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<MdAdd />}
          onClick={() => {
            dispatch(openExpensesModal({ type: "add", data: undefined }));
          }}
          sx={{ ml: "auto" }}
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
                // component={Paper}
                sx={{
                  cursor: "pointer",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
                  background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
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
                  borderRadius: 2,
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
                  background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
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
