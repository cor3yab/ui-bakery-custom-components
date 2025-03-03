(function () {
  function OpeningsTable() {
    console.log("🔹 Component is rendering...");

    // ✅ Use React from UI Bakery (no duplicate instances)
    const { useState, useEffect } = React;

    // ✅ Initialize state safely
    const [ubData, setUbData] = useState(null);
    const [tableData, setTableData] = useState([]);

    // ✅ Fetch UB data directly in component (if UB.useData is a hook)
    if (typeof UB !== "undefined" && typeof UB.useData === "function") {
      console.log("🔹 Fetching UB Data...");
      try {
        const data = UB.useData(); // ✅ Call it inside component function
        console.log("✅ UB Data Loaded:", data);
        if (data) {
          setUbData(data);
          setTableData(data.savedData ?? []);
        }
      } catch (error) {
        console.error("🚨 Error fetching UB Data:", error);
      }
    } else {
      console.warn("⚠️ UB.useData() is unavailable.");
    }

    // ✅ Prevent rendering errors if UB data isn't ready
    if (!ubData) {
      return React.createElement("div", null, "⏳ Loading...");
    }

    // ✅ Ensure UB data structure is correct
    const prepOptions = ubData?.prepOptions ?? [];
    const prepByOptions = ubData?.prepBy ?? [];
    const supplierPreps = ubData?.supplierPreps ?? {};
    const inHousePreps = ubData?.inHousePreps ?? {};

    // ✅ Event Handlers
    const handleEdit = (id, field, value) => {
      const updatedData = tableData.map(row => {
        if (row.id === id) {
          let updatedRow = { ...row, [field]: value };

          if (field === "prepBy" && value === "S") {
            updatedRow.cost = row.prep && supplierPreps[row.prep] ? supplierPreps[row.prep].cost : 0;
          }
          if (field === "prepBy" && value === "INH") {
            updatedRow.cost = row.prep && inHousePreps[row.prep] ? inHousePreps[row.prep].cost : 0;
          }
          if (field === "prep" && row.prepBy === "S") {
            updatedRow.cost = supplierPreps[value] ? supplierPreps[value].cost : 0;
          }
          if (field === "prep" && row.prepBy === "INH") {
            updatedRow.cost = inHousePreps[value] ? inHousePreps[value].cost : 0;
          }
          return updatedRow;
        }
        return row;
      });

      setTableData(updatedData);
      UB.updateValue(updatedData);
    };

    const handleCheckboxChange = id => {
      const updatedData = tableData.map(row => row.id === id ? {
        ...row,
        incInList: !row.incInList,
        cost: !row.incInList ? 0 : row.cost,
        prepBy: !row.incInList ? "S" : row.prepBy
      } : row);
      setTableData(updatedData);
      UB.updateValue(updatedData);
    };

    const handleDelete = id => {
      const updatedData = tableData.filter(row => row.id !== id);
      setTableData(updatedData);
      UB.updateValue(updatedData);
    };

    const handleAddRow = () => {
      const newRow = {
        id: Math.random().toString(36).substr(2, 9),
        prep: "",
        prepBy: "",
        cost: 0.0,
        incInList: false
      };
      setTableData([...tableData, newRow]);
      UB.updateValue([...tableData, newRow]);
    };

    // ✅ Ensure correct return statement
    return React.createElement("div", { className: "container" }, 
      React.createElement("table", null, 
        React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", null), 
            React.createElement("th", null, "Prep"), 
            React.createElement("th", null, "List Price"), 
            React.createElement("th", null, "Prep By"), 
            React.createElement("th", null, "Cost"), 
            React.createElement("th", null)
          )
        ),
        React.createElement("tbody", null, tableData.map((row, index) => 
          React.createElement("tr", { key: row.id }, 
            React.createElement("td", null, index === 0 ? "Main Lock" : "Secondary Lock"), 
            React.createElement("td", null, 
              React.createElement("select", {
                value: row.prep,
                onChange: e => handleEdit(row.id, "prep", e.target.value)
              }, 
                React.createElement("option", { value: "" }, "Select"), 
                prepOptions.map((option, idx) => React.createElement("option", { key: idx, value: option.id }, option.optionName))
              )
            ), 
            React.createElement("td", null, 
              React.createElement("input", {
                type: "checkbox",
                checked: row.incInList || false,
                onChange: () => handleCheckboxChange(row.id)
              })
            ), 
            React.createElement("td", null, 
              row.incInList ? React.createElement("span", null, "Factory") :
              React.createElement("select", {
                value: row.prepBy,
                onChange: e => handleEdit(row.id, "prepBy", e.target.value)
              }, 
                React.createElement("option", { value: "" }, "Select"), 
                prepByOptions.map((option, idx) => React.createElement("option", { key: idx, value: option.id }, option.optionName))
              )
            ), 
            React.createElement("td", null, 
              React.createElement("span", null, 
  typeof row.cost === "number" ? `$${row.cost.toFixed(2)}` : "$0.00"
)

            ), 
            React.createElement("td", null, 
              React.createElement("button", { className: "delete-button", onClick: () => handleDelete(row.id) }, 
                React.createElement("i", { className: "fas fa-trash" })
              )
            )
          )
        ))
      ), 
      React.createElement("button", { className: "add-row-button", onClick: handleAddRow }, 
        React.createElement("i", { className: "fas fa-plus" }), " Add New Row"
      )
    );
  }

  // ✅ Move the global assignment outside of the function
  window.OpeningsTable = OpeningsTable;
})();
