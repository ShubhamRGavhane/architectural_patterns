# The Problem: The Full Table Scan

## The Anti-Pattern
Using the `OR` keyword across two differently-indexed columns on a massive table.

## Why it Fails
A full table scan is an $O(N)$ operation. If your table has 10 million rows, the database must load all 10 million rows from the hard drive into RAM, evaluate the `IF` statement on each one, and discard the failures.
If the table is heavily used, this scan will evict other important data from the database's cache, degrading performance for the entire application (Buffer Pool Churn).

## Code Demonstration
In `problem/index.ts`, we simulate 1,000,000 users. To execute the `OR` query, the Javascript engine has to loop from `i = 0` to `i = 1000000`. It takes noticeable time, simulating the disk I/O and CPU overhead of a database Sequential Scan.
