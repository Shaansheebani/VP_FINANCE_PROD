import React, { useState } from "react";
import CreateIncomeHeadAccount from "./CreateIncomeHeadAccount";
import IncomeHeadList from "./IncomeHeadList";
import ExportIncomeHeadData from "./ExportIncomeHeadData"; 

const IncomeHead = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="container">
      <h1>Income Head</h1>

      <ul className="nav nav-pills mb-3 bg-white shadow gap-2 p-2">
        <li>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-2 rounded ${activeTab === "list" ? "bg-primary text-white" : "bg-light"}`}
          >
            Income
          </button>
        </li>

        <li>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3 py-2 rounded ${activeTab === "create" ? "bg-primary text-white" : "bg-light"}`}
          >
            Income Head Master
          </button>
        </li>

        <li>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-3 py-2 rounded ${activeTab === "export" ? "bg-primary text-white" : "bg-light"}`}
          >
            Export Income Data
          </button>
        </li>
      </ul>

      <div className="p-3 border rounded bg-light">
        {activeTab === "list" && <IncomeHeadList />}
        {activeTab === "create" && <CreateIncomeHeadAccount />}
        {activeTab === "export" && <ExportIncomeHeadData />}
      </div>
    </div>
  );
};

export default IncomeHead;
