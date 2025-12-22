
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from "@mui/material";
import { MOCK_USERS, MockUser, setMockUser } from "../utils/mock-auth";
import { Settings } from "lucide-react";

interface MockAuthDialogProps {
  open: boolean;
  onClose: (user: MockUser | null) => void;
}

export const MockAuthDialog: React.FC<MockAuthDialogProps> = ({
  open,
  onClose,
}) => {
  const [customMode, setCustomMode] = useState(false);
  const [customData, setCustomData] = useState({
    _id: "",
    telegramId: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "manager",
  });

  const handleQuickLogin = (user: MockUser) => {
    setMockUser(user);
    onClose(user);
  };

  const handleCustomLogin = () => {
    const user: MockUser = {
      _id: customData._id,
      telegramId: customData.telegramId,
      firstName: customData.firstName,
      lastName: customData.lastName,
      phone: customData.phone,
      role: customData.role,
    };
    setMockUser(user);
    onClose(user);
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        <Settings />Mock Authentication (Development Only)
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Localhost'da test qilish uchun foydalanuvchi tanlang
        </Typography>

        {!customMode ? (
          <>
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              {MOCK_USERS.map((user) => (
                <Card key={user._id} variant="outlined">
                  <CardActionArea onClick={() => handleQuickLogin(user)}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="h6">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.phone}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontFamily: "monospace" }}
                          >
                            ID: {user._id}
                          </Typography>
                        </Box>
                        <Chip
                          label={user.role.toUpperCase()}
                          color={
                            user.role === "admin"
                              ? "error"
                              : user.role === "manager"
                              ? "primary"
                              : "default"
                          }
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => setCustomMode(true)}
            >
              Qo'lda Ma'lumot Kiritish
            </Button>
          </>
        ) : (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Employee ID (_id)"
              fullWidth
              value={customData._id}
              onChange={(e) =>
                setCustomData({ ...customData, _id: e.target.value })
              }
              placeholder="686e7881ab577df7c3eb3db2"
              helperText="MongoDB ObjectId"
            />
            <TextField
              label="Telegram ID"
              fullWidth
              value={customData.telegramId}
              onChange={(e) =>
                setCustomData({ ...customData, telegramId: e.target.value })
              }
              placeholder="123456789"
            />
            <TextField
              label="Ism"
              fullWidth
              value={customData.firstName}
              onChange={(e) =>
                setCustomData({ ...customData, firstName: e.target.value })
              }
            />
            <TextField
              label="Familiya"
              fullWidth
              value={customData.lastName}
              onChange={(e) =>
                setCustomData({ ...customData, lastName: e.target.value })
              }
            />
            <TextField
              label="Telefon"
              fullWidth
              value={customData.phone}
              onChange={(e) =>
                setCustomData({ ...customData, phone: e.target.value })
              }
              placeholder="+998901234567"
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={customData.role}
                label="Role"
                onChange={(e) =>
                  setCustomData({ ...customData, role: e.target.value })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="seller">Seller</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setCustomMode(false)}
              >
                Orqaga
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCustomLogin}
                disabled={!customData._id || !customData.telegramId}
              >
                Kirish
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Bekor qilish</Button>
      </DialogActions>
    </Dialog>
  );
};
