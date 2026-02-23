const express = require("express");
const router = express.Router();

const {
  getBankWiseBalance,
  getBankLedger,
} = require("../Controller/BalanceCtrl");

router.get("/bank-wise", getBankWiseBalance);
router.get("/bank-ledger", getBankLedger);

module.exports = router;