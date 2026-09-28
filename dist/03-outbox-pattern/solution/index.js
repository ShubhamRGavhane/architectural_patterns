"use strict";
/**
 * Solution: The Transactional Outbox Pattern
 *
 * Instead of talking to the broker directly, the main process writes the event
 * to an "Outbox" table in the EXACT SAME database transaction as the business data.
 * A separate background worker (Relay) reads the outbox and safely publishes to the broker.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
// Mock Database containing both business tables and the outbox table
const database = {
    orders: [],
    outbox: []
};
// 1. The Main Process
async function createOrderWithOutbox(order) {
    console.log(`[Main Process] Starting database transaction...`);
    // BEGIN TRANSACTION
    database.orders.push(order); // Save business data
    database.outbox.push({
        id: `evt-${Date.now()}`,
        type: 'OrderCreated',
        payload: order
    }); // Save outbox event
    // COMMIT TRANSACTION
    console.log(`[Main Process] Transaction committed! Order ${order.id} and Outbox event saved atomically.`);
}
// 2. The Background Relay Process
async function outboxRelayWorker() {
    console.log(`[Relay Worker] Polling outbox table...`);
    while (database.outbox.length > 0) {
        const event = database.outbox[0]; // Peek at oldest event
        console.log(`[Relay Worker] Found event ${event.id}. Attempting to publish to Message Broker...`);
        try {
            // Simulate broker failure 50% of the time to show resilience
            if (Math.random() > 0.5) {
                throw new Error("Network glitch to broker");
            }
            console.log(`[Relay Worker] Successfully published event ${event.id} to Message Broker!`);
            database.outbox.shift(); // Delete from outbox ONLY after successful publish
        }
        catch (error) {
            console.error(`[Relay Worker] Publish failed: ${error.message}. Will retry later. Data is NOT lost!`);
            break; // Stop polling for now, will retry on next poll
        }
    }
    console.log(`[Relay Worker] Outbox empty. Going to sleep.`);
}
async function runSolution() {
    console.log("--- RUNNING OUTBOX SOLUTION ---");
    // User request comes in
    await createOrderWithOutbox({ id: "ORD-999", amount: 500 });
    // Background worker runs periodically
    await outboxRelayWorker();
    // If it failed the first time, it runs again and eventually succeeds
    if (database.outbox.length > 0) {
        console.log("... waiting before retry ...");
        await delay(1000);
        await outboxRelayWorker();
    }
    console.log("-------------------------------");
}
runSolution();
