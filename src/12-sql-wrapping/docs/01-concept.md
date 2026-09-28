# SQL Wrapping (SARGable Queries)

## Definition
SARGable stands for "Search Argument Able". A query is SARGable if the database engine can use an index to execute it.
If you wrap an indexed column in a function (like `UPPER()`, `YEAR()`, `COALESCE()`, or doing math like `price * 1.2`), the query becomes **Non-SARGable**. The database cannot use the index and is forced to perform a Full Table Scan.

## Why it Exists
An index (B-Tree) stores the exact literal values written in the column, sorted alphabetically or numerically. 
If you have an index on `email`, the B-Tree has nodes like `alice@mail.com`, `bob@mail.com`.
If your query is `WHERE UPPER(email) = 'ALICE@MAIL.COM'`, the database cannot search the B-Tree for "ALICE@MAIL.COM" because the B-Tree only contains lowercase strings. The engine's only option is to read every single row in the database, apply the `UPPER()` function in real-time, and check if it matches. 

## Real-World Use Cases
- **Date Filtering:** Stop doing `WHERE YEAR(created_at) = 2023`. Do `WHERE created_at >= '2023-01-01' AND created_at < '2024-01-01'`.
- **Wildcard Searching:** `LIKE 'John%'` is SARGable (the DB can jump to the J's in the B-Tree). `LIKE '%John'` is Non-SARGable (the DB has to scan everything).
