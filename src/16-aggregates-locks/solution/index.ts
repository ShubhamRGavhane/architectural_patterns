/**
 * Solution: Aggregate-Based Locking (Optimistic Concurrency)
 * 
 * We place a 'version' column on the Aggregate Root (the Order).
 * Whenever ANY child entity (OrderItem) is modified, we MUST increment the version 
 * of the parent Order.
 * If two requests try to modify the aggregate at the same time, one will fail the 
 * version check (OptimisticLockException) and abort, protecting the business invariant.
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const Database = {
    // Note the 'version' column on the Aggregate Root
    orders: [{ id: 1, status: "OPEN", version: 1 }],
    order_items: [] as any[],
    
    // Simulating an atomic UPDATE orders SET version = version + 1 WHERE id = ? AND version = ?
    incrementAggregateVersion: async function(orderId: number, expectedVersion: number) {
        const order = this.orders.find(o => o.id === orderId);
        if (order && order.version === expectedVersion) {
            order.version++;
            return true;
        }
        return false;
    }
};

async function addItemToOrder(orderId: number, itemPrice: number, requestName: string) {
    console.log(`[${requestName}] Attempting to add $${itemPrice} item...`);
    
    // 1. Read current aggregate state AND the current version
    const order = Database.orders.find(o => o.id === orderId)!;
    const currentVersion = order.version;
    
    const currentItems = Database.order_items.filter(i => i.orderId === orderId);
    const currentTotal = currentItems.reduce((sum, item) => sum + item.price, 0);
    
    // 2. Check Business Invariant
    if (currentTotal + itemPrice > 1000) {
        console.log(`[${requestName}] FAILED! Exceeds $1000 limit.`);
        return;
    }
    
    // Simulate network latency before writing
    await delay(100);
    
    // 3. ATTEMPT to lock the Aggregate Root
    const lockSuccess = await Database.incrementAggregateVersion(orderId, currentVersion);
    
    if (lockSuccess) {
        // 4. Write child entity only if the Root was successfully locked/versioned
        Database.order_items.push({ orderId, price: itemPrice, name: requestName });
        console.log(`[${requestName}] SUCCESS! Item added. Order version bumped to ${currentVersion + 1}.`);
    } else {
        console.log(`[${requestName}] FAILED! Optimistic Lock Exception. Another process modified the aggregate.`);
    }
}

async function runAggregateLockingSolution() {
    console.log("--- RUNNING AGGREGATE-BASED LOCKING SOLUTION ---");
    
    // Two concurrent requests to the SAME order
    await Promise.all([
        addItemToOrder(1, 600, "Request A"),
        addItemToOrder(1, 600, "Request B")
    ]);
    
    const finalTotal = Database.order_items.reduce((sum, item) => sum + item.price, 0);
    console.log("\nFinal Order State:");
    console.log(Database.order_items);
    console.log(`Final Total: $${finalTotal}`);
    console.log("Benefit: The invariant ($1000 max) is protected because the Aggregate Root forced serialization.");
    console.log("------------------------------------------------");
}

runAggregateLockingSolution();
