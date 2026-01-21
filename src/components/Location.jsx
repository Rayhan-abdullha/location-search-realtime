import { useState, useEffect } from "react";
import geoData from "../../bd.json"; // same structure as data above

const BDLocationSelect = () => {
  const locationData = geoData?.[0]?.data || {};

  // selected values
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazilla, setSelectedUpazilla] = useState("");
  const [selectedUnion, setSelectedUnion] = useState("");

  // lists
  const [districts, setDistricts] = useState([]);
  const [upazillas, setUpazillas] = useState([]);
  const [unions, setUnions] = useState([]);

  // Division → Districts
  useEffect(() => {
    if (selectedDivision) {
      setDistricts(
        locationData[selectedDivision]?.districts || []
      );
    } else {
      setDistricts([]);
    }

    setSelectedDistrict("");
    setSelectedUpazilla("");
    setSelectedUnion("");
    setUpazillas([]);
    setUnions([]);
  }, [selectedDivision]);

  // District → Upazillas
  useEffect(() => {
    const district = districts.find(
      (d) => d.name === selectedDistrict
    );

    setUpazillas(district?.upazillas || []);
    setSelectedUpazilla("");
    setSelectedUnion("");
    setUnions([]);
  }, [selectedDistrict, districts]);

  // Upazilla → Unions
  useEffect(() => {
    const upazilla = upazillas.find(
      (u) => u.name === selectedUpazilla
    );

    setUnions(upazilla?.unions?.data || []);
    setSelectedUnion("");
  }, [selectedUpazilla, upazillas]);

  return (
<div style={{ 
    maxWidth: 420, 
    margin: "40px auto",
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex", 
    flexDirection: "column", 
    gap: "20px",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
}}>
    <h2 style={{ margin: "0 0 10px 0", color: "#333", fontSize: "22px", textAlign: "center" }}>
        Location Selection
    </h2>

    {[
        { label: "Division", value: selectedDivision, setter: setSelectedDivision, data: Object.keys(locationData), disabled: false },
        { label: "District", value: selectedDistrict, setter: setSelectedDistrict, data: districts, disabled: !selectedDivision },
        { label: "Upazilla", value: selectedUpazilla, setter: setSelectedUpazilla, data: upazillas, disabled: !selectedDistrict },
        { label: "Union", value: selectedUnion, setter: setSelectedUnion, data: unions, disabled: !selectedUpazilla }
    ].map((field, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ 
                fontSize: "14px", 
                fontWeight: "600", 
                color: field.disabled ? "#ccc" : "#555",
                transition: "color 0.3s"
            }}>
                {field.label}
            </label>
            <select
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                disabled={field.disabled}
                style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "2px solid #e1e1e1",
                    backgroundColor: field.disabled ? "#f9f9f9" : "#fff",
                    color: field.disabled ? "#aaa" : "#333",
                    fontSize: "15px",
                    outline: "none",
                    cursor: field.disabled ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    appearance: "none", // Removes default arrow for custom feel
                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px top 50%",
                    backgroundSize: "12px auto"
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = "#4A90E2";
                    e.target.style.boxShadow = "0 0 0 3px rgba(74, 144, 226, 0.2)";
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = "#e1e1e1";
                    e.target.style.boxShadow = "none";
                }}
            >
                <option value="">Select {field.label}</option>
                {field.data.map((item) => {
                    const val = typeof item === 'string' ? item : item.name;
                    return (
                        <option key={val} value={val}>
                            {val}
                        </option>
                    );
                })}
            </select>
        </div>
    ))}
</div>
  );
};

export default BDLocationSelect;
