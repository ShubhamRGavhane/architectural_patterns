/**
 * Problem: Ignoring the Physical Schema
 * 
 * A logical schema (tables, columns) works well for small data.
 * But when a single table (e.g., 'logs') grows to 500 million rows, 
 * queries become incredibly slow because the physical file on the hard drive is massive.
 * Deleting old data (e.g., older than 1 year) requires an expensive DELETE statement 
 * that locks the table and bloats the transaction log.
 */

// Simulating a massive, unpartitioned table stored as a single contiguous array (file)
const monolithicLogTable: any[] = [];

function generateLogs() {
    for(let month = 1; month <= 12; month++) {
        for(let i = 0; i < 50000; i++) {
            monolithicLogTable.push({ id: Math.random(), month: month, message: "System OK" });
        }
    }
}

function runMonolithicProblem() {
    console.log("--- RUNNING MONOLITHIC TABLE PROBLEM ---");
    generateLogs();
    console.log(`Log table size: ${monolithicLogTable.length} rows (Single physical file)`);

    console.log("\nScenario: Deleting logs from January (Month 1)...");
    
    // In SQL: DELETE FROM logs WHERE month = 1;
    // This is a devastating operation on a massive table.
    const startTime = Date.now();
    
    let deletedCount = 0;
    // Simulating the CPU intensive row-by-row deletion
    for (let i = monolithicLogTable.length - 1; i >= 0; i--) {
        if (monolithicLogTable[i].month === 1) {
            monolithicLogTable.splice(i, 1);
            deletedCount++;
        }
    }
    
    const timeTaken = Date.now() - startTime;
    console.log(`Deleted ${deletedCount} rows in ${timeTaken}ms.`);
    console.log("Drawback: The database had to scan and rewrite the massive physical file (table lock/fragmentation).");
    console.log("----------------------------------------");
}

runMonolithicProblem();
