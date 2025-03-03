(function () {
  function OpeningsTable() {
    console.log("🔹 Component is initializing...");

    const { useState } = React;

    // ✅ State for UB Data
    const [ubData, setUbData] = useState(() => {
      try {
        return typeof UB !== "undefined" && typeof UB.useData === "function" ? UB.useData() : null;
      } catch (error) {
        console.error("🚨 Error fetching UB Data:", error);
        return null;
      }
    });

    if (!ubData) {
      console.warn("⚠️ UB Data is not ready yet.");
      return React.createElement("div", null, "⏳ Loading UB Data...");
    }

    console.log("✅ UB Data Loaded:", ubData);

    return React.createElement("div", null, "✅ UB Data Loaded Successfully!");
  }

  // ✅ Attach Component to Window for External Use
  window.OpeningsTable = OpeningsTable;
})();
