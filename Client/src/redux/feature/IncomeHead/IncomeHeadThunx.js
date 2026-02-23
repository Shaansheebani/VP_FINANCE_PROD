import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../config/axios";

/* ================= FETCH ================= */
export const fetchIncomeHeads = createAsyncThunk(
  "incomeHead/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/income-head");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= CREATE ================= */
export const createIncomeHead = createAsyncThunk(
  "incomeHead/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/income-head", data);
      return res.data.data; // populated accountHead
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= UPDATE ================= */
export const updateIncomeHead = createAsyncThunk(
  "incomeHead/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/income-head/${id}`, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* ================= DELETE ================= */
export const deleteIncomeHead = createAsyncThunk(
  "incomeHead/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/income-head/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);