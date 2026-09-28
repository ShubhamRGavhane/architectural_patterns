"use strict";
/**
 * Solution: The Inbox Pattern
 *
 * We record the IDs of incoming messages in an "Inbox" table.
 * If we receive a message ID we've already seen, we safely ignore it.
 * In a real application, the Inbox insert and the Balance update happen
 * in the exact same Database Transaction.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Mocking the Inbox table in the database
const inboxTable = new Set();
let accountBalance = 100;
async function processDepositEvent(eventId, amount) {
    console.log(`[Processor] Received event ${eventId}...`);
    // 1. Check Inbox
    if (inboxTable.has(eventId)) {
        console.log(`[Processor] Event ${eventId} already exists in the Inbox! Skipping duplicate.`);
        return; // Idempotent return
    }
    // In PostgreSQL, this would be:
    // BEGIN;
    // INSERT INTO inbox (event_id) VALUES ('evt-123'); -- Fails unique constraint if duplicate
    // UPDATE accounts SET balance = balance + 50;
    // COMMIT;
    inboxTable.add(eventId); // Mark as processed in inbox
    accountBalance += amount;
    console.log(`[Processor] Deposited $${amount}. New balance: $${accountBalance}`);
}
async function runSolution() {
    console.log("--- RUNNING INBOX SOLUTION (IDEMPOTENCY) ---");
    console.log(`Initial balance: $${accountBalance}`);
    // Broker delivers the message
    await processDepositEvent("evt-123", 50);
    // Broker retries the exact same message
    console.log("... Network glitch! Broker resends the message ...");
    await processDepositEvent("evt-123", 50);
    console.log(`Final balance: $${accountBalance}`);
    console.log("CORRECT: The balance is exactly $150! The duplicate was caught.");
    console.log("-----------------------------------------------");
}
runSolution();
