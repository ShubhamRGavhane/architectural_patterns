"use strict";
/**
 * Solution: The Claims Pattern (Atomic Check-and-Set)
 *
 * Instead of Read-Wait-Write, we rely on the database to perform an Atomic Claim.
 * We send an UPDATE command with a condition:
 * "Update the status to SOLD *ONLY IF* it is currently AVAILABLE."
 * The database engine's row-level lock guarantees this operation is atomic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const Database = {
    ticket: { id: 101, status: "AVAILABLE", owner: null },
    // Simulating an Atomic SQL UPDATE statement:
    // UPDATE ticket SET status = 'SOLD', owner = ? WHERE id = 101 AND status = 'AVAILABLE'
    atomicClaim: async function (user) {
        // The DB engine applies a row lock here implicitly during the UPDATE
        if (this.ticket.status === "AVAILABLE") {
            this.ticket.status = "SOLD";
            this.ticket.owner = user;
            return true; // 1 row affected
        }
        return false; // 0 rows affected
    }
};
async function bookTicket(user) {
    console.log(`[${user}] Attempting to book ticket 101...`);
    // Simulate network latency / payment processing BEFORE claiming
    await delay(Math.random() * 100);
    // The Atomic Claim
    const success = await Database.atomicClaim(user);
    if (success) {
        console.log(`[${user}] SUCCESS! Ticket purchased.`);
    }
    else {
        console.log(`[${user}] FAILED! Ticket was sold to someone else.`);
    }
}
async function runClaimsSolution() {
    console.log("--- RUNNING CLAIMS PATTERN SOLUTION ---");
    // Alice and Bob click "Buy" at the exact same millisecond
    await Promise.all([
        bookTicket("Alice"),
        bookTicket("Bob")
    ]);
    console.log("\nFinal Database State:");
    console.log(Database.ticket);
    console.log("Benefit: The atomic constraint guarantees only ONE user can claim the resource.");
    console.log("---------------------------------------");
}
runClaimsSolution();
