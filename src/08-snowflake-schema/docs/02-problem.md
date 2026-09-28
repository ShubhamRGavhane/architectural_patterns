# The Problem: Dimension Bloat & Update Anomalies

## The Anti-Pattern
Using a pure Star Schema when the dimension data contains heavy, deeply nested hierarchies, resulting in massive data duplication.

## Why it Fails
1. **Storage/Memory Bloat:** Storing "North America" 10 million times wastes disk space. More importantly, it wastes RAM when the database tries to load the dimension table into memory for a `JOIN`.
2. **Update Anomalies:** If the business decides to rename a category or a region, the database must execute an `UPDATE` statement that scans and modifies millions of rows. This can lock the table and cause downtime.

## Code Demonstration
In `problem/index.ts`, we simulate a flattened `dim_store` table. To rename a region, the code has to loop over every single store and update the string individually. At scale, this operation is devastatingly slow.
