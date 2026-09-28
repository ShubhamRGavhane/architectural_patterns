# The Solution: The 2PC Protocol

## How the Pattern Fixes the Problem
A central **Transaction Coordinator** manages the transaction in two distinct phases:

1. **Phase 1 (Prepare phase):**
   The Coordinator sends a `PREPARE` command to all participating databases. Each database acquires the necessary locks on the rows (e.g., locking Bank A's balance) and writes the intended changes to a local transaction log. The databases reply with `YES` (I am ready and locked) or `NO` (I couldn't get the lock / I crashed).

2. **Phase 2 (Commit/Abort phase):**
   - If the Coordinator receives `YES` from *all* databases, it sends a `COMMIT` command. The databases finalize the changes and release the locks.
   - If *any* database replies `NO` (or times out), the Coordinator sends an `ABORT` (Rollback) command to all databases. The locks are released and no data is changed.

## Trade-offs
- **Blocking & Poor Performance:** During Phase 1, databases *lock* the resources. If the Coordinator crashes between Phase 1 and Phase 2, the locks are held indefinitely, freezing the databases (this is the biggest flaw of 2PC).
- **Not Highly Available:** By choosing Consistency over Availability (CAP theorem), 2PC makes the system fragile. If one database is slow, the entire global transaction is slow.

## Code Demonstration
In `solution/index.ts`, we mock a Coordinator, Bank A, and Bank B. During the Prepare phase, Bank B simulates an error and returns `false`. Because they didn't all agree, the Coordinator issues an `ABORT` to both. Bank A unlocks its funds, and no money is lost.
