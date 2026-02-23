const IncomeHead = require("../Models/IncomeHeadModel");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

/* CREATE */
exports.createIncome = async (req, res) => {
  try {
    const created = await IncomeHead.create(req.body);

    const data = await IncomeHead.findById(created._id)
      .populate("bank", "bankName accountNumber")
      .populate("accountHead", "head subHead");

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET ALL */
exports.getAllIncome = async (req, res) => {
  try {
    const data = await IncomeHead.find()
      .populate("bank", "bankName accountNumber")
      .populate({
        path: "accountHead",
        populate: [
          { path: "head" },       // financial product
          { path: "subHead" },    // company
        ],
      })
      .sort({ creditDate: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* UPDATE */
exports.updateIncome = async (req, res) => {
  try {
    await IncomeHead.findByIdAndUpdate(req.params.id, req.body);

    const data = await IncomeHead.findById(req.params.id)
      .populate("bank", "bankName accountNumber")
      .populate("accountHead", "head subHead");

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* DELETE */
exports.deleteIncome = async (req, res) => {
  try {
    await IncomeHead.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportIncomeExcel = async (req, res) => {
  try {
    const data = await IncomeHead.find()
      .populate("accountHead", "head subHead");
    // .populate("bank", "bankName accountNumber");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Income Sheet");

    sheet.columns = [
      { header: "Account Head", key: "account", width: 30 },
      { header: "Description", key: "description", width: 35 },
      { header: "Date", key: "date", width: 18 },
      { header: "Amount", key: "amount", width: 18 },
    ];

    let total = 0;

    data.forEach((i) => {
      const name = i.accountHead?.subHead
        ? `${i.accountHead.head} → ${i.accountHead.subHead}`
        : i.accountHead?.head;

      sheet.addRow({
        account: name,
        description: i.description,
        date: new Date(i.creditDate).toLocaleDateString(),
        amount: i.amount,
      });

      total += i.amount;
    });

    sheet.addRow({});
    sheet.addRow({ description: "TOTAL", amount: total });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income-sheet.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.exportIncomePDF = async (req, res) => {
  try {
    const data = await IncomeHead.find().populate("accountHead", "head subHead");

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income-sheet.pdf"
    );

    doc.pipe(res);

    doc.fontSize(16).text("Income Sheet", { align: "center" });
    doc.moveDown();

    let y = doc.y + 10;
    let total = 0;

    data.forEach((i) => {
      const name = i.accountHead?.subHead
        ? `${i.accountHead.head} → ${i.accountHead.subHead}`
        : i.accountHead?.head;

      doc.text(name, 30, y);
      doc.text(i.description || "-", 180, y);
      doc.text(new Date(i.creditDate).toLocaleDateString(), 350, y);
      doc.text(`Rs ${i.amount}`, 450, y);

      total += i.amount;
      y += 18;
    });

    doc.moveDown();
    doc.fontSize(12).text(`TOTAL : Rs ${total}`, { align: "right" });

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};