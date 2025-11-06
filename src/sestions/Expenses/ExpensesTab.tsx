import { Paper, Tab, Tabs } from "@mui/material";
import { FC } from "react";
import { RiExchangeDollarLine, RiMoneyDollarCircleLine } from "react-icons/ri";

interface IProps {
  activeTab: number;
  setActiveTab: (value: number) => void;
}

const ExpensesTab: FC<IProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Paper
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: "hidden",
        background: "linear-gradient(135deg, #f0f4ff, #ffffff)",
        boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        // variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <Tab
          icon={<RiMoneyDollarCircleLine size={30} />}
          iconPosition="start"
          label="Faol"
        />
        <Tab
          icon={<RiExchangeDollarLine size={30} />}
          iconPosition="start"
          label="Qaytarilgan"
        />
      </Tabs>
    </Paper>
  );
};

export default ExpensesTab;
