import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchIncomeHeadAccounts,
  createIncomeHeadAccount,
  updateIncomeHeadAccount,
  deleteIncomeHeadAccount,
  fetchHeads,
} from "../../../../redux/feature/IncomeHead/IncomeHeadAccountThunx";

import { fetchFinancialProduct } from "../../../../redux/feature/FinancialProduct/FinancialThunx";
import { fetchCompanyName } from "../../../../redux/feature/CompanyName/CompanyThunx";

const CreateIncomeHeadAccount = () => {
  const dispatch = useDispatch();

  const { accounts } = useSelector((state) => state.incomeHeadAccount);

  const companyNames =
    useSelector((state) => state.CompanyName.CompanyNames) || [];

  const financialProducts =
    useSelector((state) => state.financialProduct.FinancialProducts) || [];

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [useFinancialMode, setUseFinancialMode] = useState(false);

  const [formData, setFormData] = useState({
    head: "",
    subHead: "",
  });

  useEffect(() => {
    dispatch(fetchIncomeHeadAccounts());
    dispatch(fetchHeads());
    dispatch(fetchFinancialProduct());
    dispatch(fetchCompanyName());
  }, [dispatch]);

  /* ⭐ correct populated filter */
  const filteredCompanies = companyNames.filter(
    (c) =>
      (c.financialProduct?._id || c.financialProduct)?.toString() ===
      formData.head?.toString()
  );

  /* helpers */
  const getProductName = (id) =>
    financialProducts.find((p) => p._id === id)?.name || id;

  const getCompanyName = (id) =>
    companyNames.find((c) => c._id === id)?.companyName || id;

  const handleCreate = () => {
    setEditId(null);
    setUseFinancialMode(false);
    setFormData({ head: "", subHead: "" });
    setShow(true);
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    const isFinancial = financialProducts.some((p) => p._id === item.head);
    setUseFinancialMode(isFinancial);

    setFormData({
      head: item.head,
      subHead: item.subHead || "",
    });

    setShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await dispatch(updateIncomeHeadAccount({ id: editId, data: formData }));
    } else {
      await dispatch(createIncomeHeadAccount(formData));
    }

    setShow(false);
  };

  return (
    <div className="container py-4">
      <Card className="shadow">
        <Card.Body>
          <div className="flex justify-between items-center mb-4">
            <h5>Head & SubHead</h5>
            <Button onClick={handleCreate}>+ Create</Button>
          </div>

          <Table bordered hover>
            <thead>
              <tr>
                <th>Head</th>
                <th>SubHead</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {accounts?.map((item) => (
                <tr key={item._id}>
                  <td>{getProductName(item.head)}</td>
                  <td>{item.subHead ? getCompanyName(item.subHead) : "-"}</td>

                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        dispatch(deleteIncomeHeadAccount(item._id))
                      }
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId ? "Edit Head / SubHead" : "Create Head / SubHead"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-4 flex items-center gap-3 border-b pb-3">
              <input
                type="checkbox"
                checked={useFinancialMode}
                onChange={(e) => {
                  setUseFinancialMode(e.target.checked);
                  setFormData({ head: "", subHead: "" });
                }}
                className="h-4 w-4"
              />
              <label className="text-sm font-medium">
                Create for Financial Product & Company
              </label>
            </div>

            <Row className="mb-3">
              <Col>
                <Form.Label>Head</Form.Label>

                {useFinancialMode ? (
                  <Form.Select
                    value={formData.head}
                    onChange={(e) =>
                      setFormData({ head: e.target.value, subHead: "" })
                    }
                    required
                  >
                    <option value="">Select Financial Product</option>
                    {financialProducts.map((fp) => (
                      <option key={fp._id} value={fp._id}>
                        {fp.name}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    value={formData.head}
                    onChange={(e) =>
                      setFormData({ ...formData, head: e.target.value })
                    }
                    required
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label>SubHead</Form.Label>

                {useFinancialMode ? (
                  <Form.Select
                    value={formData.subHead}
                    onChange={(e) =>
                      setFormData({ ...formData, subHead: e.target.value })
                    }
                    disabled={!formData.head}
                  >
                    <option value="">Select Company</option>
                    {filteredCompanies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.companyName}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    value={formData.subHead}
                    onChange={(e) =>
                      setFormData({ ...formData, subHead: e.target.value })
                    }
                  />
                )}
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancel
            </Button>
            <Button type="submit">{editId ? "Update" : "Create"}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateIncomeHeadAccount;