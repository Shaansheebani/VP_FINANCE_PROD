import axios from "../../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

/* CREATE */
export const createExpenseHeadAccount = createAsyncThunk(
  "expenseHeadAccount/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/expense-head-account", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* GET ALL */
export const fetchExpenseHeadAccounts = createAsyncThunk(
  "expenseHeadAccount/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/expense-head-account");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* GET BY HEAD */
export const fetchExpenseHeadAccountsByHead = createAsyncThunk(
  "expenseHeadAccount/byHead",
  async (headId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/expense-head-account/head/${headId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* UPDATE */
export const updateExpenseHeadAccount = createAsyncThunk(
  "expenseHeadAccount/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/expense-head-account/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* DELETE */
export const deleteExpenseHeadAccount = createAsyncThunk(
  "expenseHeadAccount/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/expense-head-account/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* TOGGLE ACTIVE */
export const toggleExpenseHeadAccount = createAsyncThunk(
  "expenseHeadAccount/toggle",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/expense-head-account/toggle/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);