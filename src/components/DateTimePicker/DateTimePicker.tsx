import { FC } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker as MUIDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/uz-latn";
import { Box } from "@mui/material";
import { Calendar } from "lucide-react";
import { borderRadius } from "../../theme/colors";

interface DateTimePickerProps {
  value: Date | string | null;
  onChange: (date: Date | null) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const DateTimePicker: FC<DateTimePickerProps> = ({
  value,
  onChange,
  label = "Sana va vaqtni tanlang",
  minDate,
  maxDate,
  disabled = false,
}) => {
  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.toDate());
    } else {
      onChange(null);
    }
  };

  const dayjsValue = value ? dayjs(value) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uz-latn">
      <Box sx={{ position: "relative" }}>
        <MUIDateTimePicker
          label={label}
          value={dayjsValue}
          onChange={handleChange}
          disabled={disabled}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          format="DD.MM.YYYY HH:mm"
          ampm={false}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: borderRadius.md,
                  bgcolor: "background.paper",
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              },
            },
            actionBar: {
              actions: ["clear", "accept"],
            },
          }}
          slots={{
            openPickerIcon: () => <Calendar size={20} color="#667eea" />,
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateTimePicker;
