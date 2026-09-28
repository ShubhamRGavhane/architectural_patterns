# The Solution: Atomic Check-and-Set

## How the Pattern Fixes the Problem
We abandon the application-level `if` statement and shift the constraint directly to the database engine.
```sql
UPDATE seats 
SET status = 'SOLD', owner = 'Alice' 
WHERE id = 1 AND status = 'AVAILABLE';
```

When this query is sent, the Database Engine places an exclusive lock on Row 1. 
If Alice's query arrives first, the row is updated, and the database reports `1 row affected`.
If Bob's query arrives a microsecond later, the database checks the `WHERE` clause. Since the status is now 'SOLD', the condition fails. The database reports `0 rows affected`.

In the application code, we simply check the "rows affected" count to know if the claim was successful.

## Trade-offs
- **Coupling to DB semantics:** You are entirely reliant on your specific database supporting ACID row-level locks. Most do (Postgres, MySQL), but some NoSQL databases do not, meaning you have to use a different pattern (like Distributed Locks via Redis).

## Code Demonstration
In `solution/index.ts`, we simulate an atomic claim. Even though Alice and Bob hit the system simultaneously, the simulated row-lock guarantees that only one of them will receive a `true` success response.
