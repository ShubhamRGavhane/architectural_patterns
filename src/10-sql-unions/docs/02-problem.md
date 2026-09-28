# The Problem: The Hidden DISTINCT

## The Anti-Pattern
Using `UNION` when combining two mutually exclusive tables.
```sql
SELECT id, name FROM users_us
UNION
SELECT id, name FROM users_eu;
```

## Why it Fails (Performance)
Even though the developer knows a US user is not an EU user, the database does not know that. 
The database will execute both SELECT statements. Then, it will create a temporary hash table in RAM. It will iterate through every single US user and every single EU user, hash their ID and Name, and check if it already exists in the hash table. 
If there are 5 million US users and 5 million EU users, this hash/sort operation will cause a massive CPU spike, consume gigabytes of memory, and potentially spill over into temp disk storage, slowing the query from milliseconds to minutes.

## Code Demonstration
In `problem/index.ts`, we simulate this behavior. We have two arrays of 100,000 objects. We know their IDs don't overlap. But simulating `UNION` forces us to stringify and hash every single object to check for duplicates, resulting in terrible performance.
