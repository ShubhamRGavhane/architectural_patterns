/**
 * Problem: Unverified Lease Modification (Rogue Release)
 * 
 * Worker A acquires a lease on a job. Worker A experiences a massive GC Pause.
 * The lease expires! Worker B acquires the lease and starts processing.
 * Worker A wakes up. It decides it can't finish the job, so it sends a "RELEASE" command.
 * Because the server only checks if the job exists, Worker A accidentally 
 * deletes Worker B's lease! Worker B is now unprotected.
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const JobServer = {
    jobId: 101,
    leasedTo: null as string | null,
    
    acquire: function(worker: string) {
        this.leasedTo = worker;
        console.log(`[JobServer] Lease granted to ${worker}`);
        return true;
    },
    
    // The Flawed Release Function
    release: function(worker: string) {
        if (this.leasedTo !== null) { // Flaw: Doesn't check IF this specific instance of the lease is owned by them
            console.log(`[JobServer] ${worker} released the lease.`);
            this.leasedTo = null;
        }
    }
};

async function workerA() {
    JobServer.acquire("Worker A");
    console.log("[Worker A] GC Pause (5 seconds)...");
    
    // Meanwhile, the lock expires in the background (simulated by Worker B taking it)
    
    await delay(5000);
    console.log("[Worker A] Woke up. Releasing my lease...");
    JobServer.release("Worker A"); // Accidental Rogue Release!
}

async function workerB() {
    await delay(3000); // Waits until A's lock would have conceptually expired
    JobServer.acquire("Worker B");
    console.log("[Worker B] Safely processing job...");
    
    await delay(3000);
    if (JobServer.leasedTo !== "Worker B") {
        console.log("[Worker B] PANIC! My lease disappeared while I was working!");
    }
}

async function runOwnershipProblem() {
    console.log("--- RUNNING LEASE OWNERSHIP PROBLEM ---");
    await Promise.all([workerA(), workerB()]);
    
    console.log("\nDrawback: Worker A accidentally released Worker B's lease because the server didn't verify the specific lease instance.");
    console.log("---------------------------------------");
}

runOwnershipProblem();
