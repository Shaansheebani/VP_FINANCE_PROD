const mongoose = require("mongoose");

const OfficePurchaseSchema = new mongoose.Schema(
  {
    vrNo: {
      type: String,
      required: true,
      trim: true,
    },

    invoiceNo: {
      type: String,
      required: true,
      trim: true,
    },

    transactionDate: {
      type: Date,
      required: true,
      index: true,
    },

    // Head (IncomeExpenseAccount)
    accountRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncomeExpenseAccount",
      required: true,
      index: true,
    },

    // Bank
    bankRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
      index: true,
    },

    itemParticulars: {
      type: String,
      required: true,
      trim: true,
    },

    ratePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Auto-created expense entry reference
    incomeExpenseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncomeExpense",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OfficePurchase", OfficePurchaseSchema);