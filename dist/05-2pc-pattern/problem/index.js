"use strict";
/**
 * Problem: Distributed Transactions without a Coordinator
 *
 * We want to transfer $100 from Bank A to Bank B. These are two separate databases.
 * We try to deduct from A, then add to B.
 * If A succeeds but B crashes, the $100 vanishes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
async function deductFromBankA(amount) {
    console.log(`[Bank A] Deducting $${amount}...`);
    await delay(100);
    console.log(`[Bank A] Successfully deducted $${amount}.`);
}
async function addToBankB(amount) {
    console.log(`[Bank B] Adding $${amount}...`);
    await delay(100);
    throw new Error("Bank B Database Crash!");
}
async function runProblem() {
    console.log("--- RUNNING DISTRIBUTED TRANSACTION PROBLEM ---");
    try {
        await deductFromBankA(100);
        // At this point, the $100 is gone from Bank A.
        // It's floating in the void.
        await addToBankB(100); // This crashes
    }
    catch (error) {
        console.error(`[Error] ${error.message}`);
        console.error(`[Fatal] $100 was deducted from Bank A, but never added to Bank B! The money is gone!`);
    }
    console.log("-----------------------------------------------");
}
runProblem();
