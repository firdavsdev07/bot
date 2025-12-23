import { FC, useState, useRef, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/uz-latn";
dayjs.locale("uz-latn");

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Calendar, Clock, Check, X, ArrowLeft } from "lucide-react";
import { borderRadius, shadows, colors } from "../../theme/colors";
import { motion, AnimatePresence } from "framer-motion";

interface ModernDateTimePickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

const ModernDateTimePicker: FC<ModernDateTimePickerProps> = ({
  open,
  onClose,
  onConfirm,
  initialDate,
  minDate,
  maxDate,
}) => {
  const [step, setStep] = useState<"date" | "time">("date");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(
    initialDate ? dayjs(initialDate) : dayjs()
  );
  const [selectedHour, setSelectedHour] = useState(
    initialDate ? dayjs(initialDate).hour() : 12
  );
  const [selectedMinute, setSelectedMinute] = useState(
    initialDate ? dayjs(initialDate).minute() : 0
  );

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 40;
  const VISIBLE_ITEMS = 5;
  const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
  const CENTER_OFFSET = ITEM_HEIGHT * 2;

  const scrollToValue = (ref: HTMLDivElement | null, value: number) => {
    if (!ref) return;
    ref.scrollTo({ top: value * ITEM_HEIGHT, behavior: "smooth" });
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handler = (ref: any, setter: any, max: number) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!ref.current) return;
        const index = Math.round(ref.current.scrollTop / ITEM_HEIGHT);
        const normalized = ((index % max) + max) % max;
        setter(normalized);
        scrollToValue(ref.current, normalized);
      }, 120);
    };

    const hourHandler = () => handler(hourScrollRef, setSelectedHour, 24);
    const minuteHandler = () => handler(minuteScrollRef, setSelectedMinute, 60);

    const hourEl = hourScrollRef.current;
    const minuteEl = minuteScrollRef.current;

    hourEl?.addEventListener("scroll", hourHandler, { passive: true });
    minuteEl?.addEventListener("scroll", minuteHandler, { passive: true });

    return () => {
      hourEl?.removeEventListener("scroll", hourHandler);
      minuteEl?.removeEventListener("scroll", minuteHandler);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (step === "time") {
      setTimeout(() => {
        scrollToValue(hourScrollRef.current, selectedHour);
        scrollToValue(minuteScrollRef.current, selectedMinute);
      }, 150);
    }
  }, [step]);

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate && newDate.isValid()) {
      setSelectedDate(newDate);
      setTimeout(() => setStep("time"), 350);
    }
  };

  const handleConfirm = () => {
    const finalDate = selectedDate
      .hour(selectedHour)
      .minute(selectedMinute)
      .second(0)
      .millisecond(0);
    onConfirm(finalDate.toDate());
    onClose();
  };

  const handleBack = () => setStep("date");
  const handleClose = () => {
    setStep("date");
    onClose();
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: borderRadius.xl },
          m: { xs: 0, sm: 2 },
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 2,
          pt: 3,
          px: 3,
        }}
      >
        {step === "date" ? <Calendar size={20} /> : <Clock size={20} />}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {step === "date" ? "Sana tanlang" : "Vaqt tanlang"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 1, sm: 3 }, py: 0, overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          {/* DATE STEP */}
          {step === "date" && (
            <motion.div
              key="date"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Box sx={{ mb: 2, textAlign: "center", pt: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Tanlangan sana
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {selectedDate.format("DD MMMM YYYY")}
                </Typography>
                <Typography variant="body2" color="primary">
                  {selectedDate.format("dddd")}
                </Typography>
              </Box>

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="uz-latn"
              >
                <StaticDatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={minDate ? dayjs(minDate) : undefined}
                  maxDate={maxDate ? dayjs(maxDate) : undefined}
                  slotProps={{
                    toolbar: { hidden: true },
                    actionBar: { actions: [] },
                  }}
                  sx={{
                    width: "100%",
                    // GORIZONTAL SCROLLNI BUTUNLAY OLDIK
                    "& .MuiPickersCalendar-root": {
                      overflowX: "hidden !important",
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": { display: "none" },
                    },
                    "& .MuiDayCalendar-weekContainer": {
                      justifyContent: "space-between",
                      mx: 0.5,
                    },
                    "& .MuiPickersDay-root": {
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      width: { xs: 36, sm: 42 },
                      height: { xs: 36, sm: 42 },
                      mx: 0.3,
                    },
                  }}
                />
              </LocalizationProvider>
            </motion.div>
          )}

          {/* TIME STEP */}
          {step === "time" && (
            <motion.div
              key="time"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Box sx={{ textAlign: "center", my: 4 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.8rem", sm: "3.4rem" },
                    fontFamily: "monospace",
                    color: "primary.main",
                    letterSpacing: "0.1em",
                  }}
                >
                  {String(selectedHour).padStart(2, "0")}:
                  {String(selectedMinute).padStart(2, "0")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 2,
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  Soat
                </Typography>
                <Box sx={{ width: 20 }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  Daqiqa
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: `${CENTER_OFFSET}px`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "88%",
                    height: `${ITEM_HEIGHT}px`,
                    bgcolor: "rgba(102, 126, 234, 0.08)",
                    borderRadius: borderRadius.md,
                    border: "2px solid",
                    borderColor: "primary.main",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />

                <Box
                  ref={hourScrollRef}
                  sx={{
                    flex: 1,
                    maxWidth: 100,
                    height: `${CONTAINER_HEIGHT}px`,
                    overflowY: "scroll",
                    scrollSnapType: "y mandatory",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    py: `${ITEM_HEIGHT * 2}px`,
                  }}
                >
                  {hours.map((h, i) => (
                    <Box
                      key={i}
                      onClick={() => {
                        setSelectedHour(i);
                        scrollToValue(hourScrollRef.current, i);
                      }}
                      sx={{
                        height: ITEM_HEIGHT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        scrollSnapAlign: "center",
                        fontWeight: selectedHour === i ? 700 : 500,
                        fontSize: selectedHour === i ? "1.6rem" : "1rem",
                        color:
                          selectedHour === i
                            ? "primary.main"
                            : "text.secondary",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {h}
                    </Box>
                  ))}
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    alignSelf: "center",
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  :
                </Typography>

                <Box
                  ref={minuteScrollRef}
                  sx={{
                    flex: 1,
                    maxWidth: 100,
                    height: `${CONTAINER_HEIGHT}px`,
                    overflowY: "scroll",
                    scrollSnapType: "y mandatory",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    py: `${ITEM_HEIGHT * 2}px`,
                  }}
                >
                  {minutes.map((m, i) => (
                    <Box
                      key={i}
                      onClick={() => {
                        setSelectedMinute(i);
                        scrollToValue(minuteScrollRef.current, i);
                      }}
                      sx={{
                        height: ITEM_HEIGHT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        scrollSnapAlign: "center",
                        fontWeight: selectedMinute === i ? 700 : 500,
                        fontSize: selectedMinute === i ? "1.6rem" : "1rem",
                        color:
                          selectedMinute === i ? "info.main" : "text.secondary",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {m}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center", mt: 2 }}
              >
                Scroll qilib yoki bosib tanlang
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>

      {/* IMPROVED ACTION BUTTONS */}
      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          gap: 1.5,
          justifyContent: step === "time" ? "space-between" : "flex-end",
          bgcolor: "background.paper",
        }}
      >
        {step === "time" && (
          <IconButton
            onClick={handleBack}
            sx={{
              bgcolor: "rgba(102, 126, 234, 0.08)",
              color: "primary.main",
              "&:hover": {
                bgcolor: "rgba(102, 126, 234, 0.15)",
              },
            }}
            size="large"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </IconButton>
        )}

        <Box sx={{ display: "flex", gap: 1.5, ml: "auto" }}>
          <IconButton
            onClick={handleClose}
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.04)",
              color: "text.secondary",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.08)",
                color: "error.main",
              },
            }}
            size="large"
          >
            <X size={22} strokeWidth={2.5} />
          </IconButton>

          {step === "time" && (
            <IconButton
              onClick={handleConfirm}
              sx={{
                bgcolor: colors.success.main,
                color: "white",
                boxShadow: shadows.colored(colors.success.shadow),
                minWidth: 56,
                minHeight: 56,
                "&:hover": {
                  bgcolor: colors.success.dark,
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
              size="large"
            >
              <Check size={26} strokeWidth={2.5} />
            </IconButton>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ModernDateTimePicker;
