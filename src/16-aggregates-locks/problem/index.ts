/**
 * Problem: Child-Entity Locking (Invariant Violation)
 * 
 * An Order (Aggregate Root) contains OrderItems (Children).
 * Business Rule: An order's total value cannot exceed $1000.
 * Two requests arrive concurrently. Request A tries to add a $600 item. Request B tries to add a $600 item.
 * If they only lock the 'OrderItem' table (which is what happens normally on an INSERT), 
 * they both read the current total as $0, they both insert, and the invariant is broken ($1200).
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const Database = {
    orders: [{ id: 1, status: "OPEN" }],
    order_items: [] as any[]
};

async function addItemToOrder(orderId: number, itemPrice: number, requestName: string) {
    console.log(`[${requestName}] Attempting to add $${itemPrice} item to Order ${orderId}...`);
    
    // 1. Read current aggregate state (No locks on the parent!)
    const currentItems = Database.order_items.filter(i => i.orderId === orderId);
    const currentTotal = currentItems.reduce((sum, item) => sum + item.price, 0);
    
    console.log(`[${requestName}] Current total is $${currentTotal}.`);
    
    // 2. Check Business Invariant
    if (currentTotal + itemPrice > 1000) {
        console.log(`[${requestName}] FAILED! Exceeds $1000 limit.`);
        return;
    }
    
    // Simulate network latency before writing
    await delay(100);
    
    // 3. Write child entity
    Database.order_items.push({ orderId, price: itemPrice, name: requestName });
    console.log(`[${requestName}] SUCCESS! Item added.`);
}

async function runChildLockingProblem() {
    console.log("--- RUNNING CHILD-ENTITY LOCKING PROBLEM ---");
    
    // Two concurrent requests to the SAME order
    await Promise.all([
        addItemToOrder(1, 600, "Request A"),
        addItemToOrder(1, 600, "Request B")
    ]);
    
    const finalTotal = Database.order_items.reduce((sum, item) => sum + item.price, 0);
    console.log("\nFinal Order State:");
    console.log(Database.order_items);
    console.log(`Final Total: $${finalTotal}`);
    console.log("Drawback: The $1000 invariant was completely violated because the Aggregate Root wasn't locked!");
    console.log("--------------------------------------------");
}

runChildLockingProblem();
