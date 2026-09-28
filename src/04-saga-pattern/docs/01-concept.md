# The Saga Pattern

## Definition
The Saga Pattern is a sequence of local database transactions that together form a distributed transaction. If one of the steps in the sequence fails, the Saga executes **Compensating Transactions** to undo the impact of the preceding steps.

## Why it Exists
In a monolithic application, you can wrap multiple database operations inside a single ACID `BEGIN ... COMMIT` block. If any step fails, the database automatically rolls back everything.
In a microservices architecture, data is spread across multiple independent databases. You cannot use a single `COMMIT` or `ROLLBACK` across a PostgreSQL database, a MongoDB database, and a Stripe payment API. The Saga pattern brings the concept of "All or Nothing" to microservices.

## Real-World Use Cases
- **Travel Booking:** Booking a flight, a hotel, and a rental car. If the car is unavailable, you must cancel the flight and hotel so the user isn't charged for an incomplete trip.
- **E-Commerce:** An order requires deducting inventory, charging a credit card, and scheduling shipping. If shipping fails, you must refund the card and restock the inventory.

## Two Types of Sagas
1. **Choreography:** Services publish domain events to a broker. Other services listen and react. (No central controller).
2. **Orchestration:** A central coordinator (the Orchestrator) tells each service exactly what to do and when to roll back. (Modeled in our PoC).
