"use strict";
/**
 * Problem: Hard Locks (Resource Starvation)
 *
 * A user wants to buy a ticket. The system locks the ticket so no one else can buy it
 * while they enter their credit card info.
 * The user's computer crashes. They never send the 'complete_purchase' or 'cancel' command.
 * The ticket remains locked forever. The company loses money.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Database = {
    ticket: { id: 101, lockedBy: null, status: "AVAILABLE" }
};
function lockTicket(user) {
    if (Database.ticket.lockedBy === null) {
        Database.ticket.lockedBy = user;
        console.log(`[System] Ticket locked by ${user}. Waiting for payment...`);
        return true;
    }
    console.log(`[System] ${user} tried to buy, but ticket is locked by ${Database.ticket.lockedBy}.`);
    return false;
}
async function runHardLockProblem() {
    console.log("--- RUNNING HARD LOCK PROBLEM ---");
    // Alice starts checkout
    lockTicket("Alice");
    console.log("[Alice] Computer crashes! Disconnected.");
    // Alice never completes the transaction...
    // 1 hour later, Bob tries to buy the ticket
    console.log("\n[1 Hour Later]");
    lockTicket("Bob");
    console.log("\nFinal Database State:");
    console.log(Database.ticket);
    console.log("Drawback: The ticket is stuck forever. Bob is blocked, and Alice is gone.");
    console.log("---------------------------------");
}
runHardLockProblem();
