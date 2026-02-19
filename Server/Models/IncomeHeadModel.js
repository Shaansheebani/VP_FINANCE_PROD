const mongoose = require("mongoose");

const incomeHeadSchema = new mongoose.Schema(
  {
    accountHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncomeHeadAccount",
      required: true,
    },

    description: String,

    creditDate: {
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

module.exports = mongoose.model("IncomeHead", incomeHeadSchema);
