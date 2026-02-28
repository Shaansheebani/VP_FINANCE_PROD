import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createOfficePurchase,
  fetchOfficePurchaseByID,
  updateOfficePurchase,
} from "../../../redux/feature/OfficePurchase/PurchaseThunx";

import { clearCurrent } from
  "../../../redux/feature/OfficePurchase/PurchaseSlice";

import { fetchBanks } from
  "../../../redux/feature/BankRedux/BankThunx";

import { fetchIncomeExpenseDropdown } from
  "../../../redux/feature/IncomeExpense/incomeExpenseAccountThunk";

function AddOfficePurchase({ setActiveTab, editId, setEditId }) {
  const dispatch = useDispatch();

  const { current, loading } = useSelector(
    (state) => state.officePurchase
  );

  const { banks } = useSelector((state) => state.bank);

  const { dropdownAccounts } = useSelector(
    (state) => state.incomeExpenseAccount
  );

  const [formData, setFormData] = useState({
    vrNo: "",
    invoiceNo: "",
    transactionDate: "",
    accountRef: "",
    bankRef: "",
    itemParticulars: "",
    ratePerUnit: "",
    quantity: "",
  });

  /* Load dropdowns */
  useEffect(() => {
    dispatch(fetchBanks());
    dispatch(fetchIncomeExpenseDropdown("expense"));
  }, [dispatch]);

  /* Load edit data */
  useEffect(() => {
    if (editId) dispatch(fetchOfficePurchaseByID(editId));
  }, [dispatch, editId]);

  /* Populate edit mode */
  useEffect(() => {
    if (current && editId) {
      setFormData({
        vrNo: current.vrNo || "",
        invoiceNo: current.invoiceNo || "",
        transactionDate:
          current.transactionDate?.substring(0, 10) || "",
        accountRef: current.accountRef?._id || "",
        bankRef: current.bankRef?._id || "",
        itemParticulars: current.itemParticulars || "",
        ratePerUnit: current.ratePerUnit || "",
        quantity: current.quantity || "",
      });
    }
  }, [current, editId]);

  const calculateAmount = () => {
    const rate = parseFloat(formData.ratePerUnit);
    const qty = parseFloat(formData.quantity);
    return !isNaN(rate) && !isNaN(qty) ? rate * qty : "";
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      amount: calculateAmount(),
    };

    try {
      if (editId) {
        await dispatch(
          updateOfficePurchase({ id: editId, data: payload })
        ).unwrap();
      } else {
        await dispatch(createOfficePurchase(payload)).unwrap();
      }

      dispatch(clearCurrent());
      setEditId(null);
      setActiveTab("view");

      setFormData({
        vrNo: "",
        invoiceNo: "",
        transactionDate: "",
        accountRef: "",
        bankRef: "",
        itemParticulars: "",
        ratePerUnit: "",
        quantity: "",
      });

    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        {editId ? "Update Office Purchase" : "Add Office Purchase"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Vr No */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Vr No.
            </label>
            <input
              type="text"
              name="vrNo"
              value={formData.vrNo}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Invoice No */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Invoice No.
            </label>
            <input
              type="text"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Account Head */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Account Head
            </label>
            <select
              name="accountRef"
              value={formData.accountRef}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Head</option>
              {dropdownAccounts
                ?.filter((item) => item.type === "expense")
                .map((item) => (
                  <option key={item._id} value={item._id}>
                    {(item.headRef?.name || item.headCustom) +
                      (item.subHeadRef || item.subHeadCustom
                        ? " - " +
                          (item.subHeadRef?.companyName ||
                            item.subHeadCustom)
                        : "")}
                  </option>
                ))}
            </select>
          </div>

          {/* Bank */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Type of Payment
            </label>
            <select
              name="bankRef"
              value={formData.bankRef}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Type of Payment</option>
              {banks?.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.bankName}
                </option>
              ))}
            </select>
          </div>

          {/* Item */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Item Particulars
            </label>
            <input
              type="text"
              name="itemParticulars"
              value={formData.itemParticulars}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Rate Per Unit
            </label>
            <input
              type="number"
              name="ratePerUnit"
              value={formData.ratePerUnit}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount
            </label>
            <input
              type="number"
              value={calculateAmount()}
              readOnly
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl shadow-md transition duration-200 disabled:opacity-50"
        >
          {editId ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
}

export default AddOfficePurchase;