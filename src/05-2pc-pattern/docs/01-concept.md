# Two-Phase Commit (2PC) Pattern

## Definition
The Two-Phase Commit (2PC) pattern is an algorithm used in distributed systems to ensure **Strong Consistency** across multiple independent databases or resource managers. A central "Transaction Coordinator" guarantees that either all databases commit their changes, or none of them do.

## Why it Exists
The Saga Pattern (Eventual Consistency) uses compensating transactions (rollbacks) to undo work when a distributed workflow fails. However, some business domains (like banking or financial trading) cannot tolerate even a brief moment where money is deducted from Account A but hasn't yet reached Account B (the "Phantom Read"). 
2PC exists to provide true ACID guarantees across multiple disparate systems at the exact same time.

## Real-World Use Cases
- **Cross-Database Financial Transfers:** Moving money from a PostgreSQL database handling domestic funds to an Oracle database handling international funds.
- **Distributed Relational Databases:** Systems like Google Spanner or CockroachDB use 2PC internally to ensure transactions across different data shards are atomic.
