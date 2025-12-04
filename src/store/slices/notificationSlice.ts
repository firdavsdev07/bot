import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface INotification {
  _id: string;
  managerId: string;
  type: "PAYMENT_APPROVED" | "PAYMENT_REJECTED";
  title: string;
  message: string;
  data: {
    paymentId: string;
    customerId: string;
    customerName: string;
    contractId: string;
    productName: string;
    amount: number;
    status: string;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    start(state) {
      state.isLoading = true;
      state.error = null;
    },
    success(state) {
      state.isLoading = false;
      state.error = null;
    },
    failure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setNotifications(state, action: PayloadAction<INotification[]>) {
      state.notifications = action.payload;
      state.isLoading = false;
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach(n => n.isRead = true);
      state.unreadCount = 0;
    },
    clearAll(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  start,
  success,
  failure,
  setNotifications,
  setUnreadCount,
  markAsRead,
  markAllAsRead,
  clearAll,
} = notificationSlice.actions;

export default notificationSlice.reducer;
