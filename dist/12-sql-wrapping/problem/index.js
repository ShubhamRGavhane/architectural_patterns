"use strict";
/**
 * Problem: SQL Wrapping (Non-SARGable Queries)
 *
 * We have an index on the 'created_at' column.
 * We want to find all users created in the year 2023.
 * If we write: SELECT * FROM users WHERE YEAR(created_at) = 2023
 * The database CANNOT use the index. It must scan every row, extract the year,
 * and compare it to 2023. This is a massive CPU overhead (Full Table Scan).
 */
Object.defineProperty(exports, "__esModule", { value: true });
const users = Array.from({ length: 1000000 }, (_, i) => ({
    id: i,
    // Random dates between 2020 and 2025
    created_at: new Date(2020 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), 1)
}));
// We want to find users from 2023
function runSqlWrappingProblem() {
    console.log("--- RUNNING SQL WRAPPING PROBLEM (NON-SARGABLE) ---");
    console.log("Query: SELECT * FROM users WHERE YEAR(created_at) = 2023");
    const startTime = Date.now();
    const results = [];
    // Simulating the Full Table Scan caused by the YEAR() function
    for (let i = 0; i < users.length; i++) {
        // The engine applies the YEAR() function to EVERY single row
        if (users[i].created_at.getFullYear() === 2023) {
            results.push(users[i]);
        }
    }
    const timeTaken = Date.now() - startTime;
    console.log(`Query completed in ${timeTaken}ms. Found ${results.length} rows.`);
    console.log("Drawback: Wrapping the column in a function disabled the index. Forced O(N) scan.");
    console.log("---------------------------------------------------");
}
runSqlWrappingProblem();
