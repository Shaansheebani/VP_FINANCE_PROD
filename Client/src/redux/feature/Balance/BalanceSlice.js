import { createSlice } from "@reduxjs/toolkit";
import { fetchBankWiseBalance, fetchBankLedger } from "./BalanceThunks";

const initialState = {
  bankSummary: [],
  totals: null,
  ledger: [],
  openingBalance: 0,
  loading: false,
  error: null,
};

const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankWiseBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBankWiseBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.bankSummary = action.payload.bankSummary;
        state.totals = {
          totalIncome: action.payload.totalIncome,
          totalExpense: action.payload.totalExpense,
          overallBalance: action.payload.overallBalance,
        };
      })
      .addCase(fetchBankLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.openingBalance = action.payload.openingBalance;
        state.ledger = action.payload.ledger;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default balanceSlice.reducer;