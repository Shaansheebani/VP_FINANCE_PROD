import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "/api/expense";

// ✅ Create
export const createExpense = createAsyncThunk(
  "expense/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(BASE_URL, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ Get All
export const fetchExpenses = createAsyncThunk(
  "expense/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ Update
export const updateExpense = createAsyncThunk(
  "expense/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ Delete
export const deleteExpense = createAsyncThunk(
  "expense/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);