/**
 * Problem: The Zombie Lock (GC Pause / Network Delay)
 * 
 * We use a Distributed Lock (e.g., Redis) to ensure only one worker processes a file.
 * Worker A acquires the lock, but then experiences a 5-second Garbage Collection pause.
 * The lock expires! 
 * Worker B acquires the lock and successfully writes to the database.
 * Worker A wakes up, thinks it still has the lock, and overwrites Worker B's data!
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const Database = {
    fileData: "Initial State"
};

const LockServer = {
    lockedBy: null as string | null,
    acquire: function(worker: string) {
        if (this.lockedBy === null) {
            this.lockedBy = worker;
            console.log(`[LockServer] Lock granted to ${worker}`);
            
            // Auto-expire lock after 3 seconds (Simulating Redis TTL)
            setTimeout(() => {
                if (this.lockedBy === worker) {
                    console.log(`[LockServer] Lock expired for ${worker}`);
                    this.lockedBy = null;
                }
            }, 3000);
            return true;
        }
        return false;
    }
};

async function workerA() {
    console.log("[Worker A] Requesting lock...");
    if (LockServer.acquire("A")) {
        console.log("[Worker A] Simulating massive GC Pause / Network partition (5 seconds)...");
        await delay(5000); 
        
        console.log("[Worker A] Woke up! Writing to database...");
        Database.fileData = "Written by Worker A (Zombie!)";
    }
}

async function workerB() {
    await delay(4000); // Waits until A's lock expires
    console.log("[Worker B] Requesting lock...");
    if (LockServer.acquire("B")) {
        console.log("[Worker B] Processing and writing to database...");
        Database.fileData = "Written by Worker B (Correct Data)";
    }
}

async function runZombieLockProblem() {
    console.log("--- RUNNING ZOMBIE LOCK PROBLEM ---");
    await Promise.all([workerA(), workerB()]);
    
    console.log("\nFinal Database State:");
    console.log(Database.fileData);
    console.log("Drawback: Worker A woke up from a pause and overwrote Worker B. The lock failed to protect the database!");
    console.log("-----------------------------------");
}

runZombieLockProblem();
