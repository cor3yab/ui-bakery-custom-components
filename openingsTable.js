(function () {
  function OpeningsTable() {
    console.log("🔹 Component is initializing...");

    const { useState, useEffect } = React;

    // ✅ State for UB data and table data
    const [tableData, setTableData] = useState([]);
    const [ubData, setUbData] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ Track loading state

    // ✅ Ensure UB API is available before running effects
    if (typeof UB === "undefined" || typeof UB.useData !== "function") {
      console.error("🚨 UB API is missing. Cannot load data.");
      return React.createElement("div", null, "🚨 UB API is not available.");
    }

    // ✅ Fetch UB Data **once** when the component mounts
    useEffect(() => {
      try {
        console.log("🔹 Fetching UB Data...");
        const data = UB.useData();
        
        if (data) {
          console.log("✅ UB Data Loaded:", data);
          setUbData(data);
          setTableData(data.savedData || []);
        } else {
          console.warn("⚠️ UB Data is not ready yet.");
        }
      } catch (error) {
        console.error("🚨 Error fetching UB Data:", error);
      } finally {
        setLoading(false); // ✅ Ensure loading state is updated
      }
    }, []); // ✅ Runs only once

    // ✅ Prevent render errors while waiting for UB data
    if (loading) {
      return React.createElement("div", null, "⏳ Loading UB Data...");
    }

    if (!ubData) {
      return React.createElement("div", null, "🚨 UB Data failed to load.");
    }

    // ✅ Ensure UB data structure is correct
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
      setTableData(prevData => {
        const updatedData = [...prevData, newRow];
        UB.updateValue(updatedData); // ✅ Update UB external data
        return updatedData;
      });
    };

    const handleEdit = (id, field, value) => {
      setTableData(prevData => {
        const updatedData = prevData.map(row => {
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

        UB.updateValue(updatedData); // ✅ Update UB external data
        return updatedData;
      });
    };

    const handleCheckboxChange = id => {
      setTableData(prevData => {
        const updatedData = prevData.map(row => row.id === id ? {
          ...row,
          incInList: !row.incInList,
          cost: !row.incInList ? 0 : row.cost,
          prepBy: !row.incInList ? "S" : row.prepBy
        } : row);
        
        UB.updateValue(updatedData);
        return updatedData;
      });
    };

    const handleDelete = id => {
      setTableData(prevData => {
        const updatedData = prevData.filter(row => row.id !== id);
        UB.updateValue(updatedData);
        return updatedData;
      });
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
                `$${Number(row.cost || 0).toFixed(2)}`
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

  // ✅ Attach Component to Window for External Use
  window.OpeningsTable = OpeningsTable;
})();
