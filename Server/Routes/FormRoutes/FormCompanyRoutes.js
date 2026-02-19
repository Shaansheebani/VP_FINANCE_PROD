const express = require("express");
const {
  createCompanyName,
  getAllCompanyNames,
  getCompaniesByProduct,
  updateCompanyName,
  deleteCompanyName,
} = require("../../Controller/FormController/FormCompanyName");

const router = express.Router();

router.post("/add", createCompanyName);
router.get("/", getAllCompanyNames);
router.get("/product/:productId", getCompaniesByProduct);
router.put("/:id", updateCompanyName);
router.delete("/:id", deleteCompanyName);

module.exports = router;
