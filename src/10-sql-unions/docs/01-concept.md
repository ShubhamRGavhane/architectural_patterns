# UNION vs UNION ALL

## Definition
In SQL, the `UNION` operator is used to combine the result sets of two or more `SELECT` statements into a single column structure.
- `UNION` explicitly combines the result sets and then **removes duplicates** (acting like a `DISTINCT` clause).
- `UNION ALL` combines the result sets and **keeps all duplicates**, doing a simple concatenation.

## Why it Exists (The Trap)
Developers frequently use `UNION` out of habit to merge two datasets. They assume `UNION` just means "add these together". 
What they don't realize is that the database engine treats `UNION` as a command to guarantee uniqueness. To guarantee uniqueness across two datasets, the database must load the combined data into memory and perform an expensive Sort or Hash algorithm.
If the developer knows for a fact that Dataset A and Dataset B do not overlap, using `UNION` is a massive, unnecessary performance drain.

## Real-World Use Cases
- **Aggregating Sharded Tables:** If you have `sales_2023` and `sales_2024` tables, combining them for a report should use `UNION ALL` because a sale cannot exist in both years simultaneously.
- **Reporting:** Stacking "Total Revenue" row on top of "Total Expenses" row.
