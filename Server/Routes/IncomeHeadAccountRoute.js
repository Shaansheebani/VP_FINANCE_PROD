const express = require("express");
const router = express.Router();

const {
  createIncomeHeadAccount,
  getAllIncomeHeadAccounts,
  getIncomeHeadAccountById,
  updateIncomeHeadAccount,
  deleteIncomeHeadAccount,
  getHeads,
  getSubHeadsByHead,
} = require("../Controller/IncomeHeadAccountCtrl");

/* CREATE */
router.post("/", createIncomeHeadAccount);

/* GET ALL */
router.get("/", getAllIncomeHeadAccounts);

/* GET ONLY HEADS (for dropdown) */
router.get("/heads", getHeads);

/* GET SUBHEAD BY HEAD (dependent dropdown) */
router.get("/subheads/:head", getSubHeadsByHead);

/* GET SINGLE */
router.get("/:id", getIncomeHeadAccountById);

/* UPDATE */
router.put("/:id", updateIncomeHeadAccount);

/* DELETE (SOFT DELETE) */
router.delete("/:id", deleteIncomeHeadAccount);

module.exports = router;

