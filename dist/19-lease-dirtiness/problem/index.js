"use strict";
/**
 * Problem: Lease Dirtiness (Partial Execution)
 *
 * Worker A acquires a lease to process an order (Charge Card -> Ship Item -> Send Email).
 * Worker A charges the card, but then its process crashes.
 * The lease expires. Worker B picks up the "OPEN" job.
 * Worker B starts from step 1, charging the customer's card a SECOND time.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const Database = {
    job: { id: 101, status: "OPEN", leasedTo: null }
};
// External systems
let chargeCount = 0;
let shipCount = 0;
async function processOrder(worker, willCrash) {
    Database.job.leasedTo = worker;
    console.log(`[${worker}] Acquired lease. Starting job...`);
    // Step 1: Charge Card
    console.log(`[${worker}] Step 1: Charging Credit Card...`);
    chargeCount++;
    await delay(100);
    if (willCrash) {
        console.log(`[${worker}] 💥 CRASHED! Process died.`);
        Database.job.leasedTo = null; // Simulating lease expiration
        return;
    }
    // Step 2: Ship Item
    console.log(`[${worker}] Step 2: Shipping Item...`);
    shipCount++;
    Database.job.status = "COMPLETED";
    console.log(`[${worker}] Job Complete.`);
}
async function runDirtinessProblem() {
    console.log("--- RUNNING LEASE DIRTINESS PROBLEM ---");
    // Worker A starts the job but crashes halfway through
    await processOrder("Worker A", true);
    console.log("\n[System] Lease expired. Assigning job to new worker...");
    // Worker B picks up the abandoned job
    if (Database.job.status === "OPEN") {
        await processOrder("Worker B", false);
    }
    console.log("\nFinal System State:");
    console.log(`Credit Card Charges: ${chargeCount} (Should be 1)`);
    console.log(`Items Shipped: ${shipCount} (Should be 1)`);
    console.log("Drawback: The customer was double-charged because Worker B didn't know Worker A already did Step 1!");
    console.log("---------------------------------------");
}
runDirtinessProblem();
