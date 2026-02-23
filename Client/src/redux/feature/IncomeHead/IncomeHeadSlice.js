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

      /* ================= FETCH ================= */
      .addCase(fetchIncomeHeads.fulfilled, (state, action) => {
        state.incomeList = action.payload;
        state.error = null;
      })

      /* ================= CREATE ================= */
      .addCase(createIncomeHead.fulfilled, (state, action) => {
        state.incomeList.unshift(action.payload);
        state.error = null;
      })

      /* ================= UPDATE ================= */
      .addCase(updateIncomeHead.fulfilled, (state, action) => {
        const index = state.incomeList.findIndex(
          (i) => i._id === action.payload._id
        );

        if (index !== -1) {
          state.incomeList.splice(index, 1);
          state.incomeList.unshift(action.payload);
        }

        state.error = null;
      })

      /* ================= DELETE ================= */
      .addCase(deleteIncomeHead.fulfilled, (state, action) => {
        state.incomeList = state.incomeList.filter(
          (i) => i._id !== action.payload
        );
      })

      /* ================= GLOBAL MATCHERS ================= */
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
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("incomeHead/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error?.message;
        }
      );
  },
});

export default incomeHeadSlice.reducer;