# The Solution: Inbox Table

## How the Pattern Fixes the Problem
We create a table in our database named `inbox` with a `UNIQUE` constraint on the `event_id` column.

When we process a message, we do so inside an **ACID Transaction**:
1. `BEGIN;`
2. We attempt to insert the `event_id` into the `inbox` table.
3. We execute our business logic (e.g. update the balance).
4. `COMMIT;`

If the message is a duplicate, step 2 will throw a Unique Constraint Violation error, causing the transaction to abort and preventing step 3 from executing. We catch this error, safely ignore the message, and send an "ACK" to the broker so it stops retrying.

## Trade-offs
- **Database Load:** Every single incoming message now requires an extra write to the database (to the inbox table).
- **Storage:** Over time, the inbox table will grow massive. You need a background job to prune/delete old inbox records (e.g. older than 7 days).
- **Same Database Requirement:** The `inbox` table *must* reside in the exact same database as the business tables, otherwise you can't wrap them in a single transaction.

## Code Demonstration
In `solution/index.ts`, we mock this transactional behavior using a JavaScript `Set`. When the duplicate message arrives, the processor notices the ID is already in the "Inbox" and safely exits without altering the account balance.
