# The Solution: The Ownership Token

## How the Pattern Fixes the Problem
We modify the `acquire()` function to generate a random String/UUID. This token is stored in the database alongside the lease, and returned to the client.
```sql
UPDATE jobs SET leased_to = 'Worker A', token = 'abc-123' WHERE ...
```

When the client wants to release the lease, they must send `release(job_id, 'abc-123')`.
The server runs an atomic Check-and-Set:
```sql
UPDATE jobs SET leased_to = NULL, token = NULL 
WHERE id = 123 AND token = 'abc-123';
```

If Worker A tries to run this query after their lease expired and Worker B took over (with token `xyz-999`), the `WHERE` clause will fail (`abc-123 != xyz-999`). The database will return `0 rows affected`, safely ignoring the rogue command.

## Trade-offs
- **State Management:** Clients must be programmed to hold onto this token in memory for the duration of their work. If the client loses the token, they cannot release the lock early (they must wait for the TTL to expire).

## Code Demonstration
In `solution/index.ts`, the Server issues a random string token when a lease is acquired. When Zombie Worker A wakes up and tries to release the job, the server compares Worker A's old token against Worker B's active token. They do not match, so the server rejects the release, keeping Worker B safe.
