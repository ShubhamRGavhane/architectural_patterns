"use strict";
/**
 * Problem: The Dual Write (Non-Atomic)
 *
 * We want to save an Order to the database and then publish an "OrderCreated" event to Kafka.
 * These are two different storage systems. We cannot wrap them in a single ACID transaction.
 * If the database succeeds but Kafka fails (crashes), the system is in an inconsistent state forever.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
async function saveToDatabase(order) {
    console.log(`[Database] Saving order ${order.id}...`);
    await delay(200);
    console.log(`[Database] Order ${order.id} saved successfully.`);
}
async function publishToMessageBroker(order) {
    console.log(`[Broker] Publishing event for order ${order.id}...`);
    await delay(100);
    throw new Error("Kafka Connection Timeout!"); // Simulate broker crash
}
async function createOrder(order) {
    console.log(`--- Creating Order ${order.id} ---`);
    try {
        await saveToDatabase(order);
        await publishToMessageBroker(order); // The Dual Write
        console.log(`--- Order ${order.id} creation complete! ---`);
    }
    catch (error) {
        console.error(`[Error] ${error.message}`);
        console.error(`[Fatal] Order ${order.id} is in the database, but the event was NEVER published! Data is permanently out of sync.`);
    }
}
async function runProblem() {
    await createOrder({ id: "ORD-123", amount: 100 });
}
runProblem();
