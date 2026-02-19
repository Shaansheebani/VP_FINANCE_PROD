import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCompanyName,
  fetchCompanyNames,
  updateCompanyName,
  deleteCompanyName,
} from "../../../redux/feature/FormCompany/FormCompanyThunx";
import {
  clearFormCompanyState,
} from "../../../redux/feature/FormCompany/FormCompanySlice";
import axios from "../../../config/axios";

const FormCompanyMaster = () => {
  const dispatch = useDispatch();

  const { companies, loading, error, success } = useSelector(
    (state) => state.formCompany
  );

  const [companyName, setCompanyName] = useState("");
  const [editId, setEditId] = useState(null);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchCompanyNames());
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("api/department-financial-products");
        setProducts(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);


  /* ================= RESET STATE ================= */
  useEffect(() => {
    if (success) {
      setCompanyName("");
      setProductId("");
      setEditId(null);
      dispatch(clearFormCompanyState());
    }
  }, [success, dispatch]);

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!companyName.trim() || !productId) return;

    if (editId) {
      dispatch(updateCompanyName({ id: editId, companyName, productId }));
    } else {
      dispatch(createCompanyName({ companyName, productId }));
    }
  };


  /* ================= EDIT ================= */
  const handleEdit = (company) => {
    setEditId(company._id);
    setCompanyName(company.companyName);
    setProductId(company.productId?._id || company.productId);
  };



  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      dispatch(deleteCompanyName(id));
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <h4 className="text-lg font-semibold mb-4 underline">
        DEPARTMENT COMPANY NAME
      </h4>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 items-end mb-6"
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">
            Financial Product
          </label>

          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-64"
            required
          >
            <option value="">Select Product</option>

            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-64"
            placeholder="Enter company name"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setCompanyName("");
            }}
            className="bg-gray-300 px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm mb-3">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2">Company Name</th>
              <th className="text-left px-3 py-2">Product</th>
              <th className="text-center px-3 py-2 w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td
                  colSpan="2"
                  className="text-center py-4 text-gray-500"
                >
                  No companies found
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr
                  key={company._id}
                  className="border-t"
                >
                  <td className="px-3 py-2">
                    {company.companyName}
                  </td>
                  <td className="px-3 py-2">
                    {company.productId?.name}
                  </td>
                  <td className="flex px-3 py-2 text-center gap-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="text-white bg-blue-600 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="text-white bg-red-600 border border-red px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormCompanyMaster;
