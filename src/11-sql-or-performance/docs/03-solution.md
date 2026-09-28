# The Solution: The UNION ALL Rewrite

## How the Pattern Fixes the Problem
We split the query in half.
```sql
SELECT * FROM users WHERE name = 'Alice'
UNION ALL
SELECT * FROM users WHERE city = 'New York'
```
When the query optimizer evaluates the first query, it sees a simple `name = 'Alice'` predicate. It happily uses the `name` index ($O(1)$ lookup).
When it evaluates the second query, it sees a simple `city = 'New York'` predicate. It happily uses the `city` index ($O(1)$ lookup).
Finally, it concatenates the results.

What used to be an $O(N)$ full table scan is now two $O(1)$ index seeks.

## Trade-offs
- **Duplicate Rows:** If there is a user named "Alice" who *also* lives in "New York", she will appear in the result set twice! If this is unacceptable for your business logic, you must use `UNION` instead of `UNION ALL`. (Note: `UNION` requires deduplication, but 2 Index Seeks + Deduplication is often still significantly faster than 1 Full Table Scan).
- **Modern Optimizers:** Very modern versions of PostgreSQL and SQL Server have "Bitmap Index Scans" that can sometimes optimize `OR` conditions natively. However, the `UNION` rewrite is a guaranteed, database-agnostic optimization technique.

## Code Demonstration
In `solution/index.ts`, we simulate database indexes using Javascript `Map` objects. The script jumps instantly to "Alice" and instantly to "New York", returning the result in 0 milliseconds.
