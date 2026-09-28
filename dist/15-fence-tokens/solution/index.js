"use strict";
/**
 * Solution: Fencing Tokens
 *
 * The Lock Server issues a monotonically increasing token (1, 2, 3...) when granting a lock.
 * The Database is configured to REJECT any write if the token is less than or equal to
 * the last token it successfully processed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const Database = {
    fileData: "Initial State",
    lastToken: 0,
    write: function (data, token, worker) {
        if (token > this.lastToken) {
            this.fileData = data;
            this.lastToken = token;
            console.log(`[Database] Accepted write from ${worker} (Token: ${token})`);
        }
        else {
            console.error(`[Database] REJECTED write from ${worker}. Token ${token} is stale! Last token was ${this.lastToken}.`);
        }
    }
};
const LockServer = {
    lockedBy: null,
    currentToken: 0,
    acquire: function (worker) {
        if (this.lockedBy === null) {
            this.lockedBy = worker;
            this.currentToken++; // Increment the fencing token
            const grantedToken = this.currentToken;
            console.log(`[LockServer] Lock granted to ${worker} with Token ${grantedToken}`);
            // Auto-expire lock after 3 seconds
            setTimeout(() => {
                if (this.lockedBy === worker) {
                    console.log(`[LockServer] Lock expired for ${worker}`);
                    this.lockedBy = null;
                }
            }, 3000);
            return grantedToken;
        }
        return null;
    }
};
async function workerA() {
    console.log("[Worker A] Requesting lock...");
    const token = LockServer.acquire("A");
    if (token) {
        console.log("[Worker A] Simulating massive GC Pause / Network partition (5 seconds)...");
        await delay(5000);
        console.log(`[Worker A] Woke up! Attempting to write with Token ${token}...`);
        Database.write("Written by Worker A (Zombie!)", token, "Worker A");
    }
}
async function workerB() {
    await delay(4000); // Waits until A's lock expires
    console.log("[Worker B] Requesting lock...");
    const token = LockServer.acquire("B");
    if (token) {
        console.log(`[Worker B] Processing and writing with Token ${token}...`);
        Database.write("Written by Worker B (Correct Data)", token, "Worker B");
    }
}
async function runFencingTokenSolution() {
    console.log("--- RUNNING FENCING TOKEN SOLUTION ---");
    await Promise.all([workerA(), workerB()]);
    console.log("\nFinal Database State:");
    console.log(Database.fileData);
    console.log("Benefit: The database rejected the Zombie Worker because its token was too old!");
    console.log("--------------------------------------");
}
runFencingTokenSolution();
