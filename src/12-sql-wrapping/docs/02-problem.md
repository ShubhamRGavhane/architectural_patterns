# The Problem: Disabling the Index

## The Anti-Pattern
Applying a function or mathematical operation to the left side of a `WHERE` clause.
```sql
-- Anti-patterns (Non-SARGable)
SELECT * FROM users WHERE YEAR(created_at) = 2023;
SELECT * FROM products WHERE price * 0.9 < 100;
SELECT * FROM employees WHERE SUBSTRING(phone, 1, 3) = '555';
```

## Why it Fails
You have successfully turned an $O(\log N)$ operation into an $O(N)$ operation. 
If the `users` table has 100 million rows, the `YEAR(created_at) = 2023` query will force the database CPU to execute the `YEAR()` function 100 million times. This causes massive CPU spikes, evicts data from memory, and makes the query terribly slow.

## Code Demonstration
In `problem/index.ts`, we simulate this scenario on an array of 1,000,000 dates. To find the dates in 2023, the code must loop through every single element and execute `.getFullYear() === 2023`. It takes significant time.
