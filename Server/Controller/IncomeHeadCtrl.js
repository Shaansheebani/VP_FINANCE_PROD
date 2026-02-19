const IncomeHead = require("../Models/IncomeHeadModel");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

/* CREATE */
exports.createIncome = async (req, res) => {
  try {
    const created = await IncomeHead.create(req.body);

    const data = await IncomeHead.findById(created._id)
      .populate({
        path: "accountHead",
        populate: ["financialProduct", "company"],
      });

    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* GET ALL */
exports.getAllIncome = async (req, res) => {
  try {
    const data = await IncomeHead.find()
      .populate({
        path: "accountHead",
        populate: ["financialProduct", "company"],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    await IncomeHead.findByIdAndUpdate(req.params.id, req.body);

    const data = await IncomeHead.findById(req.params.id)
      .populate({
        path: "accountHead",
        populate: ["financialProduct", "company"],
      });

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


// export excel
exports.exportIncomeExcel = async (req, res) => {
  try {
    const data = await IncomeHead.find().populate({
      path: "accountHead",
      populate: ["company"],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Income Balance");

    sheet.columns = [
      { header: "Account Head", key: "account", width: 28 },
      { header: "Company", key: "company", width: 28 },
      { header: "Description", key: "description", width: 35 },
      { header: "Date", key: "date", width: 18 },
      { header: "Amount", key: "amount", width: 18 },
    ];

    let total = 0;

    data.forEach((i) => {
      sheet.addRow({
        account: i.accountHead?.accountName,
        company: i.accountHead?.company?.companyName,
        description: i.description,
        date: new Date(i.creditDate).toLocaleDateString(),
        amount: i.amount,
      });

      total += i.amount;
    });

    sheet.addRow({});
    sheet.addRow({
      description: "TOTAL",
      amount: total,
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income-balance.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// pdf export
exports.exportIncomePDF = async (req, res) => {
  try {
    /* ================= FILE NAME ================= */
    const now = new Date();

    const formatted =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      "_" +
      String(now.getHours()).padStart(2, "0") +
      "-" +
      String(now.getMinutes()).padStart(2, "0");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Income_Sheet_${formatted}.pdf`
    );


    const { month, year, from, to, account } = req.query;

    /* ================= FILTER QUERY ================= */
    const query = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      query.creditDate = { $gte: start, $lt: end };
    }

    if (from && to) {
      query.creditDate = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    if (account) query.accountHead = account;

    /* ================= FETCH ================= */
    const data = await IncomeHead.find(query).populate({
      path: "accountHead",
      populate: ["company"],
    });

    /* ================= FILTER LABEL ================= */
    let filterText = "All Records";

    if (month && year) {
      filterText = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    }

    if (from && to) {
      filterText = `${new Date(from).toLocaleDateString()} - ${new Date(
        to
      ).toLocaleDateString()}`;
    }

    /* ================= PDF ================= */
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income-balance.pdf"
    );

    doc.pipe(res);

    /* ================= HEADER ================= */
    doc.fillColor("#1d4ed8").fontSize(16).text("Income Balance Sheet", {
      align: "center",
    });

    doc.fillColor("#b91c1c").fontSize(12).text("VP Financial Nest");

    doc
      .fillColor("black")
      .fontSize(10)
      .text("Generated: " + new Date().toLocaleString());

    doc.text("Filter: " + filterText);

    doc.moveDown();

    /* ================= TABLE ================= */
    const startX = 30;
    let y = doc.y + 10;

    doc.fontSize(10).fillColor("black");

    doc.text("Account", startX, y);
    doc.text("Company", startX + 110, y);
    doc.text("Description", startX + 220, y);
    doc.text("Date", startX + 360, y);
    doc.text("Amount", startX + 430, y);

    y += 20;

    let total = 0;

    data.forEach((i) => {
      if (y > 750) {
        doc.addPage();
        y = 40;
      }

      doc.text(i.accountHead?.accountName || "-", startX, y);
      doc.text(i.accountHead?.company?.companyName || "-", startX + 110, y);
      doc.text(i.description || "-", startX + 220, y, { width: 120 });
      doc.text(new Date(i.creditDate).toLocaleDateString(), startX + 360, y);
      doc.text(`Rs ${i.amount}`, startX + 430, y);

      total += i.amount;
      y += 18;
    });

    /* ================= TOTAL ================= */
    doc.moveDown();
    doc.fontSize(12).text(`TOTAL : Rs ${total}`, { align: "right" });

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
