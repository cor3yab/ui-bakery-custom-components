(function () {
  function OpeningsTable() {
    console.log("🔹 Component is initializing...");

    const { useState, useEffect } = React;

    // ✅ State for UB Data
    const [ubData, setUbData] = useState(null);

    useEffect(() => {
      if (typeof UB === "undefined" || typeof UB.useData !== "function") {
        console.error("🚨 UB API is missing. Cannot fetch data.");
        return;
      }

      console.log("🔹 Fetching UB Data...");
      const data = UB.useData();

      if (!data) {
        console.warn("⚠️ UB Data is not ready yet.");
        return;
      }

      console.log("✅ UB Data Loaded:", data);
      setUbData(data); // ✅ Store UB data in state
    }, []); // ✅ Run only once when the component mounts

    if (!ubData) {
      return React.createElement("div", null, "⏳ UB Data is loading...");
    }

    return React.createElement("div", null, "✅ UB Data Loaded! Check console.");
  }

  // ✅ Attach Component to Window for External Use
  window.OpeningsTable = OpeningsTable;
})();
