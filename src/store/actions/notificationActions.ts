import { AppThunk } from "../index";
import {
  start,
  success,
  failure,
  setNotifications,
  setUnreadCount,
  markAsRead as markAsReadAction,
  markAllAsRead as markAllAsReadAction,
  clearAll as clearAllAction,
} from "../slices/notificationSlice";
import authApi from "../../server/auth";
import axios from "axios";

/**
 * Get all notifications
 */
export const getNotifications = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/notifications");
    const { data } = res;
    
    
    dispatch(setNotifications(data.data));
    dispatch(success());
  } catch (error) {
    dispatch(failure("Bildirishnomalarni yuklashda xatolik"));
    if (axios.isAxiosError(error)) {
      console.error("❌ Notifications Error:", error.response?.data);
    }
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = (): AppThunk => async (dispatch) => {
  try {
    const res = await authApi.get("/notifications/unread-count");
    const { data } = res;
    
    dispatch(setUnreadCount(data.data.count));
  } catch (error) {
    console.error("❌ Unread count Error:", error);
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = (id: string): AppThunk => async (dispatch) => {
  try {
    await authApi.patch(`/notifications/${id}/read`);
    dispatch(markAsReadAction(id));
  } catch (error) {
    console.error("❌ Mark as read Error:", error);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = (): AppThunk => async (dispatch) => {
  try {
    await authApi.patch("/notifications/read-all");
    dispatch(markAllAsReadAction());
  } catch (error) {
    console.error("❌ Mark all as read Error:", error);
  }
};

/**
 * Delete all notifications
 */
export const deleteAllNotifications = (): AppThunk => async (dispatch) => {
  try {
    await authApi.delete("/notifications/all");
    dispatch(clearAllAction());
  } catch (error) {
    console.error("❌ Delete all Error:", error);
    throw error;
  }
};
