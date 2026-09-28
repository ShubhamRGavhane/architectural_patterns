# The Problem: Distributed Transaction Failure

## The Anti-Pattern
The naive approach to a workflow that spans multiple microservices is to simply call them one after the other using HTTP requests or RPC calls, wrapping them in a standard `try/catch` block.

## Why it Fails
A standard `try/catch` block catches the error, but it **does not reverse the side effects** of the functions that already ran.
If you call `bookFlight()`, then `bookHotel()`, and finally `bookCar()`, and `bookCar()` throws an exception:
1. The flight is booked and paid for.
2. The hotel is booked and paid for.
3. The catch block runs, but the user is permanently stuck with a hotel and flight they don't want because the car failed.

There is no automatic rollback because the Flight Service and Hotel Service have already committed their local database transactions.

## Code Demonstration
In `problem/index.ts`, we simulate this scenario. The Flight and Hotel services succeed, but the Car service throws an error. The catch block logs the error, but the side-effects (the booked flight and hotel) are never undone. The system is left in an inconsistent state.
