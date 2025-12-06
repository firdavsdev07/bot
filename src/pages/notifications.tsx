import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Button, IconButton, Card, CardContent, Chip, Stack } from "@mui/material";
import { Bell, CheckCheck, Trash2, Clock, CheckCircle, XCircle, RefreshCw, User, Calendar, TrendingUp, AlertTriangle, Package } from "lucide-react";
import { 
  AttachMoney, 
} from "@mui/icons-material";
import { useAlert } from "../components/AlertSystem";
import { RootState } from "../store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
} from "../store/actions/notificationActions";
import { formatDistanceToNow } from "date-fns";
import { uz } from "date-fns/locale";

interface TabPageProps {
  activeTabIndex: number;
  index: number;
}

export default function NotificationsPage({ activeTabIndex, index }: TabPageProps) {
  const dispatch = useAppDispatch();
  const { showConfirm, showError, showSuccess } = useAlert();
  const { notifications, unreadCount, isLoading } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    if (activeTabIndex === index) {
      dispatch(getNotifications());
    }
  }, [activeTabIndex, index, dispatch]);

  const handleRefresh = () => {
    dispatch(getNotifications());
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDeleteAll = async () => {
    showConfirm({
      type: 'delete',
      title: 'Bildirishnomalarni o\'chirish',
      message: 'Barcha bildirishnomalarni o\'chirishni xohlaysizmi? Bu amalni bekor qilib bo\'lmaydi.',
      confirmText: 'O\'chirish',
      cancelText: 'Bekor qilish',
      onConfirm: async () => {
        try {
          await dispatch(deleteAllNotifications());
          showSuccess('Barcha bildirishnomalar o\'chirildi', 'Muvaffaqiyat');
        } catch (error) {
          showError('Bildirishnomalarni o\'chirishda xatolik yuz berdi', 'Xatolik');
        }
      }
    });
  };

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      dispatch(markNotificationAsRead(notificationId));
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Bell size={24} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Bildirishnomalar
            </Typography>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                size="small"
                color="error"
                sx={{ height: 24, minWidth: 24 }}
              />
            )}
          </Stack>

          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={20} />
          </IconButton>
        </Stack>

        {/* Actions */}
        {notifications.length > 0 && (
          <Stack direction="row" spacing={1} mt={2}>
            {unreadCount > 0 && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<CheckCheck size={16} />}
                onClick={handleMarkAllAsRead}
              >
                Hammasini o'qilgan
              </Button>
            )}
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<Trash2 size={16} />}
              onClick={handleDeleteAll}
            >
              Hammasini o'chirish
            </Button>
          </Stack>
        )}
      </Box>

      {/* Notifications List */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Typography color="text.secondary">Yuklanmoqda...</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              gap: 2,
            }}
          >
            <Bell size={64} color="#ccc" />
            <Typography variant="h6" color="text.secondary">
              Bildirishnomalar yo'q
            </Typography>
            <Typography variant="body2" color="text.secondary">
              To'lovlar tasdiqlanganda bu yerda ko'rinadi
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {notifications.map((notification) => (
              <Card
                key={notification._id}
                onClick={() =>
                  handleNotificationClick(notification._id, notification.isRead)
                }
                sx={{
                  cursor: "pointer",
                  border: notification.isRead ? 1 : 2,
                  borderColor: notification.isRead
                    ? "divider"
                    : notification.type === "PAYMENT_APPROVED"
                    ? "success.main"
                    : "error.main",
                  bgcolor: notification.isRead ? "background.paper" : "action.hover",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                          notification.type === "PAYMENT_APPROVED"
                            ? "success.lighter"
                            : "error.lighter",
                      }}
                    >
                      {notification.type === "PAYMENT_APPROVED" ? (
                        <CheckCircle
                          size={24}
                          color={notification.type === "PAYMENT_APPROVED" ? "#2e7d32" : "#d32f2f"}
                        />
                      ) : (
                        <XCircle size={24} color="#d32f2f" />
                      )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          {notification.title}
                        </Typography>
                        {!notification.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                            }}
                          />
                        )}
                      </Stack>

                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        {notification.message}
                      </Typography>

                      {/* Details */}
                      <Box mt={1.5}>
                        <Stack direction="row" spacing={1} mb={1} flexWrap="wrap">
                          <Chip
                            icon={<User size={12} />}
                            label={notification.data.customerName}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24, fontSize: "0.75rem" }}
                          />
                          <Chip
                            icon={<AttachMoney sx={{ fontSize: '0.8rem !important' }} />}
                            label={`$${notification.data.amount.toFixed(2)}`}
                            size="small"
                            color={notification.data.status === 'OVERPAID' ? 'warning' : notification.data.status === 'UNDERPAID' ? 'error' : 'primary'}
                            sx={{ height: 24, fontSize: "0.75rem" }}
                          />
                          {(notification.data as any).monthNumber && (
                            <Chip
                              icon={<Calendar size={12} />}
                              label={`${(notification.data as any).monthNumber}-oy`}
                              size="small"
                              color="secondary"
                              sx={{ height: 24, fontSize: "0.75rem" }}
                            />
                          )}
                          {(notification.data as any).paymentType && (
                            <Chip
                              icon={
                                (notification.data as any).paymentType === 'FULL' ? <CheckCircle size={12} /> :
                                (notification.data as any).paymentType === 'EXCESS' ? <TrendingUp size={12} /> : 
                                <AlertTriangle size={12} />
                              }
                              label={
                                (notification.data as any).paymentType === 'FULL' ? 'To\'liq' :
                                (notification.data as any).paymentType === 'EXCESS' ? 'Ortiqcha' : 
                                'Qisman'
                              }
                              size="small"
                              variant="outlined"
                              sx={{ height: 24, fontSize: "0.65rem" }}
                            />
                          )}
                        </Stack>
                        
                        {/* Product Name */}
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "action.hover",
                            p: 0.5,
                            borderRadius: 0.5,
                            fontSize: "0.7rem"
                          }}
                        >
                          <Package size={12} style={{ marginRight: 4 }} />
                          {notification.data.productName}
                        </Typography>
                      </Box>

                      {/* Time */}
                      <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                        <Clock size={12} color="#999" />
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: uz,
                          })}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
