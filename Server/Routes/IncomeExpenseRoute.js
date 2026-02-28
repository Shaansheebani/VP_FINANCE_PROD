const express = require("express");
const router = express.Router();
const controller = require("../Controller/IncomeExpenseController");
const { expenseBillUpload } = require("../config/upload");

/* ================= CREATE ================= */
router.post("/", expenseBillUpload.single("bill"), controller.createTransaction);

/* ================= GET ALL ================= */
router.get("/", controller.getTransactions);

/* ================= SUMMARY ================= */
router.get("/summary", controller.getBalanceSummary);

/* ================= BANK SUMMARY ================= */
router.get("/bank-summary", controller.getBankSummary);

/* ================= GET BY ID ================= */
router.get("/:id", controller.getTransactionById);

/* ================= UPDATE ================= */
router.put("/:id", expenseBillUpload.single("bill"), controller.updateTransaction);

/* ================= DELETE ================= */
router.delete("/:id", controller.deleteTransaction);

module.exports = router;