/**
 * Solution: Lease Ownership Tokens (UUIDs)
 * 
 * Every time a lease is granted, the server generates a unique UUID for that specific grant.
 * The client MUST pass this UUID back to the server to renew or release the lease.
 * If the lease expired and someone else took it, the UUID in the DB will have changed,
 * and the rogue client's request will be safely rejected.
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const JobServer = {
    jobId: 101,
    leasedTo: null as string | null,
    leaseToken: null as string | null, // The critical ownership token
    
    acquire: function(worker: string) {
        this.leasedTo = worker;
        this.leaseToken = Math.random().toString(36).substring(7); // Generate unique token
        console.log(`[JobServer] Lease granted to ${worker} (Token: ${this.leaseToken})`);
        return this.leaseToken;
    },
    
    // The Secured Release Function
    release: function(worker: string, providedToken: string) {
        if (this.leasedTo === null) return;
        
        // Ownership Check (The CAS - Check and Set)
        if (this.leaseToken === providedToken) {
            console.log(`[JobServer] ${worker} successfully released the lease.`);
            this.leasedTo = null;
            this.leaseToken = null;
        } else {
            console.error(`[JobServer] REJECTED release from ${worker}. Provided token [${providedToken}] does not match active token [${this.leaseToken}].`);
        }
    }
};

async function workerA() {
    const myToken = JobServer.acquire("Worker A");
    console.log("[Worker A] GC Pause (5 seconds)...");
    
    // Meanwhile, the lock expires in the background (simulated by B taking it)
    
    await delay(5000);
    console.log("[Worker A] Woke up. Releasing my lease...");
    JobServer.release("Worker A", myToken!); // Safely rejected!
}

async function workerB() {
    await delay(3000); // Waits until A's lock would have expired
    const myToken = JobServer.acquire("Worker B");
    console.log("[Worker B] Safely processing job...");
    
    await delay(3000);
    if (JobServer.leaseToken === myToken) {
        console.log("[Worker B] SUCCESS! My lease is still active and protected.");
    }
}

async function runOwnershipSolution() {
    console.log("--- RUNNING LEASE OWNERSHIP SOLUTION ---");
    await Promise.all([workerA(), workerB()]);
    
    console.log("\nBenefit: The unique Ownership Token prevented Worker A from deleting Worker B's lease.");
    console.log("----------------------------------------");
}

runOwnershipSolution();
