import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchBankWiseBalance,
    fetchBankLedger,
} from "../../../redux/feature/Balance/BalanceThunks";
import { fetchIncomeHeadAccounts } from "../../../redux/feature/IncomeHead/IncomeHeadAccountThunx";
import { fetchFinancialProduct } from "../../../redux/feature/FinancialProduct/FinancialThunx";
import { fetchCompanyName } from "../../../redux/feature/CompanyName/CompanyThunx";

const BalanceReport = () => {
    const dispatch = useDispatch();

    const { bankSummary, totals, ledger, openingBalance, loading } =
        useSelector((state) => state.balance);

    // financial products
    const { accounts } =
        useSelector((s) => s.incomeHeadAccount);
    const financialProducts =
        useSelector((s) => s.financialProduct.FinancialProducts) || [];
    const companyNames =
        useSelector((s) => s.CompanyName.CompanyNames) || [];

    const [selectedBank, setSelectedBank] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        dispatch(fetchBankWiseBalance());

        dispatch(fetchIncomeHeadAccounts());
        dispatch(fetchFinancialProduct());
        dispatch(fetchCompanyName());
    }, [dispatch]);

    const applyFilter = () => {
        dispatch(fetchBankWiseBalance({ startDate, endDate }));
        if (selectedBank) {
            dispatch(fetchBankLedger({ bankId: selectedBank, startDate, endDate }));
        }
    };

    const openLedger = (bankId) => {
        setSelectedBank(bankId);
        dispatch(fetchBankLedger({ bankId, startDate, endDate }));
    };

    const incomeList = ledger.filter((l) => l.type === "income");
    const expenseList = ledger.filter((l) => l.type === "expense");

    const totalIncome = incomeList.reduce((a, b) => a + b.amount, 0);
    const totalExpense = expenseList.reduce((a, b) => a + b.amount, 0);
    const closingBalance = openingBalance + totalIncome - totalExpense;

    const resolveHeadName = (id) => {
        if (!id) return "-";

        const acc = accounts?.find((a) => a._id === id);
        if (!acc) return id;

        const headName =
            typeof acc.head === "object"
                ? acc.head?.name
                : financialProducts.find((p) => p._id === acc.head)?.name || "";

        const subHeadName =
            typeof acc.subHead === "object"
                ? acc.subHead?.companyName
                : companyNames.find((c) => c._id === acc.subHead)?.companyName || "";

        return subHeadName ? `${headName} → ${subHeadName}` : headName;
    };

    return (
        <div className="container mt-4">
            <h3>Bank Balance Report</h3>

            {/* ================= FILTER ================= */}
            <div className="d-flex gap-2 mb-3">
                <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button className="btn btn-primary" onClick={applyFilter}>
                    Apply
                </button>
            </div>

            {/* ================= TOTAL CARDS ================= */}
            {totals && (
                <div className="row mb-4">
                    <div className="col">
                        <div className="card p-3 shadow-sm">
                            <b>Total Income</b>
                            <div className="text-success">₹ {totals.totalIncome}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card p-3 shadow-sm">
                            <b>Total Expense</b>
                            <div className="text-danger">₹ {totals.totalExpense}</div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card p-3 shadow-sm">
                            <b>Net Balance</b>
                            <div
                                style={{
                                    color: totals.overallBalance >= 0 ? "green" : "red",
                                }}
                            >
                                ₹ {totals.overallBalance}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= BANK SUMMARY ================= */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Bank</th>
                        <th>Income</th>
                        <th>Expense</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {bankSummary.map((b) => (
                        <tr
                            key={b.bankId}
                            onClick={() => openLedger(b.bankId)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{b.bankName}</td>
                            <td className="text-success">₹ {b.totalIncome}</td>
                            <td className="text-danger">₹ {b.totalExpense}</td>
                            <td style={{ color: b.balance >= 0 ? "green" : "red" }}>
                                ₹ {b.balance}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ================= LEDGER ================= */}
            {selectedBank && (
                <>
                    <h5 className="mt-4">Ledger</h5>

                    <div className="fw-bold mb-2">Opening Balance : ₹ {openingBalance}</div>

                    {/* ================= BALANCE SHEET ================= */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header fw-bold text-center">
                            Balance Sheet
                        </div>

                        <div className="row g-0">
                            {/* INCOME SIDE */}
                            <div className="col-md-6 border-end">
                                <div className="p-2 fw-bold text-success border-bottom">
                                    Income
                                </div>

                                <div style={{ maxHeight: 260, overflowY: "auto" }}>
                                    <table className="table table-sm mb-0">
                                        <tbody>
                                            {incomeList.map((l, i) => (
                                                <tr key={i}>
                                                    <td>{resolveHeadName(l.incomeHead)}</td>
                                                    <td className="text-end text-success">
                                                        ₹ {l.amount}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-2 fw-bold text-end text-success border-top">
                                    Total ₹ {totalIncome}
                                </div>
                            </div>

                            {/* EXPENSE SIDE */}
                            <div className="col-md-6">
                                <div className="p-2 fw-bold text-danger border-bottom">
                                    Expense
                                </div>

                                <div style={{ maxHeight: 260, overflowY: "auto" }}>
                                    <table className="table table-sm mb-0">
                                        <tbody>
                                            {expenseList.map((l, i) => (
                                                <tr key={i}>
                                                    <td>{l.expenseHead}</td>
                                                    <td className="text-end text-danger">
                                                        ₹ {l.amount}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="p-2 fw-bold text-end text-danger border-top">
                                    Total ₹ {totalExpense}
                                </div>
                            </div>
                        </div>

                        <div
                            className="text-center fw-bold p-2 border-top"
                            style={{ color: closingBalance >= 0 ? "green" : "red" }}
                        >
                            Closing Balance ₹ {closingBalance}
                        </div>
                    </div>

                    {/* ================= FULL LEDGER TABLE ================= */}
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Income Head</th>
                                <th>Expense Head</th>
                                <th>Description</th>
                                <th>Income</th>
                                <th>Expense</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ledger.map((l, i) => (
                                <tr key={i}>
                                    <td>{new Date(l.date).toLocaleDateString()}</td>
                                    <td className="text-success">
                                        {l.type === "income" ? resolveHeadName(l.incomeHead) : "-"}
                                    </td>
                                    <td className="text-danger">
                                        {l.type === "expense" ? l.expenseHead : "-"}
                                    </td>
                                    <td>{l.description}</td>
                                    <td className="text-success">
                                        {l.type === "income" ? `₹ ${l.amount}` : "-"}
                                    </td>
                                    <td className="text-danger">
                                        {l.type === "expense" ? `₹ ${l.amount}` : "-"}
                                    </td>
                                    <td
                                        style={{
                                            color: l.runningBalance >= 0 ? "green" : "red",
                                        }}
                                    >
                                        ₹ {l.runningBalance}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {loading && <div>Loading...</div>}
        </div>
    );
};

export default BalanceReport;