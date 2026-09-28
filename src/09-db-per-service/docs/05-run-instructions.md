# Run Instructions

To see the dangers of a Shared Database, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Schema Coupling Crash)
This script simulates a scenario where one service refactors the shared database, inadvertently crashing another service.

```bash
npx ts-node src/09-db-per-service/problem/index.ts
```

**Expected Output:**
You will see the UserService succeed, but the OrderService throws a Fatal Error because it can no longer find the column it was relying on.

## 2. Run the Solution (API Contracts)
This script simulates isolated databases.

```bash
npx ts-node src/09-db-per-service/solution/index.ts
```

**Expected Output:**
You will see the OrderService successfully fetch the user data by calling the UserService API, which translates the new database schema back into the old API contract.
