import { Chip } from "@mui/material";
import { MdCheckCircle, MdWarning, MdArrowUpward, MdPending } from "react-icons/md";

interface StatusBadgeProps {
  status: string;
  size?: "small" | "medium";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = "small" 
}) => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return (
        <Chip
          icon={<MdCheckCircle size={16} />}
          label="TO'LANDI"
          color="success"
          size={size}
          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
        />
      );
    
    case "UNDERPAID":
      return (
        <Chip
          icon={<MdWarning size={16} />}
          label="KAM"
          color="warning"
          size={size}
          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
        />
      );
    
    case "OVERPAID":
      return (
        <Chip
          icon={<MdArrowUpward size={16} />}
          label="KO'P"
          color="info"
          size={size}
          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
        />
      );
    
    case "PENDING":
      return (
        <Chip
          icon={<MdPending size={16} />}
          label="KUTISH"
          color="default"
          size={size}
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      );
    
    default:
      return null;
  }
};
