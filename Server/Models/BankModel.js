const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },

    ifsc: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* prevent duplicate account number */
BankSchema.index({ accountNumber: 1 }, { unique: true });

module.exports = mongoose.model("Bank", BankSchema);