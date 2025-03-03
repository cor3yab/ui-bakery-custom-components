(function () {
  function OpeningsTable() {
    console.log("🔹 Component is rendering...");

    const { useState, useEffect } = React;
    
    // ✅ Ensure UB Data is always initialized properly
    const [ubData, setUbData] = useState({
      savedData: [],
      prepOptions: [],
      prepBy: [],
      supplierPreps: {},
      inHousePreps: {}
    });

    const [tableData, setTableData] = useState([]);

    // ✅ Fetch UB Data Once
    useEffect(() => {
      if (typeof UB !== "undefined" && typeof UB.useData === "function") {
        try {
          console.log("🔹 Fetching UB Data...");
          const data = UB.useData();
          
          if (data) {
            console.log("✅ UB Data Loaded:", data);
            setUbData(data);
            setTableData(data.savedData ?? []);
          } else {
            console.warn("⚠️ UB.useData() returned undefined.");
          }
        } catch (error) {
          console.error("🚨 Error fetching UB Data:", error);
        }
      } else {
        console.error("🚨 UB is not available.");
      }
    }, []);

    // ✅ Prevent Render Errors
    if (!ubData || !ubData.savedData) {
      return React.createElement("div", null, "⏳ Loading...");
    }

    // ✅ Ensure UB data structure
    const prepOptions = ubData.prepOptions ?? [];
    const prepByOptions = ubData.prepBy ?? [];
    const supplierPreps = ubData.supplierPreps ?? {};
    const inHousePreps = ubData.inHousePreps ?? {};

    // ✅ Fix row.cost issue
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

  // ✅ Ensure Global Availability
  window.OpeningsTable = OpeningsTable;
})();
