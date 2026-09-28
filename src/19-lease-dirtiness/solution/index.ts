/**
 * Solution: Checkpointing (State Machine)
 * 
 * The Job record maintains its internal state. As a worker completes a step, 
 * it immediately updates the database.
 * If a worker crashes and the lease is reassigned, the new worker reads the 
 * state and resumes exactly where the previous worker left off.
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const Database = {
    job: { 
        id: 101, 
        status: "OPEN" as "OPEN" | "PAYMENT_DONE" | "SHIPPED" | "COMPLETED", 
        leasedTo: null as string | null 
    }
};

// External systems
let chargeCount = 0;
let shipCount = 0;

async function processOrder(worker: string, willCrash: boolean) {
    Database.job.leasedTo = worker;
    console.log(`[${worker}] Acquired lease. Current State: ${Database.job.status}`);
    
    // Step 1: Charge Card (Idempotent / Resumable)
    if (Database.job.status === "OPEN") {
        console.log(`[${worker}] Step 1: Charging Credit Card...`);
        chargeCount++;
        Database.job.status = "PAYMENT_DONE"; // Checkpoint!
        await delay(100);
        
        if (willCrash) {
            console.log(`[${worker}] 💥 CRASHED! Process died.`);
            Database.job.leasedTo = null; // Simulating lease expiration
            return;
        }
    } else {
        console.log(`[${worker}] Skipping Step 1 (Already complete)`);
    }
    
    // Step 2: Ship Item
    if (Database.job.status === "PAYMENT_DONE") {
        console.log(`[${worker}] Step 2: Shipping Item...`);
        shipCount++;
        Database.job.status = "SHIPPED"; // Checkpoint!
    }
    
    Database.job.status = "COMPLETED";
    console.log(`[${worker}] Job Complete.`);
}

async function runDirtinessSolution() {
    console.log("--- RUNNING LEASE DIRTINESS SOLUTION ---");
    
    // Worker A starts the job but crashes halfway through
    await processOrder("Worker A", true);
    
    console.log("\n[System] Lease expired. Assigning job to new worker...");
    
    // Worker B picks up the abandoned job
    if (Database.job.status !== "COMPLETED") {
        await processOrder("Worker B", false);
    }
    
    console.log("\nFinal System State:");
    console.log(`Credit Card Charges: ${chargeCount} (Should be 1)`);
    console.log(`Items Shipped: ${shipCount} (Should be 1)`);
    console.log("Benefit: Worker B resumed from the 'PAYMENT_DONE' checkpoint, preventing a double charge.");
    console.log("----------------------------------------");
}

runDirtinessSolution();
