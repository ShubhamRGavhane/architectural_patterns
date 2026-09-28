/**
 * Solution: SQL UNION ALL
 * 
 * UNION ALL simply concatenates the two datasets. 
 * It skips the expensive DISTINCT (deduplication) phase.
 * If you know your datasets are mutually exclusive, ALWAYS use UNION ALL.
 */

const datasetA = Array.from({ length: 100000 }, (_, i) => ({ id: i, value: "A" }));
const datasetB = Array.from({ length: 100000 }, (_, i) => ({ id: i + 200000, value: "B" })); 

function runUnionAllSolution() {
    console.log("--- RUNNING SQL UNION ALL (SOLUTION) ---");
    console.log(`Combining Dataset A (${datasetA.length} rows) and Dataset B (${datasetB.length} rows)`);
    
    const startTime = Date.now();
    
    // Simulating SQL UNION ALL: Just combine them! No deduplication.
    const finalResult = [...datasetA, ...datasetB];
    
    const timeTaken = Date.now() - startTime;
    console.log(`UNION ALL completed in ${timeTaken}ms. Final rows: ${finalResult.length}`);
    console.log("Benefit: Instant concatenation. Bypassed the expensive hashing/sorting algorithm.");
    console.log("---------------------------------------");
}

runUnionAllSolution();
