import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import {
  fetchExpenses,
  deleteExpense,
  createExpense,
  updateExpense,
} from "../../../../redux/feature/ExpenseHead/ExpenseThunks";
import { fetchBanks } from "../../../../redux/feature/BankRedux/BankThunx";
import { fetchExpenseHeadAccounts } from "../../../../redux/feature/ExpenseHead/AccountThunx";

const ExpenseHeadList = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expense);
  const { banks } = useSelector((state) => state.bank);
  const { accounts } = useSelector((state) => state.expenseHeadAccount);
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDesc, setShowDesc] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    expenseHead: "",
    bank: "",
    description: "",
    debitDate: "",
    amount: "",
  });

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchBanks());
    dispatch(fetchExpenseHeadAccounts());
  }, [dispatch]);

  const handleView = (item) => {
    setSelectedItem(item);
    setShowDesc(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete expense?")) {
      dispatch(deleteExpense(id));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await dispatch(updateExpense({ id: editId, data: form }));
    } else {
      await dispatch(createExpense(form));
    }

    dispatch(fetchExpenses());

    setEditId(null);
    setShow(false);

    setForm({
      expenseHead: "",
      bank: "",
      description: "",
      debitDate: "",
      amount: "",
    });
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setForm({
      expenseHead: item.expenseHead?._id || item.expenseHead,
      bank: item.bank?._id || item.bank,
      description: item.description || "",
      debitDate: item.debitDate ? item.debitDate.split("T")[0] : "",
      amount: item.amount || "",
    });

    setShow(true);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card p-3">
      <Row className="mb-3">
        <Col>
          <h4>Expense List</h4>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShow(true)}>Add</Button>
        </Col>
      </Row>

      {/* ✅ Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Update Expense" : "Add Expense"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>

            {/* Bank */}
            <Form.Group className="mb-2">
              <Form.Label>Select Bank</Form.Label>
              <Form.Select
                name="bank"
                value={form.bank}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>

                {banks?.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.bankName} — {b.accountNumber}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Expense Head */}
            <Form.Group className="mb-2">
              <Form.Label>Expense Head</Form.Label>
              <Form.Select
                name="expenseHead"
                value={form.expenseHead}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>

                {accounts?.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.head} → {a.subHead}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>



            {/* Description */}
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Date */}
            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="debitDate"
                value={form.debitDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Amount */}
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDesc} onHide={() => setShowDesc(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Expense Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <div className="mb-3">
            <strong>Sub Head</strong>{" "}
            <p className="mt-1"> {selectedItem?.expenseHead?.subHead || "-"}</p>
          </div>
            <hr />
          <div>
            <strong>Description:</strong>
            <p className="mt-1">
              {selectedItem?.description || "No description available"}
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* ✅ Table */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>

            <th>Bank</th>
            <th>Expense Head</th>
            <th>Description</th>
            <th>Date</th>
            <th>Amount</th>
            <th width="120">Action</th>
          </tr>
        </thead>

        <tbody>
          {expenses?.map((item, index) => (
            <tr key={item._id}>
              <td>{item.bank?.bankName}</td>
              <td>{item.expenseHead?.head}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleView(item)}
                >
                  View
                </Button>
              </td>
              <td>{new Date(item.debitDate).toLocaleDateString("en-GB")}</td>
              <td>₹ {item.amount}</td>

              <td className="flex">
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseHeadList;