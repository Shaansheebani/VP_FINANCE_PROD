import axios from "../../../config/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// bank-wise summary
export const fetchBankWiseBalance = createAsyncThunk(
  "balance/fetchBankWise",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`/api/balance/bank-wise?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// bank ledger
export const fetchBankLedger = createAsyncThunk(
  "balance/fetchLedger",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`/api/balance/bank-ledger?${query}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);