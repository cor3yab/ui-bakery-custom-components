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
      const ubData = UB.useData(); // ✅ Fetch once at the top

      if (!ubData) {
        console.warn("⚠️ UB Data is not ready yet.");
        return React.createElement("div", null, "⏳ UB Data is loading...");
      }

      console.log("✅ UB Data Loaded:", ubData);

      // ✅ Render Data in a Simple Table
      return React.createElement("div", { className: "container" }, 
        React.createElement("h3", null, "UB Data Preview"),
        React.createElement("table", null, 
          React.createElement("thead", null, 
            React.createElement("tr", null, 
              React.createElement("th", null, "ID"),
              React.createElement("th", null, "Option Name")
            )
          ),
          React.createElement("tbody", null, 
            ubData.prepOptions.map(option => 
              React.createElement("tr", { key: option.id }, 
                React.createElement("td", null, option.id),
                React.createElement("td", null, option.optionName)
              )
            )
          )
        )
      );

    } catch (error) {
      console.error("🚨 UB Data Fetch Error:", error);
      return React.createElement("div", null, "❌ Error fetching UB data.");
    }
  }

  // ✅ Attach Component to Window for External Use
  window.OpeningsTable = OpeningsTable;
})();
