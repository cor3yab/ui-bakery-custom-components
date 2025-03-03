(function () {
  function useUbData() {
    const { useState, useEffect } = React;
    const [ubData, setUbData] = useState(null);
    const [loading, setLoading] = useState(true);

    try {
      if (typeof UB !== "undefined" && typeof UB.useData === "function") {
        console.log("🔹 Fetching UB Data...");
        const data = UB.useData();
        if (data) {
          console.log("✅ UB Data Loaded:", data);
          setUbData(data);
        } else {
          console.warn("⚠️ UB Data is not ready yet.");
        }
      } else {
        console.error("🚨 UB API is missing.");
      }
    } catch (error) {
      console.error("🚨 Error fetching UB Data:", error);
    } finally {
      setLoading(false);
    }

    return { ubData, loading };
  }

  function OpeningsTable() {
    console.log("🔹 Component is initializing...");

    const { useState } = React;
    const { ubData, loading } = useUbData(); // ✅ Use the custom hook

    const [tableData, setTableData] = useState([]);

    if (loading) {
      return React.createElement("div", null, "⏳ Loading UB Data...");
    }

    if (!ubData) {
      return React.createElement("div", null, "🚨 UB Data failed to load.");
    }

    // ✅ Load UB data only once
    if (tableData.length === 0 && ubData.savedData?.length) {
      setTableData(ubData.savedData);
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
      setTableData(prevData => [...prevData, newRow]);
      UB.updateValue([...tableData, newRow]); // ✅ External UB Update
    };

    return React.createElement("div", { className: "container" }, 
      React.createElement("button", { className: "add-row-button", onClick: handleAddRow }, 
        React.createElement("i", { className: "fas fa-plus" }), " Add New Row"
      )
    );
  }

  // ✅ Attach Component to Window for External Use
  window.OpeningsTable = OpeningsTable;
})();
