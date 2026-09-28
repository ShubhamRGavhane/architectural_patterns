"use strict";
/**
 * Solution: Eventual Consistency
 *
 * When a user signs up, the main service ONLY updates its local state and emits an event.
 * The signup succeeds instantly.
 * A background consumer (Billing Service) picks up the event and processes it eventually.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const messageBroker = new events_1.EventEmitter();
const delay = (ms) => new Promise(res => setTimeout(res, ms));
// --- THE BILLING SERVICE (Running independently) ---
messageBroker.on('UserCreated', async (eventData) => {
    const { userId } = eventData;
    console.log(`[Billing Service] Received 'UserCreated' event for user ${userId}.`);
    // Simulating retries and eventual success
    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
        attempts++;
        console.log(`[Billing Service] Attempt ${attempts} to charge user ${userId}...`);
        await delay(1000);
        if (attempts < 3) {
            console.log(`[Billing Service] Network failed. Retrying...`);
        }
        else {
            console.log(`[Billing Service] Successfully charged user ${userId}!`);
            success = true;
        }
    }
});
// --- THE USER SERVICE ---
async function userSignupEventual(userId) {
    console.log(`[User Service] Starting signup process for user ${userId}...`);
    console.log(`[User Service] Saving user ${userId} to database...`);
    await delay(500); // simulate db save
    console.log(`[User Service] User ${userId} saved.`);
    console.log(`[User Service] Emitting 'UserCreated' event...`);
    messageBroker.emit('UserCreated', { userId });
    console.log(`[User Service] Signup fully complete for ${userId}! User can start using the app immediately.`);
}
async function runSolution() {
    console.log("--- RUNNING EVENTUAL CONSISTENCY SOLUTION ---");
    await userSignupEventual("U999");
    // Wait for eventual consistency to resolve to show logs
    await delay(4000);
    console.log("-----------------------------------");
}
runSolution();
