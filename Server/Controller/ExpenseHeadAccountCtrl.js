const ExpenseHeadAccount = require("../Models/ExpenseHeadAccountModel");

/**
 * CREATE
 */
exports.createExpenseHeadAccount = async (req, res) => {
  try {
    const { head, subHead, isActive } = req.body;

    if (!head) {
      return res.status(400).json({ message: "Head is required" });
    }

    const data = await ExpenseHeadAccount.create({
      head,
      subHead,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Expense Head Account created",
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET ALL
 */
exports.getAllExpenseHeadAccounts = async (req, res) => {
  try {
    const data = await ExpenseHeadAccount.find()
      .populate("head", "headName") // change field if different
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET BY HEAD
 */
exports.getAccountsByHead = async (req, res) => {
  try {
    const { headId } = req.params;

    const data = await ExpenseHeadAccount.find({ head: headId })
      .populate("head", "headName")
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE
 */
exports.updateExpenseHeadAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ExpenseHeadAccount.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate("head", "headName");

    if (!data) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      success: true,
      message: "Expense Head Account updated",
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE
 */
exports.deleteExpenseHeadAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ExpenseHeadAccount.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      success: true,
      message: "Expense Head Account deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * TOGGLE ACTIVE
 */
exports.toggleActiveExpenseHeadAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await ExpenseHeadAccount.findById(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.isActive = !account.isActive;
    await account.save();

    res.json({
      success: true,
      message: "Status updated",
      data: account,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};