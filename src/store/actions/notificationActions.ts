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
      console.error("Notifications Error:", error.response?.data);
    }
  }
};

export const getUnreadCount = (): AppThunk => async (dispatch) => {
  try {
    const res = await authApi.get("/notifications/unread-count");
    const { data } = res;
    
    dispatch(setUnreadCount(data.data.count));
  } catch (error) {
    console.error("Unread count Error:", error);
  }
};


export const markNotificationAsRead = (id: string): AppThunk => async (dispatch) => {
  try {
    await authApi.patch(`/notifications/${id}/read`);
    dispatch(markAsReadAction(id));
  } catch (error) {
    console.error(" Mark as read Error:", error);
  }
};


export const markAllNotificationsAsRead = (): AppThunk => async (dispatch) => {
  try {
    await authApi.patch("/notifications/read-all");
    dispatch(markAllAsReadAction());
  } catch (error) {
    console.error(" Mark all as read Error:", error);
  }
};


export const deleteAllNotifications = (): AppThunk => async (dispatch) => {
  try {
    await authApi.delete("/notifications/all");
    dispatch(clearAllAction());
  } catch (error) {
    console.error("Delete all Error:", error);
    throw error;
  }
};
