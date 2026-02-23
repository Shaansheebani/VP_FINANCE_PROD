import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBanks,
  createBank,
  updateBank,
  deleteBank,
  toggleBank,
} from "../../../redux/feature/BankRedux/BankThunx";

const AddBank = () => {
  const dispatch = useDispatch();
  const { banks, loading } = useSelector((state) => state.bank);

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= CLOSE ================= */
  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setForm({ bankName: "", accountNumber: "", ifsc: "" });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.bankName || !form.accountNumber || !form.ifsc) {
      alert("All fields required");
      return;
    }

    if (editId) {
      await dispatch(updateBank({ id: editId, data: form }));
    } else {
      await dispatch(createBank(form));
    }

    handleClose();
  };

  /* ================= EDIT ================= */
  const handleEdit = (bank) => {
    setForm({
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      ifsc: bank.ifsc,
    });

    setEditId(bank._id);
    setShow(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    if (!window.confirm("Delete bank?")) return;
    dispatch(deleteBank(id));
  };

  /* ================= TOGGLE ================= */
  const toggleStatus = (id) => {
    dispatch(toggleBank(id));
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between mb-3">
        <h5>Bank Master</h5>
        <Button onClick={() => setShow(true)}>Add Bank</Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Bank</th>
            <th>Account No</th>
            <th>IFSC</th>
            <th>Status</th>
            <th width="180">Action</th>
          </tr>
        </thead>

        <tbody>
          {banks?.map((b) => (
            <tr key={b._id}>
              <td>{b.bankName}</td>
              <td>{b.accountNumber}</td>
              <td>{b.ifsc}</td>

              <td>
                <Button
                  size="sm"
                  variant={b.isActive ? "success" : "secondary"}
                  onClick={() => toggleStatus(b._id)}
                >
                  {b.isActive ? "Active" : "Inactive"}
                </Button>
              </td>

              <td>
                <Button size="sm" onClick={() => handleEdit(b)}>
                  Edit
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(b._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {!banks?.length && !loading && (
            <tr>
              <td colSpan="5" className="text-center">
                No banks added
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ================= MODAL ================= */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Bank" : "Add Bank"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              name="accountNumber"
              value={form.accountNumber}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>IFSC</Form.Label>
            <Form.Control name="ifsc" value={form.ifsc} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleSubmit}>{editId ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddBank;