/**
 * Solution: SARGable Queries
 * 
 * We rewrite the query so the indexed column stands alone.
 * Query: SELECT * FROM users WHERE created_at >= '2023-01-01' AND created_at < '2024-01-01'
 * Now, the database can use the B-Tree index to instantly jump to Jan 1, 2023, 
 * and read sequentially until Jan 1, 2024.
 */

const users = Array.from({ length: 1000000 }, (_, i) => ({
    id: i,
    created_at: new Date(2020 + (i % 6), 1, 1).getTime() // Using timestamp for easy sorting simulation
}));

// Simulating a database B-Tree index (Pre-sorted by created_at)
users.sort((a, b) => a.created_at - b.created_at);

function runSargableSolution() {
    console.log("--- RUNNING SARGABLE SOLUTION ---");
    console.log("Query: SELECT * FROM users WHERE created_at >= '2023-01-01' AND created_at < '2024-01-01'");
    
    const startTime = Date.now();
    
    const startRange = new Date(2023, 0, 1).getTime();
    const endRange = new Date(2024, 0, 1).getTime();
    
    const results = [];
    
    // Simulating an Index Seek: Using Binary Search to find the exact starting point (O(log N))
    let left = 0;
    let right = users.length - 1;
    let startIndex = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (users[mid].created_at >= startRange) {
            startIndex = mid;
            right = mid - 1; // Keep looking left for the absolute first one
        } else {
            left = mid + 1;
        }
    }
    
    // Once found, just read sequentially until we hit 2024 (Index Range Scan)
    if (startIndex !== -1) {
        for (let i = startIndex; i < users.length; i++) {
            if (users[i].created_at < endRange) {
                results.push(users[i]);
            } else {
                break; // Stop immediately once we hit 2024! We don't evaluate the rest of the table.
            }
        }
    }
    
    const timeTaken = Date.now() - startTime;
    console.log(`Query completed in ${timeTaken}ms. Found ${results.length} rows.`);
    console.log("Benefit: We used Binary Search (Index Seek). Never evaluated rows outside 2023.");
    console.log("---------------------------------");
}

runSargableSolution();
