# The Solution: Checkpoints & Resumability

## How the Pattern Fixes the Problem
We abandon the binary `OPEN`/`COMPLETED` state and implement a State Machine.
The job states are: `OPEN` -> `PAYMENT_DONE` -> `SHIPPED` -> `COMPLETED`.
After a worker successfully completes a step, it immediately updates the database with the new state (a Checkpoint).
The worker's code is wrapped in `if` statements that check the current state.

If Worker A crashes after payment, the database records `status = PAYMENT_DONE`.
When Worker B takes the expired lease, it reads the status. It skips the payment block entirely and moves directly to the shipping block. The job resumes exactly where it left off.

## Trade-offs
- **Database Load:** Instead of 1 read and 1 write per job, the worker must execute a database `UPDATE` after every single step to persist the checkpoint.
- **Idempotency is still better:** While state machines are great, if a worker crashes *while waiting for the HTTP response* from Stripe, the DB state will still be `OPEN`, even though Stripe processed the payment. Therefore, your API calls must still use Idempotency Keys (like Stripe's `Idempotency-Key` header) as the ultimate line of defense.

## Code Demonstration
In `solution/index.ts`, the code is structured to check the job's state before executing a step. When Worker B picks up the dirty job, it sees that it is already in the `PAYMENT_DONE` state, skips the credit card charge, and successfully finishes the pipeline.
