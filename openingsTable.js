function OpeningsTable() {
  console.log("🔹 Component is rendering...");

  // Initialize state with null to indicate data is loading
  const [ubData, setUbData] = React.useState(null);

  // Fetch UB data after the component mounts
  React.useEffect(() => {
    if (typeof UB !== "undefined" && typeof UB.useData === "function") {
      console.log("🔹 Fetching UB Data...");
      const data = UB.useData();
      console.log("✅ UB Data Fetched:", data);
      setUbData(data);
    } else {
      console.error("🚨 UB is not available. Ensure this is running inside UI Bakery.");
    }
  }, []);

  // Show a loading state until UB data is available
  if (!ubData) {
    return React.createElement("div", null, "⏳ Loading data...");
  }

  // Now we can safely access UB data
  const savedData = ubData.savedData || [];
  const prepOptions = ubData.prepOptions || [];
  const prepByOptions = ubData.prepBy || [];
  const supplierPreps = ubData.supplierPreps || {};
  const inHousePreps = ubData.inHousePreps || {};
  const inHouseHourRate = ubData.inHouseHourRate || {};

  const [tableData, setTableData] = React.useState(savedData);

  React.useEffect(() => {
    console.log("📢 Updated tableData:", tableData);
    requestAnimationFrame(() => {
      const table = document.querySelector("table");
      if (table) {
        const newHeight = table.scrollHeight + 50;
        UB.setHeight(newHeight);
        console.log("🔹 Resized component to:", newHeight);
      }
    });
  }, [tableData]);

  return React.createElement("div", { className: "container" }, "Your Table Here...");
}

// ✅ Make OpeningsTable available globally for UI Bakery
window.OpeningsTable = OpeningsTable;


  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
    document.head.appendChild(link);
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleEdit = (id, field, value) => {
    const updatedData = tableData.map(row => {
      if (row.id === id) {
        let updatedRow = {
          ...row,
          [field]: value
        };

        // Check if 'prepBy' is updated to 'S' (Supplier)
        if (field === "prepBy" && value === "S") {
          if (row.prep && supplierPreps[row.prep] !== undefined) {
            updatedRow.cost = supplierPreps[row.prep].cost; // Assign cost from supplierPreps
          } else {
            UB.triggerEvent({
              cat: "prepBy",
              type: "New"
            }); // Trigger event if no cost found
          }
        }

        // Check if 'prepBy' is updated to 'INH' (In-House)
        if (field === "prepBy" && value === "INH") {
          if (row.prep && inHousePreps[row.prep] !== undefined) {
            updatedRow.cost = inHousePreps[row.prep].cost; // Assign cost from inHousePreps
          } else {
            UB.triggerEvent({
              cat: "prepBy",
              type: "New"
            }); // Trigger event if no cost found
          }
        }

        // If 'prep' is updated and 'prepBy' is already 'S' (Supplier)
        if (field === "prep" && row.prepBy === "S") {
          if (value && supplierPreps[value] !== undefined) {
            updatedRow.cost = supplierPreps[value].cost; // Assign cost from supplierPreps
          } else {
            UB.triggerEvent({
              cat: "prepBy",
              type: "New"
            }); // Trigger event if no cost found
          }
        }

        // If 'prep' is updated and 'prepBy' is already 'INH' (In-House)
        if (field === "prep" && row.prepBy === "INH") {
          if (value && inHousePreps[value] !== undefined) {
            updatedRow.cost = inHousePreps[value].cost; // Assign cost from inHousePreps
          } else {
            UB.triggerEvent({
              cat: "prepBy",
              type: "New"
            }); // Trigger event if no cost found
          }
        }
        return updatedRow;
      }
      return row;
    });
    setTableData(updatedData);
    UB.updateValue(updatedData);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  if (!savedData.length) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\u26A0\uFE0F No Data Available. Check UB.useData()."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("colgroup", null, /*#__PURE__*/React.createElement("col", {
    style: {
      width: "10%"
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: "25%"
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: "10%"
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: "25%"
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: "20%"
    }
  }), /*#__PURE__*/React.createElement("col", {
    style: {
      width: "5%"
    }
  })), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null), /*#__PURE__*/React.createElement("th", null, "Prep"), /*#__PURE__*/React.createElement("th", {
    className: "multi-line-header"
  }, "List Price"), /*#__PURE__*/React.createElement("th", null, "Prep By"), /*#__PURE__*/React.createElement("th", null, "Cost"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, tableData.map((row, index) => /*#__PURE__*/React.createElement("tr", {
    key: row.id
  }, /*#__PURE__*/React.createElement("td", null, index === 0 ? "Main Lock" : "Secondary Lock"), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "input-group"
  }, /*#__PURE__*/React.createElement("select", {
    value: row.prep,
    onChange: e => handleEdit(row.id, "prep", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select"), prepOptions.map((option, idx) => /*#__PURE__*/React.createElement("option", {
    key: idx,
    value: option.id
  }, option.optionName))))), /*#__PURE__*/React.createElement("td", {
    className: "checkbox-cell"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: row.incInList || false,
    onChange: () => handleCheckboxChange(row.id)
  })), /*#__PURE__*/React.createElement("td", null, row.incInList ?
  /*#__PURE__*/
  // If checkbox is checked, show "Factory"
  React.createElement("span", null, "Factory") :
  /*#__PURE__*/
  // Otherwise, show the dropdown
  React.createElement("div", {
    className: "input-group"
  }, /*#__PURE__*/React.createElement("select", {
    value: row.prepBy,
    onChange: e => handleEdit(row.id, "prepBy", e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select"), prepByOptions.map((option, idx) => /*#__PURE__*/React.createElement("option", {
    key: idx,
    value: option.id
  }, option.optionName))))), /*#__PURE__*/React.createElement("td", null, row.incInList ? /*#__PURE__*/React.createElement("span", null, "$0.00") // If checkbox is checked, always show $0.00
  : /*#__PURE__*/React.createElement("span", null, row.cost !== undefined ? `$${row.cost.toFixed(2)}` : "$0.00") // Format cost as currency
  ), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    className: "delete-button",
    onClick: () => handleDelete(row.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "button-container"
  }, /*#__PURE__*/React.createElement("button", {
    className: "add-row-button",
    onClick: handleAddRow
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Add New Row")));
}

