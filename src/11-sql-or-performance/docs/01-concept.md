# SQL OR Performance Optimization

## Definition
The `OR` operator in SQL is notoriously difficult for query optimizers to parse efficiently when evaluating multiple indexed columns. The standard optimization pattern is to rewrite the single `OR` query into two separate `SELECT` queries joined by a `UNION` or `UNION ALL`.

## Why it Exists
Database engines use B-Trees for indexes. An index allows the database to jump directly to the row you want (an Index Seek) instead of reading every row from top to bottom (a Sequential/Full Table Scan).
If you have an index on `name` and an index on `city`, and you write:
`SELECT * FROM users WHERE name = 'Alice' OR city = 'New York';`
The optimizer realizes that traversing the `name` index won't help it find the people in New York, and traversing the `city` index won't help it find the Alices. Older or less sophisticated optimizers will abandon both indexes entirely and just do a full table scan.

## Real-World Use Cases
- **Search Bars:** A user searches for "John". The query searches `first_name LIKE 'John%' OR last_name LIKE 'John%'`. This will often trigger a full table scan unless rewritten as a UNION.
