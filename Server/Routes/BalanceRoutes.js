const express = require("express");
const router = express.Router();

const {
  getBankWiseBalance,
  getBankLedger,
  exportBalanceExcel,
  exportBalancePDF,
  exportLedgerExcel,
  exportLedgerPDF,
} = require("../Controller/BalanceCtrl");

router.get("/bank-wise", getBankWiseBalance);
router.get("/bank-ledger", getBankLedger);
router.get("/export/excel", exportBalanceExcel);
router.get("/export/pdf", exportBalancePDF);
router.get("/export/ledger/excel", exportLedgerExcel);
router.get("/export/ledger/pdf", exportLedgerPDF);

module.exports = router;