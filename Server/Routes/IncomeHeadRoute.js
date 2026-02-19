const router = require("express").Router();
const ctrl = require("../Controller/IncomeHeadCtrl");

router.post("/", ctrl.createIncome);
router.get("/", ctrl.getAllIncome);
router.put("/:id", ctrl.updateIncome);
router.delete("/:id", ctrl.deleteIncome);
router.get("/export/excel", ctrl.exportIncomeExcel);
router.get("/export/pdf", ctrl.exportIncomePDF);


module.exports = router;
