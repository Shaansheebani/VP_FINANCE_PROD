const express = require("express");
const router = express.Router();
const ClientCtrl = require("../Controller/ClientCtrl");
const { upload } = require("../config/upload");

// ---------------- CREATE ----------------
router.post("/create", ClientCtrl.createClient);

// ---------------- FAMILY ----------------
router.post("/add/family/:clientId", ClientCtrl.addFamilyMember);
router.put("/update/family/:clientId", ClientCtrl.updateFamilyMember);
router.get("/family/details/:id", ClientCtrl.getAllFamilyMembers);

// ---------------- FINANCIAL ----------------
router.post(
  "/add/financial/:clientId",
  upload.fields([
    { name: "insuranceDocuments", maxCount: 10 },
    { name: "investmentDocuments", maxCount: 10 },
    { name: "loanDocuments", maxCount: 10 },
  ]),
  ClientCtrl.addFinancialInfo
);

router.put(
  "/update/financial/:clientId",
  upload.fields([
    { name: "insuranceDocuments", maxCount: 10 },
    { name: "investmentDocuments", maxCount: 10 },
    { name: "loanDocuments", maxCount: 10 },
  ]),
  ClientCtrl.updateFinancialInfo
);

// ---------------- FUTURE PRIORITIES ----------------
router.post("/add/future-priorities/:clientId", ClientCtrl.addFuturePrioritiesAndNeeds);
router.put("/update/future-priorities/:clientId", ClientCtrl.updateFuturePrioritiesAndNeeds);

// ---------------- PROPOSED PLAN ----------------
router.post(
  "/add/proposed-plan/:clientId",
  upload.array("documents", 10),
  ClientCtrl.addProposedFinancialPlan
);

router.put(
  "/update/proposed-plan/:clientId/:planId",
  upload.array("documents", 10),
  ClientCtrl.updateProposedFinancialPlan
);

router.put(
  "/update/proposed-status/:clientId",
  ClientCtrl.updatePorposedStatus
);

// ---------------- PERSONAL ----------------
router.put("/update/personaldetails/:clientId", ClientCtrl.updatePersonalDetails);
router.put("/update/image/:firstId", upload.single("document"), ClientCtrl.updateImage);

// ---------------- KYC ----------------
router.post("/kyc/create/:clientId", upload.single("document"), ClientCtrl.createKyc);
router.get("/kyc/:clientId", ClientCtrl.getKycsByClient);
router.put("/kyc/:id", upload.single("document"), ClientCtrl.updateKyc);
router.delete("/kyc/:id", ClientCtrl.deleteKyc);

// ---------------- CLIENT ----------------
router.get("/all", ClientCtrl.getAllClients);
router.put("/update/status/:id", ClientCtrl.updateClientStatus);
router.delete("/delete/:id", ClientCtrl.deleteClient);

// ⚠️ KEEP GENERIC ROUTE LAST
router.get("/:id", ClientCtrl.getClientById);

module.exports = router;
