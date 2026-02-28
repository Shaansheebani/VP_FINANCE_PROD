const mongoose = require("mongoose");
const OfficePurchase = require("../Models/OfficePurchaseModel");
const IncomeExpense = require("../Models/IncomeExpenseModel");

// CREATE
exports.createOfficePurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      vrNo,
      invoiceNo,
      transactionDate,
      accountRef,
      bankRef,
      itemParticulars,
      ratePerUnit,
      quantity,
      amount,
    } = req.body;

    const [incomeExpense] = await IncomeExpense.create(
      [{
        type: "expense",
        accountRef,
        bankRef,
        amount,
        transactionDate,
        description: `VR No: ${vrNo} | Invoice: ${invoiceNo} | Item: ${itemParticulars}`,
      }],
      { session }
    );

    const [officePurchase] = await OfficePurchase.create(
      [{
        vrNo,
        invoiceNo,
        transactionDate,
        accountRef,
        bankRef,
        itemParticulars,
        ratePerUnit,
        quantity,
        amount,
        incomeExpenseRef: incomeExpense._id,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(officePurchase);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};


// GET ALL
exports.getOfficePurchases = async (req, res) => {
  try {
    const data = await OfficePurchase.find()
      .populate("accountRef")
      .populate("bankRef")
      .sort({ transactionDate: -1 });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET BY ID
exports.getOfficePurchaseByID = async (req, res) => {
  try {
    const data = await OfficePurchase.findById(req.params.id)
      .populate("accountRef")
      .populate("bankRef");

    if (!data) return res.status(404).json({ message: "Not found" });

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
exports.updateOfficePurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updateData = req.body;

    const officePurchase = await OfficePurchase.findById(id).session(session);
    if (!officePurchase) throw new Error("Not found");

    Object.assign(officePurchase, updateData);
    await officePurchase.save({ session });

    await IncomeExpense.findByIdAndUpdate(
      officePurchase.incomeExpenseRef,
      {
        accountRef: officePurchase.accountRef,
        bankRef: officePurchase.bankRef,
        amount: officePurchase.amount,
        transactionDate: officePurchase.transactionDate,
        description: `VR No: ${officePurchase.vrNo} | Invoice: ${officePurchase.invoiceNo} | Item: ${officePurchase.itemParticulars}`,
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json(officePurchase);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};


// DELETE (Permanent)
exports.deleteOfficePurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const officePurchase = await OfficePurchase.findById(id).session(session);
    if (!officePurchase) throw new Error("Not found");

    await IncomeExpense.findByIdAndDelete(
      officePurchase.incomeExpenseRef,
      { session }
    );

    await OfficePurchase.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};