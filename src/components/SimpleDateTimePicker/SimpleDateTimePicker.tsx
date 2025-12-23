import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { Check } from "lucide-react";
import { borderRadius, shadows, colors } from "../../theme/colors";
import dayjs from "dayjs";

interface SimpleDateTimePickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

const SimpleDateTimePicker: FC<SimpleDateTimePickerProps> = ({
  open,
  onClose,
  onConfirm,
  initialDate,
  minDate,
}) => {
  const formatDateTime = (date: Date) => {
    return dayjs(date).format("YYYY-MM-DDTHH:mm");
  };

  const [dateTimeValue, setDateTimeValue] = useState<string>(
    initialDate ? formatDateTime(initialDate) : formatDateTime(new Date())
  );

  const handleConfirm = () => {
    const selectedDate = new Date(dateTimeValue);
    onConfirm(selectedDate);
    onClose();
  };

  const minDateStr = minDate ? formatDateTime(minDate) : undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.xl,
          minWidth: { xs: "auto", sm: 500, md: 600 },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box>
          <TextField
            type="datetime-local"
            fullWidth
            value={dateTimeValue}
            onChange={(e) => setDateTimeValue(e.target.value)}
            inputProps={{
              min: minDateStr,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: borderRadius.md,
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                "& input": {
                  py: { xs: 2.5, sm: 3, md: 3.5 },
                  px: { xs: 2.5, sm: 3, md: 3.5 },
                  fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  lineHeight: 1.6,
                },
              },
              "& input[type='datetime-local']::-webkit-calendar-picker-indicator": {
                width: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                height: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                cursor: "pointer",
                marginLeft: { xs: "8px", md: "12px" },
              },
              "& input[type='datetime-local']::-webkit-datetime-edit": {
                padding: { xs: "4px", md: "8px" },
              },
              "& input[type='datetime-local']::-webkit-datetime-edit-fields-wrapper": {
                padding: { xs: "4px", md: "6px" },
              },
              "& input[type='datetime-local']::-webkit-datetime-edit-text": {
                padding: { xs: "0 2px", md: "0 4px" },
              },
              "& input[type='datetime-local']::-webkit-datetime-edit-month-field": {
                padding: { xs: "2px", md: "4px" },
              },
              "& input[type='datetime-local']::-webkit-datetime-edit-day-field": {
                padding: { xs: "2px", md: "4px" },
              },
              "& input[type='datetime-local']::-webkit-datetime-edit-year-field": {
                padding: { xs: "2px", md: "4px" },
              },
              "& input[type='datetime-local']::-webkit-datetime-edit-hour-field": {
                padding: { xs: "2px", md: "4px" },
              },
              "& input[type='datetime-local']::-webkit-datetime-edit-minute-field": {
                padding: { xs: "2px", md: "4px" },
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: { xs: 2, md: 3 }, gap: { xs: 1, md: 1.5 } }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            borderRadius: borderRadius.md,
            py: { xs: 1.2, md: 1.5 },
            fontSize: { xs: "0.875rem", md: "1rem" },
          }}
        >
          Bekor
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          fullWidth
          startIcon={<Check size={20} />}
          sx={{
            py: { xs: 1.2, md: 1.5 },
            borderRadius: borderRadius.md,
            fontWeight: 700,
            fontSize: { xs: "0.875rem", md: "1rem" },
            background: colors.success.main,
            boxShadow: shadows.colored(colors.success.shadow),
            "&:hover": {
              background: "#059669",
            },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleDateTimePicker;
