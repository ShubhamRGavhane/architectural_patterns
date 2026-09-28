# The Solution: Table Partitioning

## How the Pattern Fixes the Problem
We instruct the database to use **Partitioning** (e.g., by Range on the `created_at` column).
To the application developers, there is still only one table named `logs`. They write `INSERT INTO logs...` and it works normally.
But behind the scenes, PostgreSQL creates 12 separate physical files on disk (e.g., `logs_january`, `logs_february`).

When you need to delete January's data, you don't run a `DELETE` query. You run:
`DROP TABLE logs_january;`
This bypasses row-level locking, bypasses the transaction log bloat, and tells the Operating System to just delete the physical file. It is instantaneous.

Furthermore, if you query `SELECT * FROM logs WHERE month = 'february'`, the database completely ignores 11 of the 12 files on disk. This is called **Partition Pruning**.

## Trade-offs
- **Maintenance Overhead:** You have to run cron jobs to create next month's partition *before* the month begins, otherwise inserts will fail.
- **Unique Constraint Limitations:** In most databases, you cannot enforce a Global Unique Constraint across all partitions unless the partition key is part of the Primary Key.

## Code Demonstration
In `solution/index.ts`, we simulate partitioned files using a Dictionary/Map of arrays. To delete January's data, we simply delete the reference to that specific array. It is computationally instant, regardless of how many millions of rows were in it.
