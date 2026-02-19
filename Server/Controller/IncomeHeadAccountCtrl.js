const IncomeHeadAccount = require("../Models/IncomeHeadAccountModel");

/* ================= CREATE ================= */
exports.createIncomeHeadAccount = async (req, res) => {
  try {
    const created = await IncomeHeadAccount.create(req.body);

    const data = await IncomeHeadAccount.findById(created._id)
      .populate("financialProduct", "name")
      .populate("company", "companyName");

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= GET ALL ================= */
exports.getAllIncomeHeadAccounts = async (req, res) => {
  try {
    const data = await IncomeHeadAccount.find({ isActive: true })
      .populate("financialProduct", "name")
      .populate("company", "companyName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET SINGLE ================= */
exports.getIncomeHeadAccountById = async (req, res) => {
  try {
    const data = await IncomeHeadAccount.findById(req.params.id)
      .populate("financialProduct", "name")
      .populate("company", "companyName");

    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateIncomeHeadAccount = async (req, res) => {
  try {
    await IncomeHeadAccount.findByIdAndUpdate(req.params.id, req.body);

    const data = await IncomeHeadAccount.findById(req.params.id)
      .populate("financialProduct", "name")
      .populate("company", "companyName");

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ================= SOFT DELETE ================= */
exports.deleteIncomeHeadAccount = async (req, res) => {
  try {
    await IncomeHeadAccount.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    res.json({
      success: true,
      message: "Income head account deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
