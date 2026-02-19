import React, { useEffect, useState } from "react";
import axios from "../../../../config/axios";
import { Button } from "react-bootstrap";

const ExportIncomeHeadData = () => {
    const [data, setData] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [mode, setMode] = useState("month"); // month | custom

    const [filters, setFilters] = useState({
        month: "",
        year: "",
        from: "",
        to: "",
        account: "",
    });

    /* ================= FETCH ================= */
    useEffect(() => {
        fetchData();
        fetchAccounts();
    }, []);

    const fetchData = async () => {
        const res = await axios.get("/api/income-head");
        setData(res.data.data);
    };

    const fetchAccounts = async () => {
        const res = await axios.get("/api/income-head-account");
        setAccounts(res.data.data);
    };

    /* ================= FILTER ================= */
    const filteredData = data.filter((i) => {
        const date = new Date(i.creditDate);

        if (mode === "month") {
            if (filters.month && date.getMonth() + 1 !== Number(filters.month))
                return false;

            if (filters.year && date.getFullYear() !== Number(filters.year))
                return false;
        }

        if (mode === "custom") {
            if (filters.from && new Date(filters.from) > date) return false;
            if (filters.to && new Date(filters.to) < date) return false;
        }

        if (filters.account && i.accountHead?._id !== filters.account) return false;

        return true;
    });

    const total = filteredData.reduce((s, i) => s + i.amount, 0);

    /* ================= EXPORT ================= */
    const exportExcel = () => {
        let url = "/api/income-head/export/excel?";

        if (mode === "month") {
            if (filters.month) url += `month=${filters.month}&`;
            if (filters.year) url += `year=${filters.year}&`;
        }

        if (mode === "custom") {
            if (filters.from && filters.to)
                url += `from=${filters.from}&to=${filters.to}&`;
        }

        if (filters.account) url += `account=${filters.account}`;

        window.open(url);
    };


    const exportPDF = () => {
        let url = "/api/income-head/export/pdf?";

        if (mode === "month") {
            if (filters.month) url += `month=${filters.month}&`;
            if (filters.year) url += `year=${filters.year}&`;
        }

        if (mode === "custom") {
            if (filters.from && filters.to)
                url += `from=${filters.from}&to=${filters.to}&`;
        }

        if (filters.account) url += `account=${filters.account}`;

        window.open(url);
    };




    return (
        <div>
            <h5 className="mb-3">Export Income Balance</h5>

            {/* MODE SELECTOR */}
            <div className="flex gap-2 mb-3">
                <Button
                    size="sm"
                    variant={mode === "month" ? "primary" : "outline-primary"}
                    onClick={() => setMode("month")}
                >
                    Month
                </Button>

                <Button
                    size="sm"
                    variant={mode === "custom" ? "primary" : "outline-primary"}
                    onClick={() => setMode("custom")}
                >
                    Custom Range
                </Button>
            </div>

            {/* FILTER INPUTS */}
            <div className="grid md:grid-cols-4 gap-3 mb-4">
                {mode === "month" && (
                    <>
                        <select
                            value={filters.month}
                            onChange={(e) =>
                                setFilters({ ...filters, month: e.target.value })
                            }
                            className="form-select"
                        >
                            <option value="">Month</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Year"
                            value={filters.year}
                            onChange={(e) =>
                                setFilters({ ...filters, year: e.target.value })
                            }
                            className="form-control"
                        />
                    </>
                )}

                {mode === "custom" && (
                    <>
                        <input
                            type="date"
                            value={filters.from}
                            onChange={(e) =>
                                setFilters({ ...filters, from: e.target.value })
                            }
                            className="form-control"
                        />
                        <input
                            type="date"
                            value={filters.to}
                            onChange={(e) =>
                                setFilters({ ...filters, to: e.target.value })
                            }
                            className="form-control"
                        />
                    </>
                )}

                {/* ACCOUNT FILTER */}
                <select
                    value={filters.account}
                    onChange={(e) =>
                        setFilters({ ...filters, account: e.target.value })
                    }
                    className="form-select"
                >
                    <option value="">All Accounts</option>
                    {accounts.map((a) => (
                        <option key={a._id} value={a._id}>
                            {a.accountName}
                        </option>
                    ))}
                </select>
            </div>

            {/* PREVIEW TABLE */}
            <div className="w-full overflow-x-auto border rounded bg-white mb-3">
                <table className="min-w-[900px] w-full text-sm border-collapse">
                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th className="px-3 py-2 border text-left">Account Head</th>
                            <th className="px-3 py-2 border text-left">Company</th>
                            <th className="px-3 py-2 border text-left">Description</th>
                            <th className="px-3 py-2 border text-left">Date</th>
                            <th className="px-3 py-2 border text-right">Amount</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    No data found
                                </td>
                            </tr>
                        )}

                        {filteredData.map((i) => (
                            <tr key={i._id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 border">
                                    {i.accountHead?.accountName}
                                </td>

                                <td className="px-3 py-2 border">
                                    {i.accountHead?.company?.companyName}
                                </td>

                                <td className="px-3 py-2 border max-w-[260px] truncate">
                                    {i.description}
                                </td>

                                <td className="px-3 py-2 border">
                                    {new Date(i.creditDate).toLocaleDateString()}
                                </td>

                                <td className="px-3 py-2 border text-right font-semibold text-green-600">
                                    ₹ {i.amount}
                                </td>
                            </tr>
                        ))}

                        {/* TOTAL ROW */}
                        <tr className="bg-gray-100 font-bold">
                            <td colSpan="4" className="px-3 py-2 border text-right">
                                Total Income
                            </td>
                            <td className="px-3 py-2 border text-right text-green-700">
                                ₹ {total}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* EXPORT BUTTONS */}
            <Button variant="success" onClick={exportExcel}>
                Export Excel
            </Button>

            <Button variant="danger" className="ms-2" onClick={exportPDF}>
                Export PDF
            </Button>
        </div>
    );
};

export default ExportIncomeHeadData;
