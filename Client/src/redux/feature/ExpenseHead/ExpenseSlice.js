import { createSlice } from "@reduxjs/toolkit";
import {
  createExpense,
  fetchExpenses,
  updateExpense,
  deleteExpense,
} from "./ExpenseThunks";

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ✅ Fetch
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Create
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      })

      // ✅ Update
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) state.expenses[index] = action.payload;
      })

      // ✅ Delete
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(
          (e) => e._id !== action.payload
        );
      });
  },
});

export default expenseSlice.reducer;