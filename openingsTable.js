(function () {
  function OpeningsTable() {
    console.log("🔹 Component is initializing...");

    const { useState } = React;

    // ✅ Ensure UB API is available
    if (typeof UB === "undefined" || typeof UB.useData !== "function") {
      console.error("🚨 UB API is missing. Cannot fetch data.");
      return React.createElement("div", null, "🚨 UB API is not available.");
    }

    console.log("🔹 Fetching UB Data...");
    
    try {
      const ubData = UB.useData(); // ✅ Call it like a React Hook (outside of useEffect)

      if (!ubData) {
        console.warn("⚠️ UB Data is not ready yet.");
        return React.createElement("div", null, "⏳ UB Data is loading...");
      }

      console.log("✅ UB Data Loaded:", ubData);
      
      return React.createElement("pre", null, JSON.stringify(ubData, null, 2));
      
    } catch (error) {
      console.error("🚨 UB Data Fetch Error:", error);
      return React.createElement("div", null, "❌ Error fetching UB data.");
    }
  }

  // ✅ Attach Component to Window for External Use
  window.OpeningsTable = OpeningsTable;
})();
