"use strict";
/**
 * Problem: SQL OR Performance (Full Table Scans)
 *
 * We have 1,000,000 users. We want to find users who are named "Alice" OR live in "New York".
 * When using the OR operator, query optimizers often panic. They realize they can't
 * easily use the 'name' index and the 'city' index at the same time.
 * As a fallback, they perform a Sequential Scan (checking every single row).
 */
Object.defineProperty(exports, "__esModule", { value: true });
const users = Array.from({ length: 1000000 }, (_, i) => ({
    id: i,
    name: i === 950000 ? "Alice" : "Unknown",
    city: i === 950001 ? "New York" : "Nowhere"
}));
function runOrProblem() {
    console.log("--- RUNNING SQL OR PROBLEM ---");
    console.log("Query: SELECT * FROM users WHERE name = 'Alice' OR city = 'New York'");
    const startTime = Date.now();
    // Simulating a Full Table Scan caused by the OR operator
    const results = [];
    for (let i = 0; i < users.length; i++) {
        // The engine has to evaluate BOTH conditions for EVERY single row
        if (users[i].name === "Alice" || users[i].city === "New York") {
            results.push(users[i]);
        }
    }
    const timeTaken = Date.now() - startTime;
    console.log(`Query completed in ${timeTaken}ms. Found ${results.length} rows.`);
    console.log("Drawback: The database ignored our indexes and checked all 1,000,000 rows (O(N) operation).");
    console.log("------------------------------");
}
runOrProblem();
