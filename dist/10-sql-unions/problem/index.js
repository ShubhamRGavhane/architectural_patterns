"use strict";
/**
 * Problem: The hidden cost of SQL UNION
 *
 * Developers often use UNION to combine two datasets.
 * What they don't realize is that UNION implicitly performs a DISTINCT operation.
 * It has to sort or hash the ENTIRE combined dataset to remove duplicates.
 * If you combine two tables with 100,000 rows each, this deduplication is incredibly slow.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const datasetA = Array.from({ length: 100000 }, (_, i) => ({ id: i, value: "A" }));
const datasetB = Array.from({ length: 100000 }, (_, i) => ({ id: i + 200000, value: "B" })); // Completely unique IDs
function runUnionProblem() {
    console.log("--- RUNNING SQL UNION (PROBLEM) ---");
    console.log(`Combining Dataset A (${datasetA.length} rows) and Dataset B (${datasetB.length} rows)`);
    const startTime = Date.now();
    // Simulating SQL UNION: Combine, then deduplicate
    const combined = [...datasetA, ...datasetB];
    // Simulating the implicit DISTINCT operation that UNION performs natively
    const uniqueSet = new Set();
    const finalResult = [];
    for (const row of combined) {
        // Stringifying to simulate deep equality check on rows
        const hash = JSON.stringify(row);
        if (!uniqueSet.has(hash)) {
            uniqueSet.add(hash);
            finalResult.push(row);
        }
    }
    const timeTaken = Date.now() - startTime;
    console.log(`UNION completed in ${timeTaken}ms. Final rows: ${finalResult.length}`);
    console.log("Drawback: We knew the datasets didn't overlap, but the database wasted CPU doing a massive DISTINCT check anyway.");
    console.log("-----------------------------------");
}
runUnionProblem();
