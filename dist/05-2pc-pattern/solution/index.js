"use strict";
/**
 * Solution: Two-Phase Commit (2PC)
 *
 * A Transaction Coordinator manages the commit across multiple databases.
 * Phase 1 (Prepare): Ask both databases to lock the resources and prepare to commit.
 * Phase 2 (Commit): If BOTH say yes, commit. If ANY say no, abort both.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const BankADatabase = {
    prepare: async (amount) => {
        console.log(`[Bank A] PREPARE: Locking funds ($${amount})...`);
        await delay(100);
        return true; // Bank A is ready
    },
    commit: async () => {
        console.log(`[Bank A] COMMIT: Deducting funds permanently.`);
    },
    abort: async () => {
        console.log(`[Bank A] ABORT: Unlocking funds. No changes made.`);
    }
};
const BankBDatabase = {
    prepare: async (amount) => {
        console.log(`[Bank B] PREPARE: Preparing to receive ($${amount})...`);
        await delay(100);
        return false; // Bank B simulates a disk error or lock timeout during prepare phase
    },
    commit: async () => {
        console.log(`[Bank B] COMMIT: Adding funds permanently.`);
    },
    abort: async () => {
        console.log(`[Bank B] ABORT: Rolling back transaction. No changes made.`);
    }
};
async function twoPhaseCommitCoordinator(amount) {
    console.log(`[Coordinator] Starting Two-Phase Commit for $${amount} transfer.`);
    // --- PHASE 1: PREPARE ---
    console.log(`[Coordinator] Phase 1: Sending PREPARE to all databases...`);
    const aPrepared = await BankADatabase.prepare(amount);
    const bPrepared = await BankBDatabase.prepare(amount);
    // --- PHASE 2: COMMIT OR ABORT ---
    if (aPrepared && bPrepared) {
        console.log(`[Coordinator] Phase 2: All databases prepared. Sending COMMIT.`);
        await BankADatabase.commit();
        await BankBDatabase.commit();
        console.log(`[Coordinator] Transaction successful!`);
    }
    else {
        console.log(`[Coordinator] Phase 2: A database failed to prepare. Sending ABORT to all.`);
        await BankADatabase.abort();
        await BankBDatabase.abort();
        console.log(`[Coordinator] Transaction aborted safely. No money was lost.`);
    }
}
async function runSolution() {
    console.log("--- RUNNING 2PC SOLUTION ---");
    await twoPhaseCommitCoordinator(100);
    console.log("----------------------------");
}
runSolution();
