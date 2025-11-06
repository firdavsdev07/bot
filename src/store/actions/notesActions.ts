/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { start, failure, setNotes } from "../slices/notesSlice";

import type { AppThunk } from "../index";
import authApi from "../../server/auth";
import { INote } from "../../types/Notes";

export const getNotes =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      const res = await authApi.get(`/notes/get-by-id/${id}`);
      const { data } = res;
      dispatch(setNotes(data.data));
    } catch (error: any) {
      dispatch(failure());
    }
  };

export const addNotes =
  (notesData: INote): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.post("/notes/add", notesData);
      dispatch(getNotes(notesData.customerId));
    } catch (error: any) {
      dispatch(failure());
    }
  };
