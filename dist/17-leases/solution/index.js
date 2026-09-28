"use strict";
/**
 * Solution: Time-Bound Leases
 *
 * The system grants a 'Lease' instead of a hard lock. The lease has an expiration time (TTL).
 * If the user does not complete the action before the lease expires, the system
 * automatically reclaims the resource.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const Database = {
    ticket: {
        id: 101,
        leasedTo: null,
        leaseExpiresAt: 0,
        status: "AVAILABLE"
    },
    acquireLease: function (user, ttlMs) {
        const now = Date.now();
        // Is it available, OR has the previous lease expired?
        if (this.ticket.leasedTo === null || now > this.ticket.leaseExpiresAt) {
            this.ticket.leasedTo = user;
            this.ticket.leaseExpiresAt = now + ttlMs;
            console.log(`[System] Lease granted to ${user}. Expires in ${ttlMs}ms.`);
            return true;
        }
        console.log(`[System] ${user} tried to buy, but active lease held by ${this.ticket.leasedTo}.`);
        return false;
    }
};
async function runLeaseSolution() {
    console.log("--- RUNNING LEASE SOLUTION ---");
    // Alice starts checkout (Gets a 2-second lease)
    Database.acquireLease("Alice", 2000);
    console.log("[Alice] Computer crashes! Disconnected.");
    // Alice never completes the transaction...
    // Bob tries to buy immediately. Fails because Alice's lease is active.
    console.log("\n[1 Second Later]");
    await delay(1000);
    Database.acquireLease("Bob", 2000);
    // Bob tries again after Alice's lease expires. Succeeds!
    console.log("\n[3 Seconds Later]");
    await delay(2000);
    Database.acquireLease("Bob", 2000);
    console.log("\nFinal Database State:");
    console.log(Database.ticket);
    console.log("Benefit: The system self-healed. Bob was able to buy the ticket after Alice's lease expired.");
    console.log("------------------------------");
}
runLeaseSolution();
