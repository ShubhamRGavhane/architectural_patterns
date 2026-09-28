# The Solution: Isolated Databases and APIs

## How the Pattern Fixes the Problem
Every service gets its own database. The only way for `OrderService` to get user data is to make an HTTP or gRPC call to the `UserService` API.

When `UserService` wants to rename a column in its database from `userId` to `account_id`, it is completely free to do so. It simply maps the internal `account_id` back to the public `id` field in its JSON API response. The `OrderService` never knows the database changed, and never breaks.

## Trade-offs
- **Complex Queries (JOINs):** You can no longer write a simple SQL `JOIN` across Users and Orders. You must fetch the Orders, then make a network call to fetch the Users, and join them in memory (or use CQRS/Materialized Views).
- **Data Consistency:** You can no longer use database foreign keys or ACID transactions across the two domains (which leads to the need for Sagas and Outboxes!).

## Code Demonstration
In `solution/index.ts`, `UserDatabase` and `OrderDatabase` are separate. `UserServiceAPI` acts as a translation layer. Even though the internal database was refactored, the API contract remains the same, and `OrderService` fetches the data successfully without crashing.
