const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    expenseHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpenseHeadAccount",
      required: true,
    },

    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
      required: true,
    },

    description: String,

    debitDate: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);