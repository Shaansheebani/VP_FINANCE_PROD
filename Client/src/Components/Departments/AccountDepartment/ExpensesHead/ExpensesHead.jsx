import React, { useState } from "react";
import CreateExpensesHeadAccount from "./CreateExpensesHeadAccount";
import ExpensesHeadList from "./ExpensesHeadList";


const IncomeHead = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="container">
      <h1>Expenses Head</h1>

      <ul className="nav nav-pills mb-3 bg-white shadow gap-2 p-2">
        <li>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-2 rounded ${activeTab === "list" ? "bg-primary text-white" : "bg-light"}`}
          >
            Expense
          </button>
        </li>

        <li>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3 py-2 rounded ${activeTab === "create" ? "bg-primary text-white" : "bg-light"}`}
          >
            Expenses Head Master
          </button>
        </li>

        
      </ul>

      <div className="p-3 border rounded bg-light">
        {activeTab === "list" && <ExpensesHeadList />}
        {activeTab === "create" && <CreateExpensesHeadAccount />}
        
      </div>
    </div>
  );
};

export default IncomeHead;
