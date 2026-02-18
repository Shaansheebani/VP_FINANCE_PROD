import React, { useState } from "react";
import { Form, Row, Col, Modal, Button } from "react-bootstrap";
import CreateIncomeHeadAccount from "./CreateIncomeHeadAccount";
// import IncomeHeadAccounts from "./IncomeHeadAccounts"; // if you have listing component

const IncomeHead = () => {
  const [data, setData] = useState([
    { accountHead: "Lic", creditDate: "20/02/2026", amount: "10000", discription: "ok" },
    { accountHead: "Mnc", creditDate: "12/01/2026", amount: "12000", discription: "User" },
    { accountHead: "hdf", creditDate: "08/01/2026", amount: "18000", discription: "done" },
  ]);


  const [activeTab, setActiveTab] = useState("list");
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    accountHead: "",
    creditDate: "",
    amount: "",
    discription: "",
  });


  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setData([...data, formData]);

    setFormData({
      accountHead: "",
      creditDate: "",
      amount: "",
      discription: "",
    });

    setShowAddModal(false);
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Description</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedItem && (
            <div className="space-y-3">
              <p><strong>Description:</strong> {selectedItem.discription}</p>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Income Head</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Account Head</label>
              <input
                type="text"
                name="accountHead"
                value={formData.accountHead}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="discription"
                value={formData.discription}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Credit Date</label>
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
              <label className="form-label">Amount</label>
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
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>

              <Button type="submit" className="ms-2">
                Add Income
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <div className="container">
        <h1>Income Head</h1>

        <ul
          className="nav nav-pills mb-3 bg-white shadow-lg gap-2 p-2"
          role="tablist"
        >
          <li className="nav-item">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-3 py-2 rounded font-semibold transition ${activeTab === "list"
                ? "bg-blue-600 text-white"
                : "bg-blue-200 hover:scale-105"
                }`}
            >
              Income Head
            </button>
          </li>

          <li className="nav-item">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-3 py-2 rounded font-semibold transition ${activeTab === "create"
                ? "bg-blue-600 text-white"
                : "bg-blue-200 hover:scale-105"
                }`}
            >
              Create Income Head
            </button>
          </li>
        </ul>

        <div className="tab-content p-4 border rounded bg-light">
          {activeTab === "list" && (
            <div className="p-4">
              <Row>
                <Col>
                  <h4 className="text-xl font-semibold mb-4">
                    Income Head List
                  </h4>
                </Col>
                <Col className="text-end">
                  <button
                    className="px-3 py-2 rounded bg-blue-600 text-white border-0"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Income
                  </button>
                </Col>
              </Row>

              <div className="w-full overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
                <table className="min-w-[700px] w-full text-sm text-left">

                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Account Head</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Credit Date</th>
                      <th className="px-6 py-3">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition duration-200"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {item.accountHead}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          <button
                            className="px-3 py-1 rounded bg-amber-400 text-black border-0"
                            onClick={() => handleView(item)}
                          >
                            View
                          </button>
                        </td>

                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {item.creditDate}
                        </td>

                        <td className="px-6 py-4 font-semibold text-green-600">
                          <span>₹ </span>{item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          )}
          {activeTab === "create" && <CreateIncomeHeadAccount />}
        </div>
      </div>
    </>
  );
};

export default IncomeHead;
