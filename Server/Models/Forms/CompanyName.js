const mongoose = require("mongoose");

const companyNameSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DepartmentFinancialProduct",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyName", companyNameSchema);
