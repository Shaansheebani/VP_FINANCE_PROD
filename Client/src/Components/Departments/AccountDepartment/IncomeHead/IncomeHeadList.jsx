import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchIncomeHeads,
    createIncomeHead,
    deleteIncomeHead,
    updateIncomeHead,
} from "../../../../redux/feature/IncomeHead/IncomeHeadThunx";

import { fetchIncomeHeadAccounts } from "../../../../redux/feature/IncomeHead/IncomeHeadAccountThunx";

const IncomeHeadList = () => {
    const dispatch = useDispatch();

    /* ================= REDUX ================= */
    const { incomeList } = useSelector((state) => state.incomeHead);
    const { accounts } = useSelector((state) => state.incomeHeadAccount);

    /* ================= LOCAL ================= */
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        accountHead: "",
        creditDate: "",
        amount: "",
        description: "",
    });

    /* ================= FETCH ================= */
    useEffect(() => {
        dispatch(fetchIncomeHeads());
        dispatch(fetchIncomeHeadAccounts());
    }, [dispatch]);

    /* ================= HANDLERS ================= */
    const handleView = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editId) {
            await dispatch(updateIncomeHead({ id: editId, data: formData }));
        } else {
            await dispatch(createIncomeHead(formData));
        }

        setEditId(null);

        setFormData({
            accountHead: "",
            creditDate: "",
            amount: "",
            description: "",
        });

        setShowAddModal(false);
    };


    const handleEdit = (item) => {
        setEditId(item._id);

        setFormData({
            accountHead: item.accountHead?._id || item.accountHead,
            description: item.description || "",
            creditDate: item.creditDate
                ? item.creditDate.split("T")[0]
                : "",
            amount: item.amount || "",
        });

        setShowAddModal(true);
    };


    const handleDelete = (id) => {
        dispatch(deleteIncomeHead(id));
    };

    /* ================= UI ================= */
    return (
        <>
            {/* Description Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Description</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedItem && (
                        <p>{selectedItem.description}</p>
                    )}
                </Modal.Body>
            </Modal>

            {/* Add Income Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Income</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Account Head</label>
                            <select
                                name="accountHead"
                                value={formData.accountHead}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="">Select</option>
                                {accounts.map((a) => (
                                    <option key={a._id} value={a._id}>
                                        {a.accountName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label>Description</label>
                            <input
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Credit Date</label>
                            <input
                                type="date"
                                name="creditDate"
                                value={formData.creditDate}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Amount</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="text-end">
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button type="submit" className="ms-2">
                                {editId ? "Update" : "Add"}
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Header */}
            <Row className="mb-3 align-items-center">
                <Col>
                    <h5>Income Head List</h5>
                </Col>

                <Col className="text-end">
                    <Button size="sm" onClick={() => setShowAddModal(true)}>
                        Add Income
                    </Button>
                    
                </Col>
            </Row>

            {/* Table */}
            <div className="w-full overflow-x-auto rounded-xl border bg-white">
                <table className="min-w-[720px] w-full whitespace-nowrap">
                    <thead className="bg-gray-100 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3">Income Head</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {incomeList.map((item) => (
                            <tr key={item._id}>
                                <td className="px-4 py-3 font-semibold">
                                    {item.accountHead?.accountName}
                                </td>

                                <td className="px-4 py-3">
                                    <Button size="sm" variant="warning" onClick={() => handleView(item)}>
                                        View
                                    </Button>
                                </td>

                                <td className="px-4 py-3">
                                    {new Date(item.creditDate).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-3 text-green-600 font-bold">
                                    ₹ {item.amount}
                                </td>

                                <td className="px-4 py-3">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        className="ms-2"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default IncomeHeadList;
