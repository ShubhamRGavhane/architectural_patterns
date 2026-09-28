# The Problem: Synchronous Coupling

## The Anti-Pattern
When designing a distributed system or microservice architecture, a common mistake is to rely on **synchronous HTTP/gRPC calls** for core business workflows that span multiple domains.

In our PoC, we model a User Signup flow:
1. A user submits their details to the `User Service`.
2. The `User Service` saves the user to the local database.
3. The `User Service` synchronously calls the `Billing Service` to set up a subscription.

## Why it Fails
1. **Cascading Failures:** If the `Billing Service` is down, throwing a 500 error, or experiencing network latency, the `User Service` will fail. The user gets a "Signup Failed" error, even though the `User Service` itself is perfectly healthy.
2. **High Latency:** The total response time for the signup API is the sum of the time taken by the User Service *plus* the time taken by the Billing Service.
3. **Complex Rollbacks:** Because the User was saved to the database in step 2, if step 3 fails, the system must write complex logic to delete the user (rollback) to prevent phantom records.

## Code Demonstration
In `problem/index.ts`, you will see that when `billingServiceCharge()` simulates a network timeout, the entire `userSignup()` function crashes, forcing a rollback and leaving the user frustrated.
