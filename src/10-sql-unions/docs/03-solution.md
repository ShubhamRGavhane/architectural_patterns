# The Solution: Simple Concatenation

## How the Pattern Fixes the Problem
Replace `UNION` with `UNION ALL`.
```sql
SELECT id, name FROM users_us
UNION ALL
SELECT id, name FROM users_eu;
```

When the database engine sees `UNION ALL`, it skips the entire deduplication phase. It executes the first query, streams the results to the client, and immediately streams the results of the second query right behind it. 

The CPU usage drops to near-zero, and the RAM usage is negligible.

## Trade-offs
- If your data *actually* contains duplicates and the business logic strictly requires unique rows, you must use `UNION` (or `UNION ALL` wrapped in a group by/distinct, depending on the optimizer). But for disjoint datasets, `UNION ALL` is the golden rule.

## Code Demonstration
In `solution/index.ts`, we simulate `UNION ALL` by using the Javascript spread operator `[...datasetA, ...datasetB]`. It is an instant O(1) operation compared to the O(n) hashing algorithm.
