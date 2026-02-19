const mongoose = require("mongoose");

const IncomeHeadAccountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
      trim: true,
    },

    financialProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentFinancialProduct",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyName",
      required: true,
    },

    incomeTaxRefund: {
      type: Number,
      default: 0,
    },

    incomeFromCommission: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* Prevent duplicate account per company */
IncomeHeadAccountSchema.index(
  { accountName: 1, company: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "IncomeHeadAccount",
  IncomeHeadAccountSchema
);
