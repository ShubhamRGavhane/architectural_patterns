# The Problem: Phantom Inserts

## The Anti-Pattern
Checking business rules in application memory, and then executing standard `INSERT` statements on child tables without locking the parent.

## Why it Fails
When Request A and Request B arrive concurrently, they both execute `SELECT SUM(price) FROM line_items WHERE order_id = 1`. 
They both see the sum is `$0`.
Request A wants to add a `$600` item. `$600 < $1000`, so it proceeds.
Request B wants to add a `$600` item. `$600 < $1000`, so it proceeds.
Both execute `INSERT INTO line_items`. 
The database accepts both. The total is now `$1200`. The business rule is broken. This is known as a Write Skew or Phantom Insert anomaly.

## Code Demonstration
In `problem/index.ts`, we simulate this exact scenario. Because neither process touches the `orders` table, they operate in parallel on the `order_items` array. The invariant is violated and the order accepts $1200 worth of goods.
