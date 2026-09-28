# The Solution: The Aggregate Lock

## How the Pattern Fixes the Problem
We add a `version` column to the `orders` table.
Before inserting a `line_item`, we must successfully update the parent `order`.

Request A and Request B both read the order (Version 1).
Request A tries to insert. It executes:
`UPDATE orders SET version = 2 WHERE id = 1 AND version = 1;`
This succeeds (1 row affected). Request A inserts the line item.

Request B tries to insert. It executes:
`UPDATE orders SET version = 2 WHERE id = 1 AND version = 1;`
This **fails** (0 rows affected) because the version is now 2. Request B throws an `OptimisticLockException` and aborts. 

By forcing all child mutations to filter through the Aggregate Root, we guarantee serialized consistency.

## Trade-offs
- **High Contention:** If multiple people are legitimately trying to add items to the same cart at the same time, many of their requests will fail and require retries. This pattern favors strict consistency over high availability/throughput.
- **Developer Discipline:** Every developer on the team must remember to bump the Aggregate Root version when modifying a child table. If one developer forgets, the invariant can be broken.

## Code Demonstration
In `solution/index.ts`, both requests attempt to lock the Aggregate Root before writing. Request A succeeds and bumps the version. Request B fails the lock acquisition and gracefully aborts, protecting the $1000 invariant.
