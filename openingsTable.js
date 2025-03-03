(function () {
  function fetchUbData(callback) {
    let attempts = 0;

    function tryFetching() {
      try {
        if (typeof UB !== "undefined" && typeof UB.useData === "function") {
          console.log("🔹 Fetching UB Data...");
          const data = UB.useData();

          if (data) {
            console.log("✅ UB Data Loaded:", data);
            callback(null, data);
          } else {
            console.warn("⚠️ UB.useData() returned undefined. Retrying...");
            if (attempts < 5) {
              attempts++;
              setTimeout(tryFetching, 1000); // Retry every second
            } else {
              callback(new Error("UB.useData() failed after 5 attempts"));
            }
          }
        } else {
          console.error("🚨 UB is not ready. Retrying...");
          if (attempts < 5) {
            attempts++;
            setTimeout(tryFetching, 1000);
          } else {
            callback(new Error("UB API not available"));
          }
        }
      } catch (err) {
        callback(err);
      }
    }

    tryFetching();
  }

  function OpeningsTable({ ubData }) {
    console.log("🔹 Component is rendering...");

    const { useState } = React;
    const [tableData, setTableData] = useState(ubData?.savedData ?? []);

    // ✅ Ensure valid data
    const prepOptions = ubData?.prepOptions ?? [];
    const prepByOptions = ubData?.prepBy ?? [];

    // ✅ Event Handlers
    const handleAddRow = () => {
      const newRow = {
        id: Math.random().toString(36).substr(2, 9),
        prep: "",
        prepBy: "",
        cost: 0.0,
        incInList: false
      };
      setTableData(prevData => [...prevData, newRow]);
      UB.updateValue([...tableData, newRow]);
    };

    const handleEdit = (id, field, value) => {
      const updatedData = tableData.map(row => {
        if (row.id === id) {
          let updatedRow = { ...row, [field]: value };

          if (field === "prepBy" && value === "S") {
            updatedRow.cost = row.prep && ubData?.supplierPreps?.[row.prep]?.cost || 0;
          }
          if (field === "prepBy" && value === "INH") {
            updatedRow.cost = row.prep && ubData?.inHousePreps?.[row.prep]?.cost || 0;
          }
          if (field === "prep" && row.prepBy === "S") {
            updatedRow.cost = ubData?.supplierPreps?.[value]?.cost || 0;
          }
          if (field === "prep" && row.prepBy === "INH") {
            updatedRow.cost = ubData?.inHousePreps?.[value]?.cost || 0;
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

    return React.createElement("div", { className: "container" }, 
      React.createElement("table", null, 
        React.createElement("thead", null, 
          React.createElement("tr", null, 
            React.createElement("th", null, "Prep"), 
            React.createElement("th", null, "List Price"), 
            React.createElement("th", null, "Prep By"), 
            React.createElement("th", null, "Cost"), 
            React.createElement("th", null)
          )
        ),
        React.createElement("tbody", null, tableData.map(row => 
          React.createElement("tr", { key: row.id }, 
            React.createElement("td", null, 
              React.createElement("select", {
                value: row.prep,
                onChange: e => handleEdit(row.id, "prep", e.target.value)
              }, 
                React.createElement("option", { value: "" }, "Select"), 
                prepOptions.map(option => React.createElement("option", { key: option.id, value: option.id }, option.optionName))
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
              React.createElement("select", {
                value: row.prepBy,
                onChange: e => handleEdit(row.id, "prepBy", e.target.value)
              }, 
                React.createElement("option", { value: "" }, "Select"), 
                prepByOptions.map(option => React.createElement("option", { key: option.id, value: option.id }, option.optionName))
              )
            ), 
            React.createElement("td", null, 
              React.createElement("span", null, 
                `$${(row.cost || 0).toFixed(2)}`
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

  // ✅ Fetch UB Data and Then Render Component
  fetchUbData((err, ubData) => {
    if (err) {
      console.error("🚨 UB Data Fetch Error:", err);
      window.OpeningsTable = () => React.createElement("div", null, `🚨 Error: ${err.message}`);
    } else {
      window.OpeningsTable = () => React.createElement(OpeningsTable, { ubData });
    }
  });
})();
