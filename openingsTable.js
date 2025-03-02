import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function OpeningsTable() {
  console.log("🔹 Component is rendering...");
  if (typeof UB === "undefined" || typeof UB.useData !== "function") {
    console.error("🚨 UB is not defined. Ensure this is running in the correct environment.");
    return /*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx("strong", {
        children: "\u26A0\uFE0F UB is not available. Ensure UB.useData() exists."
      })
    });
  }
  const ubData = UB.useData();
  console.log("🔹 UB Data Loaded:", ubData);
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
  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css";
    document.head.appendChild(link);
  }, []);
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
            updatedRow.cost = supplierPreps[row.prep]; // Assign cost from supplierPreps
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
            updatedRow.cost = inHousePreps[row.prep]; // Assign cost from inHousePreps
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
            updatedRow.cost = supplierPreps[value]; // Assign cost from supplierPreps
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
            updatedRow.cost = inHousePreps[value]; // Assign cost from inHousePreps
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
  const handleCheckboxChange = id => {
    const updatedData = tableData.map(row => row.id === id ? {
      ...row,
      incInList: !row.incInList,
      cost: !row.incInList ? {
        itemNumber: "Factory",
        materialCost: 0,
        cost: 0,
        desc: "Factory Preped"
      } : row.cost,
      prepBy: !row.incInList ? "F" : row.prepBy
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
      cost: {
        itemNumber: "Factory",
        materialCost: 0,
        cost: 0,
        desc: "Factory Preped"
      },
      incInList: true
    };
    setTableData([...tableData, newRow]);
    UB.updateValue([...tableData, newRow]);
  };
  if (!savedData.length) {
    return /*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx("strong", {
        children: "\u26A0\uFE0F No Data Available. Check UB.useData()."
      })
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "container",
    children: [/*#__PURE__*/_jsxs("table", {
      children: [/*#__PURE__*/_jsxs("colgroup", {
        children: [/*#__PURE__*/_jsx("col", {
          style: {
            width: "10%"
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: "30%"
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: "5%"
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: "30%"
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: "20%"
          }
        }), /*#__PURE__*/_jsx("col", {
          style: {
            width: "5%"
          }
        })]
      }), /*#__PURE__*/_jsx("thead", {
        children: /*#__PURE__*/_jsxs("tr", {
          children: [/*#__PURE__*/_jsx("th", {}), /*#__PURE__*/_jsx("th", {
            children: "Prep"
          }), /*#__PURE__*/_jsx("th", {
            className: "multi-line-header",
            children: "List Price"
          }), /*#__PURE__*/_jsx("th", {
            children: "Prep By"
          }), /*#__PURE__*/_jsx("th", {
            children: " List Part/Labor Cost"
          }), /*#__PURE__*/_jsx("th", {})]
        })
      }), /*#__PURE__*/_jsx("tbody", {
        children: tableData.map((row, index) => /*#__PURE__*/_jsxs("tr", {
          children: [/*#__PURE__*/_jsx("td", {
            children: index === 0 ? "Main Lock" : "Secondary Lock"
          }), /*#__PURE__*/_jsx("td", {
            children: /*#__PURE__*/_jsx("div", {
              className: "input-group",
              children: /*#__PURE__*/_jsxs("select", {
                value: row.prep,
                onChange: e => handleEdit(row.id, "prep", e.target.value),
                children: [/*#__PURE__*/_jsx("option", {
                  value: "",
                  children: "Select"
                }), prepOptions.map((option, idx) => /*#__PURE__*/_jsx("option", {
                  value: option.id,
                  children: option.optionName
                }, idx))]
              })
            })
          }), /*#__PURE__*/_jsx("td", {
            className: "checkbox-cell",
            children: /*#__PURE__*/_jsx("input", {
              type: "checkbox",
              checked: row.incInList || false,
              onChange: () => handleCheckboxChange(row.id)
            })
          }), /*#__PURE__*/_jsx("td", {
            children: row.incInList ?
            /*#__PURE__*/
            // If checkbox is checked, show "Factory"
            _jsx("span", {
              children: "Factory"
            }) :
            /*#__PURE__*/
            // Otherwise, show the dropdown
            _jsx("div", {
              className: "input-group",
              children: /*#__PURE__*/_jsxs("select", {
                value: row.prepBy,
                onChange: e => handleEdit(row.id, "prepBy", e.target.value),
                disabled: row.prep === "" // Disable when prep is empty
                ,
                children: [/*#__PURE__*/_jsx("option", {
                  value: "",
                  children: "Select"
                }), prepByOptions.map((option, idx) => /*#__PURE__*/_jsx("option", {
                  value: option.id,
                  children: option.optionName
                }, idx))]
              })
            })
          }), /*#__PURE__*/_jsx("td", {
            children: /*#__PURE__*/_jsxs("span", {
              children: [row.cost.materialCost !== undefined ? `$${row.cost.materialCost.toFixed(2)}` : "$0.00", " / ", row.cost.cost !== undefined ? `$${row.cost.cost.toFixed(2)}` : "$0.00"]
            })
          }), /*#__PURE__*/_jsx("td", {
            children: /*#__PURE__*/_jsx("button", {
              className: "delete-button",
              onClick: () => handleDelete(row.id),
              children: /*#__PURE__*/_jsx("i", {
                className: "fas fa-trash"
              })
            })
          })]
        }, row.id))
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "button-container",
      children: /*#__PURE__*/_jsxs("button", {
        className: "add-row-button",
        onClick: handleAddRow,
        disabled: tableData.some(row => row.prep === "") // Disable if any row's prep
        ,
        title: tableData.some(row => row.prep === "") ? "Please select a Prep before adding a new row." : "",
        children: [/*#__PURE__*/_jsx("i", {
          className: "fas fa-plus"
        }), " Add New Row"]
      })
    })]
  });
}
const Component = UB.connectReactComponent(OpeningsTable);
ReactDOM.render(/*#__PURE__*/_jsx(Component, {}), document.getElementById("root"));