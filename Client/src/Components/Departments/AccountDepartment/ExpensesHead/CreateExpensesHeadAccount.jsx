import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchExpenseHeadAccounts,
  createExpenseHeadAccount,
  updateExpenseHeadAccount,
  deleteExpenseHeadAccount,
} from "../../../../redux/feature/ExpenseHead/AccountThunx";

const CreateExpensesHeadAccount = () => {
  const dispatch = useDispatch();
  const { accounts } = useSelector((state) => state.expenseHeadAccount);

  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    head: "",
    subHead: "",
  });

  useEffect(() => {
    dispatch(fetchExpenseHeadAccounts());
  }, [dispatch]);

  const handleCreate = () => {
    setEditId(null);
    setFormData({ head: "", subHead: "" });
    setShow(true);
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      head: item.head || "",
      subHead: item.subHead || "",
    });
    setShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await dispatch(updateExpenseHeadAccount({ id: editId, data: formData }));
    } else {
      await dispatch(createExpenseHeadAccount(formData));
    }

    setShow(false);
  };

  return (
    <div className="container py-4">
      <Card className="shadow">
        <Card.Body>
          <div className="flex justify-between items-center mb-4">
            <h5>Expense Head & SubHead</h5>
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
                  <td>{item.head}</td>
                  <td>{item.subHead || "-"}</td>

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
                        dispatch(deleteExpenseHeadAccount(item._id))
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
            {editId ? "Edit Expense Head / SubHead" : "Create Expense Head / SubHead"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Label>Head</Form.Label>
                <Form.Control
                  value={formData.head}
                  onChange={(e) =>
                    setFormData({ ...formData, head: e.target.value })
                  }
                  required
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Label>SubHead</Form.Label>
                <Form.Control
                  value={formData.subHead}
                  onChange={(e) =>
                    setFormData({ ...formData, subHead: e.target.value })
                  }
                />
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

export default CreateExpensesHeadAccount;