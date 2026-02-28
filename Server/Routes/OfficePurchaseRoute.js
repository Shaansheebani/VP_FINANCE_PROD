const express = require("express");
const router = express.Router();

const {
  createOfficePurchase,
  getOfficePurchases,
  getOfficePurchaseByID,
  updateOfficePurchase,
  deleteOfficePurchase,
} = require("../Controller/OfficePurchaseCtrl");

router.post("/", createOfficePurchase);
router.get("/", getOfficePurchases);
router.get("/:id", getOfficePurchaseByID);
router.put("/:id", updateOfficePurchase);
router.delete("/:id", deleteOfficePurchase);

module.exports = router;