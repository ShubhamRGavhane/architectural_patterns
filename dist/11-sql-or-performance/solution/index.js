"use strict";
/**
 * Solution: Rewriting OR into UNION ALL
 *
 * Instead of one query with an OR, we write TWO queries with a UNION ALL.
 * Query 1: SELECT * FROM users WHERE name = 'Alice'
 * Query 2: SELECT * FROM users WHERE city = 'New York'
 *
 * Now, the query optimizer can use the 'name' index for the first query,
 * and the 'city' index for the second query.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Simulating Database Indexes (O(1) lookups)
const nameIndex = new Map();
const cityIndex = new Map();
// Populate the "database" and the "indexes"
const users = Array.from({ length: 1000000 }, (_, i) => {
    const user = {
        id: i,
        name: i === 950000 ? "Alice" : "Unknown",
        city: i === 950001 ? "New York" : "Nowhere"
    };
    if (user.name === "Alice")
        nameIndex.set("Alice", user);
    if (user.city === "New York")
        cityIndex.set("New York", user);
    return user;
});
function runUnionOptimizationSolution() {
    console.log("--- RUNNING SQL UNION OPTIMIZATION ---");
    console.log("Query: SELECT * FROM users WHERE name = 'Alice' UNION ALL SELECT * FROM users WHERE city = 'New York'");
    const startTime = Date.now();
    // Simulating an Index Seek for Query 1
    const result1 = nameIndex.get("Alice") ? [nameIndex.get("Alice")] : [];
    // Simulating an Index Seek for Query 2
    const result2 = cityIndex.get("New York") ? [cityIndex.get("New York")] : [];
    // Simulating the UNION ALL
    const finalResults = [...result1, ...result2];
    const timeTaken = Date.now() - startTime;
    console.log(`Query completed in ${timeTaken}ms. Found ${finalResults.length} rows.`);
    console.log("Benefit: We used both indexes! O(1) lookups instead of scanning 1,000,000 rows.");
    console.log("--------------------------------------");
}
runUnionOptimizationSolution();
