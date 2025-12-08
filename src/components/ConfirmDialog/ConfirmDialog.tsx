import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { CheckCircle, XCircle, AlertTriangle, Info, Trash2 } from "lucide-react";
import SmartButton from "../SmartButton/SmartButton";
import { responsive } from "../../theme/responsive";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info" | "delete";
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText,
  cancelText,
  loading = false,
}) => {
  // Icon mapping
  const iconMap = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />,
    delete: <Trash2 size={24} />,
  };

  // Color mapping
  const colorMap = {
    success: "success",
    error: "error", 
    warning: "warning",
    info: "info",
    delete: "error",
  } as const;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          mx: { xs: 2, sm: "auto" },
          my: { xs: 4, sm: "auto" },
          width: { xs: "calc(100% - 32px)", sm: "400px" },
        },
      }}
    >
      {/* Header with icon */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: `${colorMap[type]}.50`,
              color: `${colorMap[type]}.main`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {iconMap[type]}
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: responsive.typography.h6,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ py: 3 }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: responsive.typography.body1,
            lineHeight: 1.6,
            color: "text.secondary",
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      {/* Actions - Mobile optimized */}
      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          gap: { xs: 1, sm: 1.5 },
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        {/* Cancel button */}
        <SmartButton
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          icon={<XCircle size={responsive.icon.small.xs} />}
          tooltipText={cancelText || "Bekor qilish"}
          fullWidth={{ xs: true, sm: false } as any}
        >
          {cancelText || "Bekor qilish"}
        </SmartButton>

        {/* Confirm button */}
        <SmartButton
          variant="contained"
          color={colorMap[type]}
          onClick={onConfirm}
          loading={loading}
          icon={iconMap[type]}
          tooltipText={confirmText || "Tasdiqlash"}
          fullWidth={{ xs: true, sm: false } as any}
        >
          {confirmText || "Tasdiqlash"}
        </SmartButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;