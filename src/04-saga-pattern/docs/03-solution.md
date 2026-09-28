# The Solution: Saga Orchestration & Compensating Transactions

## How the Pattern Fixes the Problem
To achieve "All or Nothing" in a distributed system, every microservice that participates in a Saga must provide two APIs:
1. **The Action:** (e.g., `POST /book`)
2. **The Compensating Action:** (e.g., `POST /cancel`)

The Saga Orchestrator keeps a log (state machine) of which steps have successfully completed. If a step fails, the Orchestrator stops moving forward. Instead, it iterates backwards through its log, calling the Compensating Action for every service that succeeded.

## Trade-offs
- **High Complexity:** You have to write "undo" logic for every single business action, which can be very complex (e.g., how do you "undo" sending an email?).
- **Lack of Isolation (ACID's 'I'):** During the Saga, the intermediate states are visible to the outside world. For a brief moment, the Flight and Hotel are actually booked and visible in the database before they get cancelled. This is called the "Phantom Read" or "Dirty Read" problem at the macro level.

## Code Demonstration
In `solution/index.ts`, we implement a simple Saga Orchestrator. When `CarService.book()` throws an error, the orchestrator catches it, sees that Flight and Hotel succeeded, and calls `HotelService.cancel()` followed by `FlightService.cancel()`. The system returns to a consistent baseline.
