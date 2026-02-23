import React, { useEffect, useState } from "react";
import axios from "../../../../config/axios";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { fetchFinancialProduct } from "../../../../redux/feature/FinancialProduct/FinancialThunx";
import { fetchCompanyName } from "../../../../redux/feature/CompanyName/CompanyThunx";

const ExportIncomeHeadData = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [dateMode, setDateMode] = useState("thisMonth");

  const financialProducts =
    useSelector((state) => state.financialProduct.FinancialProducts) || [];

  const companyNames =
    useSelector((state) => state.CompanyName.CompanyNames) || [];

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    account: "",
  });

  useEffect(() => {
    fetchData();
    fetchAccounts();

    dispatch(fetchFinancialProduct());
    dispatch(fetchCompanyName());
  }, [dispatch]);

  const fetchData = async () => {
    const res = await axios.get("/api/income-head");
    setData(res.data.data || []);
  };

  const fetchAccounts = async () => {
    const res = await axios.get("/api/income-head-account");
    setAccounts(res.data.data || []);
  };

  /* ========= RESOLVERS ========= */
  const getProductName = (val) => {
    if (!val) return "-";
    if (typeof val === "object") return val.name || "-";
    return financialProducts.find((p) => p._id === val)?.name || val;
  };

  const getCompanyName = (val) => {
    if (!val) return "";
    if (typeof val === "object") return val.companyName || "";
    return companyNames.find((c) => c._id === val)?.companyName || val;
  };

  /* ========= FILTER ========= */
  const filteredData = data.filter((i) => {
    const date = new Date(i.creditDate);
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    if (dateMode === "thisMonth" && date < startOfMonth) return false;
    if (
      dateMode === "lastMonth" &&
      !(date >= startOfLastMonth && date <= endOfLastMonth)
    )
      return false;

    if (dateMode === "custom") {
      if (filters.from && new Date(filters.from) > date) return false;
      if (filters.to && new Date(filters.to) < date) return false;
    }

    if (filters.account && i.accountHead?._id !== filters.account) return false;

    return true;
  });

  const total = filteredData.reduce((s, i) => s + i.amount, 0);

  /* ========= EXPORT ========= */
  const exportExcel = () => window.open("/api/income-head/export/excel");
  const exportPDF = () => window.open("/api/income-head/export/pdf");

  return (
    <div>
      <h5 className="mb-3">Export Income Balance</h5>

      {/* FILTERS */}
      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <select
          value={filters.account}
          onChange={(e) =>
            setFilters({ ...filters, account: e.target.value })
          }
          className="form-select"
        >
          <option value="">Income Heads</option>

          {accounts.map((a) => (
            <option key={a._id} value={a._id}>
              {getCompanyName(a.subHead)
                ? `${getProductName(a.head)} → ${getCompanyName(a.subHead)}`
                : getProductName(a.head)}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={dateMode}
          onChange={(e) => setDateMode(e.target.value)}
        >
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateMode === "custom" && (
          <>
            <input
              type="date"
              className="form-control"
              value={filters.from}
              onChange={(e) =>
                setFilters({ ...filters, from: e.target.value })
              }
            />
            <input
              type="date"
              className="form-control"
              value={filters.to}
              onChange={(e) =>
                setFilters({ ...filters, to: e.target.value })
              }
            />
          </>
        )}
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto border rounded bg-white mb-3">
        <table className="min-w-[700px] w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 border text-left">Account Head</th>
              <th className="px-3 py-2 border text-left">Description</th>
              <th className="px-3 py-2 border text-left">Date</th>
              <th className="px-3 py-2 border text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((i) => (
              <tr key={i._id}>
                <td className="px-3 py-2 border">
                  {getCompanyName(i.accountHead?.subHead)
                    ? `${getProductName(i.accountHead?.head)} → ${getCompanyName(
                        i.accountHead?.subHead
                      )}`
                    : getProductName(i.accountHead?.head)}
                </td>

                <td className="px-3 py-2 border">{i.description}</td>

                <td className="px-3 py-2 border">
                  {new Date(i.creditDate).toLocaleDateString()}
                </td>

                <td className="px-3 py-2 border text-right font-semibold text-green-600">
                  ₹ {i.amount}
                </td>
              </tr>
            ))}

            <tr className="bg-gray-100 font-bold">
              <td colSpan="3" className="px-3 py-2 border text-right">
                Total
              </td>
              <td className="px-3 py-2 border text-right text-green-700">
                ₹ {total}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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