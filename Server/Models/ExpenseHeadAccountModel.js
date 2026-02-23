const mongoose = require("mongoose");

const expenseHeadAccountSchema = new mongoose.Schema(
  {
    head: {
      type: String,
      required: true,
    },
    subHead: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ExpenseHeadAccount",
  expenseHeadAccountSchema
);