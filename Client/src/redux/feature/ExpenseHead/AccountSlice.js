import { createSlice } from "@reduxjs/toolkit";
import {
  createExpenseHeadAccount,
  fetchExpenseHeadAccounts,
  fetchExpenseHeadAccountsByHead,
  updateExpenseHeadAccount,
  deleteExpenseHeadAccount,
  toggleExpenseHeadAccount,
} from "./AccountThunx";

const initialState = {
  accounts: [],
  loading: false,
  error: null,
};

const expenseHeadAccountSlice = createSlice({
  name: "expenseHeadAccount",
  initialState,
  reducers: {
    clearExpenseHeadAccountError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* CREATE */
      .addCase(createExpenseHeadAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExpenseHeadAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.unshift(action.payload);
      })
      .addCase(createExpenseHeadAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ALL */
      .addCase(fetchExpenseHeadAccounts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenseHeadAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchExpenseHeadAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* BY HEAD */
      .addCase(fetchExpenseHeadAccountsByHead.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenseHeadAccountsByHead.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchExpenseHeadAccountsByHead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateExpenseHeadAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) state.accounts[index] = action.payload;
      })

      /* DELETE */
      .addCase(deleteExpenseHeadAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(
          (i) => i._id !== action.payload
        );
      })

      /* TOGGLE */
      .addCase(toggleExpenseHeadAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) state.accounts[index] = action.payload;
      });
  },
});

export const { clearExpenseHeadAccountError } =
  expenseHeadAccountSlice.actions;

export default expenseHeadAccountSlice.reducer;