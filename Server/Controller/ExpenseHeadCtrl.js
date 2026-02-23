const Expense = require("../Models/ExpenseHeadModel");

// ✅ Create Expense
exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Expenses (with populate)
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("expenseHead")
      .populate("bank")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Expense
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("expenseHead")
      .populate("bank");

    if (!expense)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!expense)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.status(200).json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};