const express = require("express");
const router = express.Router();

const {
  createIncomeHeadAccount,
  getAllIncomeHeadAccounts,
  getIncomeHeadAccountById,
  updateIncomeHeadAccount,
  deleteIncomeHeadAccount,
} = require("../Controller/IncomeHeadAccountCtrl");

/* CREATE */
router.post("/", createIncomeHeadAccount);

/* GET ALL */
router.get("/", getAllIncomeHeadAccounts);

/* GET SINGLE */
router.get("/:id", getIncomeHeadAccountById);

/* UPDATE */
router.put("/:id", updateIncomeHeadAccount);

/* DELETE (SOFT DELETE) */
router.delete("/:id", deleteIncomeHeadAccount);

module.exports = router;
