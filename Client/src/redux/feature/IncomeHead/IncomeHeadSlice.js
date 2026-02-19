import { createSlice } from "@reduxjs/toolkit";
import {
  fetchIncomeHeads,
  createIncomeHead,
  deleteIncomeHead,
  updateIncomeHead,
} from "./IncomeHeadThunx";

const initialState = {
  incomeList: [],
  loading: false,
  error: null,
};

const incomeHeadSlice = createSlice({
  name: "incomeHead",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchIncomeHeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomeHeads.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeList = action.payload;
      })
      .addCase(fetchIncomeHeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createIncomeHead.fulfilled, (state, action) => {
        state.incomeList.unshift(action.payload);
      })

      /* UPDATE */
      .addCase(updateIncomeHead.fulfilled, (state, action) => {
        const index = state.incomeList.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) state.incomeList[index] = action.payload;
      })

      /* DELETE */
      .addCase(deleteIncomeHead.fulfilled, (state, action) => {
        state.incomeList = state.incomeList.filter(
          (i) => i._id !== action.payload
        );
      })

      /* GLOBAL LOADING */
      .addMatcher(
        (action) =>
          action.type.startsWith("incomeHead/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("incomeHead/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default incomeHeadSlice.reducer;
