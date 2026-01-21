
//

// async function fetchBangladeshData() {
//     const BASE_URL = "https://bdapi.vercel.app/api/v.1";
//   try {
//     console.log("Fetching divisions...");
//     const divisionsRes = await fetch(`${BASE_URL}/division`);
//     const divisions = await divisionsRes.json(); // Array of {id, name, ...}
//       // Use Promise.all to fetch districts for all divisions in parallel
//     const fullData = await Promise.all(divisions?.data?.map(async (division) => {
//       console.log(`Fetching districts for ${division.name}...`);
//       const districtsRes = await fetch(`${BASE_URL}/district/${division.id}`);
//       const districts = await districtsRes.json();

//       // For each district, fetch upazillas
//       const districtsWithUpazillas = await Promise.all(districts?.data?.map(async (district) => {
//         const upazillasRes = await fetch(`${BASE_URL}/upazilla/${district.id}`);
//         const upazillas = await upazillasRes.json();

//         // For each upazilla, fetch unions
//         const upazillasWithUnions = await Promise.all(upazillas?.data?.map(async (upazilla) => {
//           const unionsRes = await fetch(`${BASE_URL}/union/${upazilla.id}`);
//           const unions = await unionsRes.json();
          
//           return { ...upazilla, unions };
//         }));

//         return { ...district, upazillas: upazillasWithUnions };
//       }));

//       return { ...division, districts: districtsWithUpazillas };
//     }));

//     console.log("Data fetching complete!");
//     return fullData;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }
// const fs = require('fs').promises; // Import the file system module

// // ... (your existing fetchBangladeshData function remains the same)

// async function main() {
//     try {
//         console.log("Starting data harvest...");
        
//         // 1. Fetch the data
//         const bdGeoData = await fetchBangladeshData();

//         // 2. Convert the object to a formatted JSON string
//         // The 'null, 2' arguments ensure the JSON is pretty-printed (readable)
//         const jsonData = JSON.stringify(bdGeoData, null, 2);

//         // 3. Write to a file named 'bangladesh_data.json'
//         await fs.writeFile('charfassion.json', jsonData, 'utf8');

//         console.log("✅ Success! Data has been saved to bangladesh_data.json");
//     } catch (err) {
//         console.error("❌ Failed to save file:", err);
//     }
// }

// main();

