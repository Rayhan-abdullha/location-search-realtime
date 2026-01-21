import { useState, useEffect, useMemo } from "react";
import geoData from "../../bd.json";

const Search = () => {
  const locationData = geoData?.[0]?.data || {};

  // ----------------------
  // Selected dropdown values
  // ----------------------
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazilla, setSelectedUpazilla] = useState("");
  const [selectedUnion, setSelectedUnion] = useState("");

  // Lists for dropdowns
  const [districts, setDistricts] = useState([]);
  const [upazillas, setUpazillas] = useState([]);
  const [unions, setUnions] = useState([]);

  // ----------------------
  // Search
  // ----------------------
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // ----------------------
  // Flatten the data for search
  // ----------------------
  const flattenedLocations = useMemo(() => {
    const flat = [];
    Object.entries(locationData).forEach(([divisionName, divValue]) => {
      (divValue.districts || []).forEach((district) => {
        (district.upazillas || []).forEach((upazilla) => {
          (upazilla.unions?.data || []).forEach((union) => {
            flat.push({
              division: divisionName,
              district: district.name,
              upazilla: upazilla.name,
              union: union.name
            });
          });

          if (!upazilla.unions?.data || upazilla.unions.data.length === 0) {
            flat.push({
              division: divisionName,
              district: district.name,
              upazilla: upazilla.name,
              union: null
            });
          }
        });

        if (!district.upazillas || district.upazillas.length === 0) {
          flat.push({
            division: divisionName,
            district: district.name,
            upazilla: null,
            union: null
          });
        }
      });

      if (!divValue.districts || divValue.districts.length === 0) {
        flat.push({
          division: divisionName,
          district: null,
          upazilla: null,
          union: null
        });
      }
    });
    return flat;
  }, [locationData]);

  // ----------------------
  // Search logic
  // ----------------------
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase().trim();

    const results = flattenedLocations.filter(loc =>
      (loc.division && loc.division.toLowerCase().includes(q)) ||
      (loc.district && loc.district.toLowerCase().includes(q)) ||
      (loc.upazilla && loc.upazilla.toLowerCase().includes(q)) ||
      (loc.union && loc.union.toLowerCase().includes(q))
    );

    setSearchResults(results);
  }, [query, flattenedLocations]);

  // ----------------------
  // When Division changes, update Districts
  // ----------------------
  useEffect(() => {
    if (selectedDivision) {
      setDistricts(locationData[selectedDivision]?.districts || []);
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedUpazilla("");
    setSelectedUnion("");
    setUpazillas([]);
    setUnions([]);
  }, [selectedDivision]);

  // ----------------------
  // When District changes, update Upazillas
  // ----------------------
  useEffect(() => {
    const district = districts.find(d => d.name === selectedDistrict);
    setUpazillas(district?.upazillas || []);
    setSelectedUpazilla("");
    setSelectedUnion("");
    setUnions([]);
  }, [selectedDistrict, districts]);

  // ----------------------
  // When Upazilla changes, update Unions
  // ----------------------
  useEffect(() => {
    const upazilla = upazillas.find(u => u.name === selectedUpazilla);
    setUnions(upazilla?.unions.data || []);
    setSelectedUnion("");
  }, [selectedUpazilla, upazillas]);

  // ----------------------
  // When user clicks a search result, select hierarchy
  // ----------------------
  const handleSelectSearchResult = (loc) => {
    setSelectedDivision(loc.division || "");
    setSelectedDistrict(loc.district || "");
    setSelectedUpazilla(loc.upazilla || "");
    setSelectedUnion(loc.union || "");
    setQuery(""); // clear search box
    setSearchResults([]);
  };

  // ----------------------
  // Render
  // ----------------------
  return (
<div style={{ 
    maxWidth: 480, 
    margin: "30px auto",
    padding: "28px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    display: "flex", 
    flexDirection: "column", 
    gap: "18px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
}}>
    <h3 style={{ margin: "0 0 4px 0", color: "#1a1a1a", fontSize: "20px", fontWeight: "700" }}>
        Location Selector
    </h3>

    {/* Search Box Container */}
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginLeft: "4px" }}>Search Location</label>
        <input
            type="text"
            placeholder="Search e.g. 'Dhaka' or 'Mirpur'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
                padding: "12px 16px", 
                borderRadius: "12px", 
                border: "2px solid #edf2f7", 
                outline: "none",
                fontSize: "15px",
                transition: "border-color 0.2s",
                backgroundColor: "#f8fafc"
            }}
            onFocus={(e) => e.target.style.borderColor = "#3182ce"}
            onBlur={(e) => e.target.style.borderColor = "#edf2f7"}
        />
        
        {/* Modern Floating Search Results */}
        {searchResults.length > 0 && (
            <ul style={{ 
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                marginTop: "8px",
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "8px 0",
                maxHeight: "220px",
                overflowY: "auto",
                listStyle: "none"
            }}>
                {searchResults.map((loc, i) => (
                    <li
                        key={i}
                        onClick={() => handleSelectSearchResult(loc)}
                        style={{ 
                            padding: "10px 16px", 
                            cursor: "pointer", 
                            fontSize: "14px",
                            color: "#4a5568",
                            borderBottom: i === searchResults.length - 1 ? "none" : "1px solid #f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f7fafc"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <span style={{ color: "#3182ce" }}>📍</span>
                        <span>
                            {loc.division} 
                            {loc.district && <span style={{color: "#cbd5e0", margin: "0 4px"}}>›</span>} {loc.district}
                            {loc.upazilla && <span style={{color: "#cbd5e0", margin: "0 4px"}}>›</span>} {loc.upazilla}
                        </span>
                    </li>
                ))}
            </ul>
        )}
    </div>

    {/* Dropdowns Grid (2x2 Layout for better use of space) */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
            { label: "Division", value: selectedDivision, setter: setSelectedDivision, data: Object.keys(locationData), disabled: false },
            { label: "District", value: selectedDistrict, setter: setSelectedDistrict, data: districts, disabled: !selectedDivision },
            { label: "Upazilla", value: selectedUpazilla, setter: setSelectedUpazilla, data: upazillas, disabled: !selectedDistrict },
            { label: "Union", value: selectedUnion, setter: setSelectedUnion, data: unions, disabled: !selectedUpazilla }
        ].map((field, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ 
                    fontSize: "13px", 
                    fontWeight: "600", 
                    color: field.disabled ? "#cbd5e0" : "#666",
                    marginLeft: "4px"
                }}>
                    {field.label}
                </label>
                <select
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    disabled={field.disabled}
                    style={{
                        padding: "10px",
                        borderRadius: "10px",
                        border: "2px solid",
                        borderColor: field.disabled ? "#f1f5f9" : "#edf2f7",
                        backgroundColor: field.disabled ? "#f8fafc" : "#fff",
                        color: field.disabled ? "#a0aec0" : "#2d3748",
                        fontSize: "14px",
                        outline: "none",
                        cursor: field.disabled ? "not-allowed" : "pointer",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23A0AEC0%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 10px top 50%",
                        backgroundSize: "10px auto"
                    }}
                >
                    <option value="">Select...</option>
                    {field.data.map((item) => {
                        const val = typeof item === 'string' ? item : item.name;
                        return <option key={val} value={val}>{val}</option>;
                    })}
                </select>
            </div>
        ))}
    </div>
</div>
  );
};

export default Search;
