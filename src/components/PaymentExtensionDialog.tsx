import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Calendar, Clock } from "lucide-react";
import { DateRange } from "@mui/icons-material";
import "./TimePickerModal.css";
import { borderRadius, shadows } from "../theme/colors";

interface TimePickerModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

interface PickerColumnProps {
  items: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  itemHeight?: number;
  visibleItemCount?: number;
}

const PickerColumn: React.FC<PickerColumnProps> = ({
  items,
  selectedValue,
  onSelect,
  itemHeight = 40,
  visibleItemCount = 5,
}) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToSelected = useCallback(() => {
    if (!columnRef.current) return;

    const selectedIndex = items.findIndex(
      (item) => item.value === selectedValue
    );
    const scrollTo = selectedIndex * itemHeight;
    columnRef.current.scrollTo({ top: scrollTo, behavior: "auto" });
  }, [selectedValue, items, itemHeight]);

  useEffect(() => {
    if (!isScrolling) scrollToSelected();
  }, [scrollToSelected, isScrolling]);

  useEffect(() => {
    let timeout: any;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!columnRef.current) return;
        const scrollTop = columnRef.current.scrollTop;
        const index = Math.round(scrollTop / itemHeight);
        const selected = items[index];
        if (selected) onSelect(selected.value);
        setIsScrolling(false);
      }, 100);
    };

    const ref = columnRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [items, itemHeight, onSelect]);

  return (
    <div
      ref={columnRef}
      className="picker-column"
      style={{
        height: itemHeight * visibleItemCount,
        scrollSnapType: "y mandatory",
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`picker-item ${
            item.value === selectedValue ? "selected" : ""
          }`}
          style={{ height: itemHeight, scrollSnapAlign: "center" }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        label: date.toLocaleDateString("uz-UZ", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        value: date.toISOString().split("T")[0],
      };
    });
  }, [today]);

  const hours = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const h = i.toString().padStart(2, "0");
      return { label: h, value: h };
    });
  }, []);

  const minutes = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const m = (i * 5).toString().padStart(2, "0");
      return { label: m, value: m };
    });
  }, []);

  const [selected, setSelected] = useState({
    day: days[0].value,
    hour: hours[0].value,
    minute: minutes[0].value,
  });

  const handleDaySelect = (value: string) => {
    setSelected((prev) => ({ ...prev, day: value }));
  };

  const handleHourSelect = (value: string) => {
    setSelected((prev) => ({ ...prev, hour: value }));
  };

  const handleMinuteSelect = (value: string) => {
    setSelected((prev) => ({ ...prev, minute: value }));
  };

  const handleConfirm = () => {
    const date = new Date(selected.day);
    date.setHours(parseInt(selected.hour));
    date.setMinutes(parseInt(selected.minute));
    onConfirm(date.toISOString());
    onClose();
  };

  const formattedLabel = useMemo(() => {
    const date = new Date(selected.day);
    return `${date.toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "long",
    })} kuni soat ${selected.hour}:${selected.minute} da yuborilsin`;
  }, [selected]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: borderRadius.lg,
          boxShadow: shadows.xl,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 1,
              bgcolor: "info.main",
              borderRadius: borderRadius.sm,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={24} color="white" />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Vaqtni tanlang
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box 
          display="flex" 
          justifyContent="center" 
          gap={1.5} 
          mt={2}
          sx={{
            p: 2,
            bgcolor: "rgba(79, 172, 254, 0.08)",
            borderRadius: borderRadius.md,
          }}
        >
          <PickerColumn
            items={days}
            selectedValue={selected.day}
            onSelect={handleDaySelect}
          />
          <Box sx={{ display: "flex", alignItems: "center", opacity: 0.5 }}>
            <Clock size={16} />
          </Box>
          <PickerColumn
            items={hours}
            selectedValue={selected.hour}
            onSelect={handleHourSelect}
          />
          <Typography variant="h6" sx={{ alignSelf: "center", opacity: 0.5 }}>:</Typography>
          <PickerColumn
            items={minutes}
            selectedValue={selected.minute}
            onSelect={handleMinuteSelect}
          />
        </Box>
        <Box 
          sx={{ 
            mt: 2.5, 
            p: 2,
            bgcolor: "primary.lighter",
            borderRadius: borderRadius.md,
            border: "1px solid",
            borderColor: "primary.light",
          }}
        >
          <Typography 
            sx={{ 
              textAlign: "center",
              fontWeight: 600,
              color: "primary.dark",
              fontSize: "0.95rem",
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DateRange sx={{ fontSize: '1rem', mr: 0.5 }} />
              {formattedLabel}
            </Box>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1.5 }}>
        <Button 
          onClick={onClose}
          fullWidth
          variant="outlined"
          sx={{
            py: 1.5,
            borderRadius: borderRadius.md,
            fontWeight: 600,
          }}
        >
          Bekor qilish
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: borderRadius.md,
            fontWeight: 700,
            background: "#0ea5e9",
            boxShadow: shadows.colored("rgba(14, 165, 233, 0.15)"),
            "&:hover": {
              background: "#0284c7",
            },
          }}
        >
          Tasdiqlash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimePickerModal;
