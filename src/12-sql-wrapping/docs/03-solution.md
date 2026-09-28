# The Solution: Rewrite to be SARGable

## How the Pattern Fixes the Problem
We use algebra to move the function to the right side of the equation, leaving the indexed column "naked" on the left side.

```sql
-- SARGable Equivalents
SELECT * FROM users WHERE created_at >= '2023-01-01' AND created_at < '2024-01-01';
SELECT * FROM products WHERE price < 100 / 0.9;
SELECT * FROM employees WHERE phone LIKE '555%';
```

Now, the database can use the B-Tree index. It performs a Binary Search to instantly jump to `2023-01-01` ($O(\log N)$) and then does an Index Range Scan until it hits `2024-01-01`. It never evaluates the other 90 million rows in the database.

## Trade-offs
- **Complexity:** Writing `created_at >= X AND created_at < Y` is slightly more annoying for a developer to write than `YEAR(x) = Y`.
- **Computed Indexes:** If you absolutely MUST query by a function (e.g., `WHERE LOWER(email) = ...`), modern databases allow you to create a "Functional Index" or "Computed Column". You can literally tell Postgres `CREATE INDEX ON users (LOWER(email))`. This restores SARGability at the cost of disk space and write speed.

## Code Demonstration
In `solution/index.ts`, we simulate a B-Tree by ensuring our array is sorted. Instead of a linear scan, we use Binary Search to jump instantly to Jan 1st 2023, and stop looping the moment we hit 2024. The performance is incredibly fast.
