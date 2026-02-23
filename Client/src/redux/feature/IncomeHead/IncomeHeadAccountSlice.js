import { createSlice } from "@reduxjs/toolkit";
import {
  fetchIncomeHeadAccounts,
  createIncomeHeadAccount,
  updateIncomeHeadAccount,
  deleteIncomeHeadAccount,
  fetchHeads,
  fetchSubHeads,
} from "./IncomeHeadAccountThunx";

const initialState = {
  accounts: [],
  heads: [],
  subHeads: [],
  loading: false,
  error: null,
};

const incomeHeadAccountSlice = createSlice({
  name: "incomeHeadAccount",
  initialState,
  reducers: {
    clearSubHeads: (state) => {
      state.subHeads = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH ALL ================= */
      .addCase(fetchIncomeHeadAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomeHeadAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchIncomeHeadAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH HEADS ================= */
      .addCase(fetchHeads.fulfilled, (state, action) => {
        state.heads = action.payload;
      })

      /* ================= FETCH SUBHEADS ================= */
      .addCase(fetchSubHeads.fulfilled, (state, action) => {
        state.subHeads = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(createIncomeHeadAccount.fulfilled, (state, action) => {
        state.accounts.unshift(action.payload);
      })

      /* ================= UPDATE ================= */
      .addCase(updateIncomeHeadAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) state.accounts[index] = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deleteIncomeHeadAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(
          (a) => a._id !== action.payload
        );
      });
  },
});

export const { clearSubHeads } = incomeHeadAccountSlice.actions;
export default incomeHeadAccountSlice.reducer;