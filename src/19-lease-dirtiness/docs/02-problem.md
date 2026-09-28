# The Problem: Double Execution

## The Anti-Pattern
Treating multi-step, side-effect-heavy background jobs as a single, indivisible binary state (`OPEN` or `COMPLETED`).

## Why it Fails
You cannot rollback a credit card charge simply by rolling back a database transaction.
If Worker A successfully charges a card, the real-world side effect has happened. If Worker A then crashes, the database job remains `OPEN`. 
When the lease expires, Worker B sees an `OPEN` job and executes the code from top to bottom, resulting in the customer being charged twice.

## Code Demonstration
In `problem/index.ts`, we simulate this exact flow. Worker A charges the credit card, increments the counter, and then the process dies. Worker B takes the expired lease and runs the same code. The final `chargeCount` is 2, while the `shipCount` is 1. The customer is furious.
