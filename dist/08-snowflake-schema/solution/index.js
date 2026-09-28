"use strict";
/**
 * Solution: Snowflake Schema
 *
 * We "Snowflake" (normalize) the dimension table.
 * dim_store now only contains a foreign key to dim_city.
 * dim_city contains a foreign key to dim_state, etc.
 * Strings are stored exactly once.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Normalized Dimensions (Snowflaked)
const dim_region = [{ region_id: 1, name: "North America" }];
const dim_country = [{ country_id: 1, name: "USA", region_id: 1 }];
const dim_state = [{ state_id: 1, name: "NY", country_id: 1 }];
const dim_city = [{ city_id: 1, name: "New York", state_id: 1 }];
const dim_store_snowflaked = [
    { store_id: 1, name: "Downtown Store", city_id: 1 },
    { store_id: 2, name: "Uptown Store", city_id: 1 },
    { store_id: 3, name: "Suburbs Store", city_id: 1 },
    // ... 10,000 rows, but they only store an integer instead of long strings!
];
function runSnowflakeSchemaSolution() {
    console.log("--- RUNNING SNOWFLAKE SCHEMA (SOLUTION) ---");
    // Calculate total size
    const sizeBytes = JSON.stringify(dim_region).length +
        JSON.stringify(dim_country).length +
        JSON.stringify(dim_state).length +
        JSON.stringify(dim_city).length +
        JSON.stringify(dim_store_snowflaked).length;
    console.log(`Current size of snowflaked tables: ~${sizeBytes} bytes (Much smaller at scale!)`);
    console.log("\nScenario: The company renames 'North America' to 'NA'.");
    console.log("We only need to UPDATE exactly ONE row in the dim_region table.");
    const region = dim_region.find(r => r.name === "North America");
    if (region) {
        region.name = "NA";
    }
    console.log(`Update complete. Modified exactly 1 row.`);
    console.log("Benefit: Zero data duplication and instant updates.");
    console.log("Tradeoff: Analytical queries require more JOINs than a Star Schema.");
    console.log("-------------------------------------------");
}
runSnowflakeSchemaSolution();
