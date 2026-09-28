"use strict";
/**
 * Problem: Storage Bloat in a Pure Star Schema
 *
 * In a Star Schema, dimensions are completely flattened.
 * If we have 10,000 stores in "New York, NY, USA, North America",
 * that exact string is duplicated 10,000 times in the database.
 * This wastes disk space, RAM, and makes updating the region name very slow.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Denormalized Dimension (Bloated)
const dim_store_bloated = [
    { store_id: 1, name: "Downtown Store", city: "New York", state: "NY", country: "USA", region: "North America" },
    { store_id: 2, name: "Uptown Store", city: "New York", state: "NY", country: "USA", region: "North America" },
    { store_id: 3, name: "Suburbs Store", city: "New York", state: "NY", country: "USA", region: "North America" },
    // ... imagine 10,000 more rows with the exact same City/State/Country strings
];
function runStarSchemaBloatProblem() {
    console.log("--- RUNNING STAR SCHEMA BLOAT (PROBLEM) ---");
    const sizeBytes = JSON.stringify(dim_store_bloated).length;
    console.log(`Current size of dim_store: ~${sizeBytes} bytes`);
    console.log("\nScenario: The company renames 'North America' to 'NA'.");
    console.log("We must scan and UPDATE every single row where region='North America'...");
    let updatedRows = 0;
    for (const store of dim_store_bloated) {
        if (store.region === "North America") {
            store.region = "NA";
            updatedRows++;
        }
    }
    console.log(`Update complete. Modified ${updatedRows} rows.`);
    console.log("Drawback: Massive data duplication and expensive UPDATE operations.");
    console.log("-------------------------------------------");
}
runStarSchemaBloatProblem();
