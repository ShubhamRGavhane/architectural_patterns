/**
 * Solution: Physical Schema Optimization (Partitioning)
 * 
 * We use Table Partitioning. Logically, the application still sees one 'logs' table.
 * Physically, the database splits it into 12 different files on the hard drive 
 * (e.g., one partition per month).
 */

// Simulating physical partitions on disk
const partitionedLogTable: Record<number, any[]> = {};

function generatePartitionedLogs() {
    for(let month = 1; month <= 12; month++) {
        partitionedLogTable[month] = [];
        for(let i = 0; i < 50000; i++) {
            partitionedLogTable[month].push({ id: Math.random(), month: month, message: "System OK" });
        }
    }
}

function runPartitionedSolution() {
    console.log("--- RUNNING PARTITIONED TABLE SOLUTION ---");
    generatePartitionedLogs();
    
    let totalRows = Object.values(partitionedLogTable).reduce((sum, partition) => sum + partition.length, 0);
    console.log(`Log table size: ${totalRows} rows (Split across 12 physical files)`);

    console.log("\nScenario: Deleting logs from January (Month 1)...");
    
    // In SQL: DROP TABLE logs_january;
    // This is instant and requires almost zero CPU or memory.
    const startTime = Date.now();
    
    const deletedCount = partitionedLogTable[1].length;
    // Physically dropping the partition file from the OS
    delete partitionedLogTable[1]; 
    
    const timeTaken = Date.now() - startTime;
    console.log(`Deleted ${deletedCount} rows in ${timeTaken}ms.`);
    console.log("Benefit: We literally just deleted a file from the OS. Instant, no table locks, no fragmentation.");
    console.log("------------------------------------------");
}

runPartitionedSolution();
