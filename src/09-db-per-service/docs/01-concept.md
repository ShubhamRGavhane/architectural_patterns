# Database-per-Service Pattern

## Definition
The Database-per-Service pattern mandates that each microservice manages its own domain data independently. The database is effectively treated as part of the microservice's internal implementation details. No other service is allowed to connect to or query that database directly.

## Why it Exists
Microservices promise independent deployability and loose coupling. However, if two services share the same database (a "Shared Database" or "Distributed Monolith"), they become tightly coupled at the data layer. A schema change made by one team can instantly break the application of another team. Database-per-Service forces teams to communicate via well-defined APIs rather than backdoor database queries.

## Real-World Use Cases
- **Polyglot Persistence:** An Order Service might use PostgreSQL for relational transactions, while a Product Search Service uses Elasticsearch, and a Shopping Cart Service uses Redis. By isolating databases, each service can choose the best tool for the job.
- **Independent Scaling:** If the Analytics service gets hammered with read queries, it won't consume the CPU/RAM of the primary Transaction database.
