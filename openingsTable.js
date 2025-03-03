(function () {
  function OpeningsTable() {
    console.log("🔹 Component is initializing...");

    // ✅ Check if UB API is available
    if (typeof UB === "undefined" || typeof UB.useData !== "function") {
      console.error("🚨 UB API is missing. Cannot fetch data.");
      return React.createElement("div", null, "🚨 UB API is not available.");
    }

    try {
      console.log("🔹 Fetching UB Data...");
      const ubData = UB.useData();

      if (!ubData) {
        console.warn("⚠️ UB Data is not ready yet.");
        return React.createElement("div", null, "⏳ UB Data is not ready.");
      }

      console.log("✅ UB Data Loaded:", ubData);
      return React.createElement("div", null, "✅ UB Data Loaded! Check console.");
    } catch (error) {
      console.error("🚨 Error fetching UB Data:", error);
      return React.createElement("div", null, "🚨 Error loading UB Data.");
    }
  }

  // ✅ Attach Component to Window for External Use
  window.OpeningsTable = OpeningsTable;
})();
