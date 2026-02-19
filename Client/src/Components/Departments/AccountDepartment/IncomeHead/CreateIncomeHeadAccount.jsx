import React, { useState, useEffect } from "react";
import axios from "../../../../config/axios";
import { Form, Row, Col, Button, Card, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanyNames } from "../../../../redux/feature/FormCompany/FormCompanyThunx";

import {
  fetchIncomeHeadAccounts,
  createIncomeHeadAccount,
  updateIncomeHeadAccount,
  deleteIncomeHeadAccount,
} from "../../../../redux/feature/IncomeHead/IncomeHeadAccountThunx";

const CreateIncomeHeadAccount = () => {
  const dispatch = useDispatch();

  /* ================= REDUX ================= */
  const { accounts } = useSelector((state) => state.incomeHeadAccount);
  const { companies: allCompanies } = useSelector((state) => state.formCompany);

  /* ================= LOCAL ================= */
  const [financialProducts, setFinancialProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    accountName: "",
    financialProduct: "",
    company: "",
    incomeTaxRefund: "",
    incomeFromCommission: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchIncomeHeadAccounts());
    dispatch(fetchCompanyNames());

    const fetchFinancialProducts = async () => {
      const res = await axios.get("api/department-financial-products");
      setFinancialProducts(res?.data?.data || []);
    };

    fetchFinancialProducts();
  }, [dispatch]);

  /* ================= COMPANY FILTER ================= */
  useEffect(() => {
    if (!formData.financialProduct) return setCompanies([]);

    const filtered =
      allCompanies?.filter(
        (c) =>
          (c.productId?._id || c.productId) === formData.financialProduct
      ) || [];

    setCompanies(filtered);
  }, [formData.financialProduct, allCompanies]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "financialProduct" && { company: "" }),
    }));
  };

  const resetForm = () => {
    setFormData({
      accountName: "",
      financialProduct: "",
      company: "",
      incomeTaxRefund: "",
      incomeFromCommission: "",
    });
    setEditId(null);
  };

  // submit

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await dispatch(updateIncomeHeadAccount({ id: editId, data: formData }));
    } else {
      await dispatch(createIncomeHeadAccount(formData));
    }

    resetForm();
  };


  // edit
  const handleEdit = (acc) => {
    const productId = acc.financialProduct?._id || acc.financialProduct;
    const companyId = acc.company?._id || acc.company;

    setEditId(acc._id);

    /* force company filtering BEFORE form set */
    const filtered =
      allCompanies?.filter(
        (c) => (c.productId?._id || c.productId) === productId
      ) || [];

    setCompanies(filtered);

    setFormData({
      accountName: acc.accountName,
      financialProduct: productId,
      company: companyId,
      incomeTaxRefund: acc.incomeTaxRefund,
      incomeFromCommission: acc.incomeFromCommission,
    });
  };

  // delete
  const handleDelete = (id) => {
    dispatch(deleteIncomeHeadAccount(id));
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      {/* FORM */}
      <Card className="shadow-lg border-0 mb-5">
        <Card.Body>
          <h3 className="text-center mb-4">Create Income Head</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Select
                  name="financialProduct"
                  value={formData.financialProduct}
                  onChange={handleChange}
                  required
                >
                  <option value="">Financial Product</option>
                  {financialProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6}>
                <Form.Select
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={!formData.financialProduct}
                  required
                >
                  <option value="">Company</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.companyName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}>
                <Form.Control
                  type="number"
                  name="incomeTaxRefund"
                  placeholder="Tax Refund"
                  value={formData.incomeTaxRefund}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6}>
                <Form.Control
                  type="number"
                  name="incomeFromCommission"
                  placeholder="Commission"
                  value={formData.incomeFromCommission}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <div className="text-center">
              <Button type="submit">
                {editId ? "Update Account" : "Save Account"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* TABLE */}
      <Card>
        <Card.Body>
          <h5 className="mb-3">Income Head Accounts</h5>
          <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
              <Table bordered hover className="mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Product</th>
                    <th>Company</th>
                    <th>Tax</th>
                    <th>Commission</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc._id}>
                      <td className="whitespace-nowrap">{acc.accountName}</td>
                      <td className="whitespace-nowrap">{acc.financialProduct?.name}</td>
                      <td className="whitespace-nowrap">{acc.company?.companyName}</td>
                      <td className="whitespace-nowrap">{acc.incomeTaxRefund}</td>
                      <td className="whitespace-nowrap">{acc.incomeFromCommission}</td>

                      <td className="whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleEdit(acc)}
                          className="me-2"
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(acc._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateIncomeHeadAccount;
