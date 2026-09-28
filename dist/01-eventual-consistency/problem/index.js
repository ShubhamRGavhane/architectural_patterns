"use strict";
/**
 * Problem: Synchronous Distributed Call
 *
 * When a user signs up, the main service calls the billing service SYNCHRONOUSLY.
 * If the billing service is down or slow, the entire user signup fails.
 * This is tight coupling.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
async function billingServiceCharge(userId) {
    console.log(`[Billing Service] Attempting to charge user ${userId}...`);
    // Simulate a failure in the billing service (e.g. timeout, network issue)
    await delay(1000);
    throw new Error("Billing Service is currently unavailable (Network Timeout).");
}
async function userSignup(userId) {
    console.log(`[User Service] Starting signup process for user ${userId}...`);
    console.log(`[User Service] Saving user ${userId} to database...`);
    // Database save succeeds
    console.log(`[User Service] User ${userId} saved.`);
    console.log(`[User Service] Calling Billing Service synchronously...`);
    try {
        await billingServiceCharge(userId);
        console.log(`[User Service] Signup fully complete for ${userId}!`);
    }
    catch (error) {
        console.error(`[User Service] ERROR: ${error.message}`);
        console.error(`[User Service] Signup failed for ${userId}. Rolling back user creation...`);
        // Rollback
        console.log(`[User Service] User ${userId} removed from database.`);
    }
}
async function runProblem() {
    console.log("--- RUNNING SYNCHRONOUS PROBLEM ---");
    await userSignup("U123");
    console.log("-----------------------------------");
}
runProblem();
