import { Paper, Tab, Tabs } from "@mui/material";
import { FC } from "react";
import { MdChat, MdHistory, MdPerson } from "react-icons/md";

interface IProps {
  activeTab: number;
  setActiveTab: (value: number) => void;
}

const DialogTab: FC<IProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Paper
      elevation={1}
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
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          icon={<MdHistory size={20} />}
          label="To'lovlar"
          iconPosition="start"
        />
        <Tab
          icon={<MdPerson size={20} />}
          label="Ma'lumotlar"
          iconPosition="start"
        />
        <Tab icon={<MdChat size={20} />} label="Izohlar" iconPosition="start" />
      </Tabs>
    </Paper>
  );
};

export default DialogTab;
