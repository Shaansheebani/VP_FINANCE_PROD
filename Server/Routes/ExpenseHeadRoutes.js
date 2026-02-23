const express = require("express");
const router = express.Router();

const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../Controller/ExpenseHeadCtrl");

// ✅ Create
router.post("/", createExpense);

// ✅ Get All
router.get("/", getAllExpenses);

// ✅ Get Single
router.get("/:id", getExpenseById);

// ✅ Update
router.put("/:id", updateExpense);

// ✅ Delete
router.delete("/:id", deleteExpense);

module.exports = router;