import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

/* ================= FETCH ================= */
export const fetchIncomeHeadAccounts = createAsyncThunk(
  "incomeHeadAccount/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/income-head-account");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= CREATE ================= */
export const createIncomeHeadAccount = createAsyncThunk(
  "incomeHeadAccount/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/income-head-account", data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= UPDATE ================= */
export const updateIncomeHeadAccount = createAsyncThunk(
  "incomeHeadAccount/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/income-head-account/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= DELETE ================= */
export const deleteIncomeHeadAccount = createAsyncThunk(
  "incomeHeadAccount/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/income-head-account/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
