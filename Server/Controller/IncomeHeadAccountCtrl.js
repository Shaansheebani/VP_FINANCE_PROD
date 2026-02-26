const IncomeHeadAccount = require("../Models/IncomeHeadAccountModel");

/* ================= CREATE ================= */
exports.createIncomeHeadAccount = async (req, res) => {
  try {
    const { headRef, subHeadRef, headCustom, subHeadCustom } = req.body;

    /* prevent empty head */
    if (!headRef && !headCustom) {
      return res.status(400).json({
        success: false,
        message: "Head is required",
      });
    }

    const data = await IncomeHeadAccount.create({
      headRef: headRef || null,
      subHeadRef: subHeadRef || null,
      headCustom: headCustom || null,
      subHeadCustom: subHeadCustom || null,
    });

    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllIncomeHeadAccounts = async (req, res) => {
  try {
    const data = await IncomeHeadAccount.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ONLY HEADS ================= */
exports.getHeads = async (req, res) => {
  try {
    const data = await IncomeHeadAccount.find({
      subHead: null,
      isActive: true,
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET SUBHEAD BY HEAD ================= */
exports.getSubHeadsByHead = async (req, res) => {
  try {
    const data = await IncomeHeadAccount.find({
      head: req.params.head,
      subHead: { $ne: null },
      isActive: true,
    });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET SINGLE ================= */
exports.getIncomeHeadAccountById = async (req, res) => {
  try {
    const data = await IncomeHeadAccount.findById(req.params.id);

    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Not found" });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= UPDATE ================= */
exports.updateIncomeHeadAccount = async (req, res) => {
  try {
    const { headRef, subHeadRef, headCustom, subHeadCustom } = req.body;

    if (!headRef && !headCustom) {
      return res.status(400).json({
        success: false,
        message: "Head is required",
      });
    }

    const data = await IncomeHeadAccount.findByIdAndUpdate(
      req.params.id,
      {
        headRef: headRef || null,
        subHeadRef: subHeadRef || null,
        headCustom: headCustom || null,
        subHeadCustom: subHeadCustom || null,
      },
      { new: true }
    );

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
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
