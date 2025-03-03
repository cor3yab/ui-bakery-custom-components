(function () {
  function OpeningsTable() {
    console.log("🔹 Component is initializing...");

    const { useState, useEffect } = React;

    // ✅ State for UB Data & Ensuring Single Fetch
    const [ubData, setUbData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch UB Data Once (Properly)
    useEffect(() => {
      if (typeof UB === "undefined" || typeof UB.useData !== "function") {
        console.error("🚨 UB API is missing. Cannot load data.");
        setError("UB API is not available.");
        setLoading(false);
        return;
      }

      try {
        console.log("🔹 Fetching UB Data...");
        const data = UB.useData();

        if (!data) {
          console.warn("⚠️ UB Data is not ready yet. Retrying...");
          setTimeout(() => setUbData(UB.useData()), 500);
          return;
        }

        console.log("✅ UB Data Loaded:", data);
        setUbData(data);
        setLoading(false);
      } catch (error) {
        console.error("🚨 Error fetching UB Data:", error);
        setError("Error loading UB data.");
        setLoading(false);
      }
    }, []);

    // ✅ Loading & Error Handling
    if (loading) return React.createElement("div", null, "⏳ Loading UB Data...");
    if (error) return React.createElement("div", null, `🚨 ${error}`);

    return React.createElement("div", null, "✅ UB Data Loaded Successfully!");
  }

  // ✅ Attach Component to Window for External Use
  window.OpeningsTable = OpeningsTable;
})();
