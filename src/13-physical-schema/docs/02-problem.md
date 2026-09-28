# The Problem: The Monolithic Table

## The Anti-Pattern
Treating a continuously growing dataset (like Logs, Time-Series Data, or Events) as a standard logical table without applying partitioning or indexing strategies tailored to time.

## Why it Fails
When you execute `DELETE FROM logs WHERE created_at < '2023-01-01'`, the database has to:
1. Scan the entire table to find matching rows.
2. Delete them one by one.
3. Write every single deletion to the transaction log (WAL) in case of a crash.
4. Leave behind "dead tuples" (holes in the file), causing fragmentation.

On a 500 million row table, this operation can literally take hours. It consumes massive CPU/Disk resources, often locking rows or the entire table, preventing the live application from inserting new logs!

## Code Demonstration
In `problem/index.ts`, we simulate a monolithic table with hundreds of thousands of rows. When we simulate a "DELETE", the code has to loop over the array, using `splice()` to remove rows one by one. This is computationally expensive and slow.
