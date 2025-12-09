import { Chip, useMediaQuery, useTheme } from "@mui/material";
import { MdCheckCircle, MdWarning, MdArrowUpward, MdPending } from "react-icons/md";

interface StatusBadgeProps {
  status: string;
  size?: "small" | "medium";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = "small" 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  switch (status?.toUpperCase()) {
    case "PAID":
      return (
        <Chip
          icon={!isMobile ? <MdCheckCircle size={14} /> : undefined}
          label="OK"
          color="success"
          size={size}
          sx={{ 
            fontWeight: 600, 
            fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
            height: { xs: 18, sm: 22, md: 24 },
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
          icon={!isMobile ? <MdWarning size={14} /> : undefined}
          label="KAM"
          color="warning"
          size={size}
          sx={{ 
            fontWeight: 600, 
            fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
            height: { xs: 18, sm: 22, md: 24 },
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
          icon={!isMobile ? <MdArrowUpward size={14} /> : undefined}
          label="KO'P"
          color="info"
          size={size}
          sx={{ 
            fontWeight: 600, 
            fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
            height: { xs: 18, sm: 22, md: 24 },
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
          icon={!isMobile ? <MdPending size={14} /> : undefined}
          label="KUTISH"
          color="warning"
          size={size}
          sx={{ 
            fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
            height: { xs: 18, sm: 22, md: 24 },
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
