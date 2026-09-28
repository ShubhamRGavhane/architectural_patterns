# The Problem: The Distributed Monolith

## The Anti-Pattern
Two or more services connecting to the exact same database instance and querying the same tables.

## Why it Fails
1. **Schema Coupling:** If Service A renames a column, drops a table, or changes a data type, Service B will crash on its next query.
2. **Hidden Dependencies:** It becomes impossible to know who is reading what. You cannot safely refactor your database without organizing a massive synchronized deployment across multiple teams.
3. **Resource Contention:** A bad query in Service A can lock a table, causing Service B to timeout and crash.

## Code Demonstration
In `problem/index.ts`, we simulate `UserService` and `OrderService` sharing a database. `UserService` decides to rename `userId` to `account_id`. They deploy their code and it works perfectly. However, `OrderService` crashes immediately because it was secretly querying the user table and expecting the old column name.
