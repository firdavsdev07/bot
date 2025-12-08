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
          icon={<MdCheckCircle size={14} />}
          label="TO'LANDI"
          color="success"
          size={size}
          sx={{ 
            fontWeight: 600, 
            fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
            height: { xs: 20, sm: 22, md: 24 },
            "& .MuiChip-icon": {
              width: { xs: 12, sm: 14, md: 16 },
              height: { xs: 12, sm: 14, md: 16 }
            }
          }}
        />
      );
    
    case "UNDERPAID":
      return (
        <Chip
          icon={<MdWarning size={14} />}
          label="KAM"
          color="warning"
          size={size}
          sx={{ 
            fontWeight: 600, 
            fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
            height: { xs: 20, sm: 22, md: 24 },
            "& .MuiChip-icon": {
              width: { xs: 12, sm: 14, md: 16 },
              height: { xs: 12, sm: 14, md: 16 }
            }
          }}
        />
      );
    
    case "OVERPAID":
      return (
        <Chip
          icon={<MdArrowUpward size={14} />}
          label="KO'P"
          color="info"
          size={size}
          sx={{ 
            fontWeight: 600, 
            fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
            height: { xs: 20, sm: 22, md: 24 },
            "& .MuiChip-icon": {
              width: { xs: 12, sm: 14, md: 16 },
              height: { xs: 12, sm: 14, md: 16 }
            }
          }}
        />
      );
    
    case "PENDING":
      return (
        <Chip
          icon={<MdPending size={14} />}
          label="KUTISH"
          color="default"
          size={size}
          variant="outlined"
          sx={{ 
            fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
            height: { xs: 20, sm: 22, md: 24 },
            "& .MuiChip-icon": {
              width: { xs: 12, sm: 14, md: 16 },
              height: { xs: 12, sm: 14, md: 16 }
            }
          }}
        />
      );
    
    default:
      return null;
  }
};
