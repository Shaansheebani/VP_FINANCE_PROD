const mongoose = require("mongoose");

const IncomeHeadAccountSchema = new mongoose.Schema(
  {
    /* Structured mode */
    headRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinancialProduct",
      default: null,
    },

    subHeadRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    /* Custom mode */
    headCustom: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    subHeadCustom: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncomeHeadAccount", IncomeHeadAccountSchema);