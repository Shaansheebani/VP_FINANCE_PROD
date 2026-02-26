const mongoose = require("mongoose");
const Bank = require("../Models/BankModel");
const Income = require("../Models/IncomeHeadModel");
const Expense = require("../Models/ExpenseHeadModel");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const getHeadName = (acc) => {
    if (!acc) return "";

    /* ===== NEW HYBRID ===== */
    if (acc.headRef || acc.headCustom) {
        const head =
            acc.headRef?.productName ||
            acc.headCustom ||
            "";

        const sub =
            acc.subHeadRef?.companyName ||
            acc.subHeadCustom ||
            "";

        return sub ? `${head} → ${sub}` : head;
    }

    /* ===== OLD STRUCTURE SUPPORT ===== */
    if (acc.head || acc.subHead) {
        return acc.subHead ? `${acc.head} → ${acc.subHead}` : acc.head;
    }

    return "";
};

/* ======================================================
   BANK SUMMARY  (multi-bank safe)
====================================================== */
exports.getBankWiseBalance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const hasStart = startDate && startDate !== "";
        const hasEnd = endDate && endDate !== "";

        const banks = await Bank.find().lean();

        const incomeMatch = {};
        const expenseMatch = {};

        if (hasStart && hasEnd) {
            incomeMatch.creditDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };

            expenseMatch.debitDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const incomeAgg = await Income.aggregate([
            { $match: incomeMatch },
            { $group: { _id: "$bank", total: { $sum: "$amount" } } },
        ]);

        const expenseAgg = await Expense.aggregate([
            { $match: expenseMatch },
            { $group: { _id: "$bank", total: { $sum: "$amount" } } },
        ]);

        const bankSummary = banks.map((bank) => {
            const income = incomeAgg.find(
                (i) => i._id?.toString() === bank._id.toString()
            );

            const expense = expenseAgg.find(
                (e) => e._id?.toString() === bank._id.toString()
            );

            const totalIncome = income?.total || 0;
            const totalExpense = expense?.total || 0;

            return {
                bankId: bank._id,
                bankName: bank.bankName,
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
            };
        });

        const totals = {
            totalIncome: bankSummary.reduce((a, b) => a + b.totalIncome, 0),
            totalExpense: bankSummary.reduce((a, b) => a + b.totalExpense, 0),
            overallBalance:
                bankSummary.reduce((a, b) => a + b.totalIncome, 0) -
                bankSummary.reduce((a, b) => a + b.totalExpense, 0),
        };

        res.json({ bankSummary, totals });
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};

/* ======================================================
   BANK LEDGER (handles empty date safely)
====================================================== */
exports.getBankLedger = async (req, res) => {
    try {
        const { bankId, startDate, endDate } = req.query;

        if (!bankId) return res.status(400).json("bankId required");

        const hasStart = startDate && startDate !== "";
        const hasEnd = endDate && endDate !== "";

        const incomeFilter = { bank: bankId };
        const expenseFilter = { bank: bankId };

        /* ===== OPENING BALANCE ===== */
        let openingIncome = [];
        let openingExpense = [];

        if (hasStart) {
            openingIncome = await Income.aggregate([
                {
                    $match: {
                        bank: new mongoose.Types.ObjectId(bankId),
                        creditDate: { $lt: new Date(startDate) },
                    },
                },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);

            openingExpense = await Expense.aggregate([
                {
                    $match: {
                        bank: new mongoose.Types.ObjectId(bankId),
                        debitDate: { $lt: new Date(startDate) },
                    },
                },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
        }

        const openingBalance =
            (openingIncome[0]?.total || 0) - (openingExpense[0]?.total || 0);

        /* ===== DATE FILTER ===== */
        if (hasStart && hasEnd) {
            incomeFilter.creditDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };

            expenseFilter.debitDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const incomes = await Income.find(incomeFilter)
            .populate({
                path: "accountHead",
                populate: [
                    { path: "headRef", select: "productName" },
                    { path: "subHeadRef", select: "companyName" },
                ],
            })
            .lean();

        const expenses = await Expense.find(expenseFilter)
            .populate("expenseHead", "head")
            .lean();

        let ledger = [];

        incomes.forEach((i) => {
            ledger.push({
                date: i.creditDate,
                incomeHead: getHeadName(i.accountHead),
                expenseHead: "",
                description: i.description,
                amount: i.amount,
                type: "income",
            });
        });

        expenses.forEach((e) => {
            ledger.push({
                date: e.debitDate,
                incomeHead: "",
                expenseHead: e.expenseHead?.head || "",
                description: e.description,
                amount: e.amount,
                type: "expense",
            });
        });

        ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

        let running = openingBalance;

        ledger = ledger.map((l) => {
            running += l.type === "income" ? l.amount : -l.amount;
            return { ...l, runningBalance: running };
        });

        res.json({ ledger, openingBalance });
        console.log(incomes[0]);
    } catch (err) {
        console.log("Ledger Error:", err);
        res.status(500).json(err.message);
    }
};

exports.exportBalanceExcel = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const incomeMatch = {};
        const expenseMatch = {};

        if (startDate && endDate) {
            incomeMatch.creditDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
            expenseMatch.debitDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const banks = await Bank.find().lean();

        const incomeAgg = await Income.aggregate([
            { $match: incomeMatch },
            { $group: { _id: "$bank", total: { $sum: "$amount" } } },
        ]);

        const expenseAgg = await Expense.aggregate([
            { $match: expenseMatch },
            { $group: { _id: "$bank", total: { $sum: "$amount" } } },
        ]);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Balance Sheet");

        sheet.columns = [
            { header: "Bank", key: "bank", width: 25 },
            { header: "Income", key: "income", width: 18 },
            { header: "Expense", key: "expense", width: 18 },
            { header: "Balance", key: "balance", width: 18 },
        ];

        let totalIncome = 0;
        let totalExpense = 0;

        banks.forEach((bank) => {
            const income = incomeAgg.find(i => i._id?.toString() === bank._id.toString());
            const expense = expenseAgg.find(e => e._id?.toString() === bank._id.toString());

            const inc = income?.total || 0;
            const exp = expense?.total || 0;

            totalIncome += inc;
            totalExpense += exp;

            sheet.addRow({
                bank: bank.bankName,
                income: inc,
                expense: exp,
                balance: inc - exp,
            });
        });

        sheet.addRow({});
        sheet.addRow({
            bank: "TOTAL",
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense,
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader("Content-Disposition", "attachment; filename=BalanceSheet.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};

exports.exportBalancePDF = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const incomeMatch = {};
        const expenseMatch = {};

        if (startDate && endDate) {
            incomeMatch.creditDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
            expenseMatch.debitDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const banks = await Bank.find().lean();

        const incomeAgg = await Income.aggregate([
            { $match: incomeMatch },
            { $group: { _id: "$bank", total: { $sum: "$amount" } } },
        ]);

        const expenseAgg = await Expense.aggregate([
            { $match: expenseMatch },
            { $group: { _id: "$bank", total: { $sum: "$amount" } } },
        ]);

        const doc = new PDFDocument({ margin: 40, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=BalanceSheet.pdf");

        doc.pipe(res);

        doc.fontSize(18).text("BALANCE SHEET", { align: "center" });
        doc.moveDown();

        const startX = 50;
        let y = 120;

        doc.fontSize(12);
        doc.text("Bank", startX, y);
        doc.text("Income", 250, y);
        doc.text("Expense", 350, y);
        doc.text("Balance", 450, y);

        y += 20;

        let totalIncome = 0;
        let totalExpense = 0;

        banks.forEach((bank) => {
            const income = incomeAgg.find(i => i._id?.toString() === bank._id.toString());
            const expense = expenseAgg.find(e => e._id?.toString() === bank._id.toString());

            const inc = income?.total || 0;
            const exp = expense?.total || 0;

            totalIncome += inc;
            totalExpense += exp;

            doc.text(bank.bankName, startX, y);
            doc.text(inc.toFixed(2), 250, y);
            doc.text(exp.toFixed(2), 350, y);
            doc.text((inc - exp).toFixed(2), 450, y);

            y += 18;
        });

        y += 10;

        doc.text("TOTAL", startX, y);
        doc.text(totalIncome.toFixed(2), 250, y);
        doc.text(totalExpense.toFixed(2), 350, y);
        doc.text((totalIncome - totalExpense).toFixed(2), 450, y);

        doc.end();
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};

exports.exportLedgerExcel = async (req, res) => {
    try {
        const { bankId, startDate, endDate } = req.query;
        if (!bankId) return res.status(400).json("bankId required");

        const bank = await Bank.findById(bankId);

        const hasStart = startDate && startDate !== "";
        const hasEnd = endDate && endDate !== "";

        /* ===== OPENING BALANCE ===== */
        let openingIncome = [];
        let openingExpense = [];

        if (hasStart) {
            openingIncome = await Income.aggregate([
                {
                    $match: {
                        bank: new mongoose.Types.ObjectId(bankId),
                        creditDate: { $lt: new Date(startDate) },
                    },
                },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);

            openingExpense = await Expense.aggregate([
                {
                    $match: {
                        bank: new mongoose.Types.ObjectId(bankId),
                        debitDate: { $lt: new Date(startDate) },
                    },
                },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
        }

        const openingBalance =
            (openingIncome[0]?.total || 0) - (openingExpense[0]?.total || 0);

        /* ===== DATE FILTER ===== */
        const incomeFilter = { bank: bankId };
        const expenseFilter = { bank: bankId };

        if (hasStart && hasEnd) {
            incomeFilter.creditDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
            expenseFilter.debitDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const incomes = await Income.find(incomeFilter)
            .populate({
                path: "accountHead",
                populate: [
                    { path: "headRef", select: "productName" },
                    { path: "subHeadRef", select: "companyName" },
                ],
            })
            .lean();

        const expenses = await Expense.find(expenseFilter)
            .populate("expenseHead", "head")
            .lean();

        let ledger = [];

        incomes.forEach(i =>
            ledger.push({
                date: i.creditDate,
                income: getHeadName(i.accountHead),
                expense: "",
                desc: i.description,
                inc: i.amount,
                exp: "",
                type: "income"
            })
        );

        expenses.forEach(e =>
            ledger.push({
                date: e.debitDate,
                income: "",
                expense: e.expenseHead?.head || "",
                desc: e.description,
                inc: "",
                exp: e.amount,
                type: "expense"
            })
        );

        ledger.sort((a, b) => new Date(a.date) - new Date(b.date));

        let running = openingBalance;

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Bank Ledger");

        sheet.addRow([`Bank : ${bank.bankName}`]);
        sheet.addRow(["Opening Balance", "", "", "", "", "", openingBalance]);
        sheet.addRow([]);

        sheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Income Head", key: "income", width: 30 },
            { header: "Expense Head", key: "expense", width: 30 },
            { header: "Description", key: "desc", width: 30 },
            { header: "Income", key: "inc", width: 15 },
            { header: "Expense", key: "exp", width: 15 },
            { header: "Balance", key: "bal", width: 18 },
        ];

        ledger.forEach(l => {
            running += l.type === "income" ? l.inc || 0 : -(l.exp || 0);

            sheet.addRow({
                date: new Date(l.date).toLocaleDateString(),
                income: l.income,
                expense: l.expense,
                desc: l.desc,
                inc: l.inc,
                exp: l.exp,
                bal: running,
            });
        });

        res.setHeader("Content-Disposition", "attachment; filename=BankLedger.xlsx");
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};

exports.exportLedgerPDF = async (req, res) => {
    try {
        const { bankId, startDate, endDate } = req.query;
        if (!bankId) return res.status(400).json("bankId required");

        const bank = await Bank.findById(bankId);

        const doc = new PDFDocument({ margin: 30 });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${bank.bankName}-Ledger.pdf`);

        doc.pipe(res);

        /* ===== FETCH LEDGER USING EXISTING CONTROLLER ===== */
        const ledgerRes = await new Promise((resolve) => {
            exports.getBankLedger(
                { query: { bankId, startDate, endDate } },
                { json: resolve }
            );
        });

        /* ===== HEADER ===== */
        doc.fontSize(16).text(`Bank Ledger - ${bank.bankName}`, { align: "center" });
        doc.moveDown();
        doc.fontSize(11).text(`Opening Balance : ${ledgerRes.openingBalance}`);
        doc.moveDown();

        /* ===== TABLE HEADER ===== */
        let y = 120;

        doc.fontSize(10).font("Helvetica-Bold");

        doc.text("Date", 30, y);
        doc.text("Income", 90, y);
        doc.text("Expense", 230, y);
        doc.text("Description", 300, y);
        doc.text("Income", 400, y);
        doc.text("Expense", 450, y);
        doc.text("Balance", 510, y);

        y += 15;
        doc.moveTo(30, y).lineTo(580, y).stroke();

        y += 5;
        doc.font("Helvetica");

        /* ===== ROWS ===== */
        ledgerRes.ledger.forEach((l) => {
            const incomeHead =
                l.type === "income"
                    ? `${l.incomeHead || ""}`
                    : "";

            const expenseHead =
                l.type === "expense"
                    ? `${l.expenseHead || ""}`
                    : "";

            doc.text(new Date(l.date).toLocaleDateString(), 30, y);
            doc.text(incomeHead, 90, y, { width: 130 });
            doc.text(expenseHead, 230, y, { width: 130 });
            doc.text(l.description || "", 300, y, { width: 100 });

            doc.text(l.type === "income" ? l.amount : "", 400, y);
            doc.text(l.type === "expense" ? l.amount : "", 450, y);
            doc.text(l.runningBalance, 510, y);

            y += 16;

            /* ===== AUTO PAGE BREAK ===== */
            if (y > 760) {
                doc.addPage();
                y = 50;
            }
        });

        doc.end();
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
};

