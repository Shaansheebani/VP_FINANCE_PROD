const express = require("express");
const router = express.Router();

const controller = require("../Controller/IncomeExpenseController");

/* ================= CREATE ================= */
router.post("/", controller.createTransaction);

/* ================= GET ALL (filters supported) ================= */
router.get("/", controller.getTransactions);

/* ================= SUMMARY ================= */
router.get("/summary", controller.getBalanceSummary);

/* ================= BANK SUMMARY ================= */
router.get("/bank-summary", controller.getBankSummary);

/* ================= GET BY ID ================= */
router.get("/:id", controller.getTransactionById);

/* ================= UPDATE ================= */
router.put("/:id", controller.updateTransaction);

/* ================= DELETE (soft) ================= */
router.delete("/:id", controller.deleteTransaction);

module.exports = router;