const express = require("express");
const router = express.Router();

const {
  createExpenseHeadAccount,
  getAllExpenseHeadAccounts,
  getAccountsByHead,
  updateExpenseHeadAccount,
  deleteExpenseHeadAccount,
  toggleActiveExpenseHeadAccount,
} = require("../Controller/ExpenseHeadAccountCtrl");

router.post("/", createExpenseHeadAccount);
router.get("/", getAllExpenseHeadAccounts);
router.get("/head/:headId", getAccountsByHead);
router.put("/:id", updateExpenseHeadAccount);
router.delete("/:id", deleteExpenseHeadAccount);
router.patch("/toggle/:id", toggleActiveExpenseHeadAccount);

module.exports = router;