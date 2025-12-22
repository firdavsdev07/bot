import { FC, ReactNode } from "react";
import { Button, IconButton, Tooltip, CircularProgress, Box } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { responsive } from "../../theme/responsive";

interface SmartButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error" | "success" | "info" | "warning";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  tooltipText?: string; // For icon-only buttons
  iconOnly?: boolean; // Force icon
}

const SmartButton: FC<SmartButtonProps> = ({
  children,
  icon,
  onClick,
  loading = false,
  disabled = false,
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  tooltipText,
  iconOnly = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const shouldShowIconOnly = iconOnly || (isMobile && icon && tooltipText);

  const loadingIcon = (
    <CircularProgress 
      size={responsive.icon.small.xs} 
      color="inherit" 
    />
  );

  if (shouldShowIconOnly && icon) {
    const iconButton = (
      <IconButton
        onClick={onClick}
        disabled={disabled || loading}
        color={color}
        size={size}
        sx={{
          borderRadius: 2,
          bgcolor: variant === "contained" ? `${color}.main` : "transparent",
          border: variant === "outlined" ? 1 : 0,
          borderColor: variant === "outlined" ? `${color}.main` : "transparent",
          color: variant === "contained" ? "white" : `${color}.main`,
          width: responsive.button.height,
          height: responsive.button.height,
          "&:hover": {
            bgcolor: variant === "contained" ? `${color}.dark` : `${color}.50`,
          },
          "&:disabled": {
            opacity: 0.6,
          },
        }}
      >
        {loading ? loadingIcon : icon}
      </IconButton>
    );

    return tooltipText ? (
      <Tooltip title={tooltipText} arrow>
        {iconButton}
      </Tooltip>
    ) : iconButton;
  }

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled || loading}
      startIcon={loading ? loadingIcon : icon}
      sx={{
        height: responsive.button.height,
        fontSize: responsive.button.fontSize,
        fontWeight: 600,
        borderRadius: 2,
        textTransform: "none",
        minWidth: { xs: "auto", sm: 64 },
        px: { xs: 1.5, sm: 2 },
        "& .MuiButton-startIcon": {
          mr: { xs: 0.5, sm: 1 },
        },
      }}
    >
      <Box 
        component="span"
        sx={{
          display: { 
            xs: icon ? "none" : "block", 
            sm: "block" 
          }
        }}
      >
        {children}
      </Box>
    </Button>
  );
};

export default SmartButton;