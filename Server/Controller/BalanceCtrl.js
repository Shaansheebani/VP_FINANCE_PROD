const mongoose = require("mongoose");
const Bank = require("../Models/BankModel");
const Income = require("../Models/IncomeHeadModel");
const Expense = require("../Models/ExpenseHeadModel");

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
            incomeMatch.date = {
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
            .populate("accountHead", "head")
            .lean();

        const expenses = await Expense.find(expenseFilter)
            .populate("expenseHead", "head")
            .lean();

        let ledger = [];

        incomes.forEach((i) => {
            ledger.push({
                date: i.creditDate,
                incomeHead: i.accountHead?.head || "",
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
    } catch (err) {
        console.log("Ledger Error:", err);
        res.status(500).json(err.message);
    }
};