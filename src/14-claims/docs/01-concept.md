# Claims Pattern

## Definition
The Claims Pattern is a form of Optimistic Concurrency Control. It ensures that when multiple actors try to acquire the same exclusive resource concurrently, only one succeeds. It relies on the database's native atomic `UPDATE` properties using a "Check-And-Set" (CAS) operation.

## Why it Exists
In distributed systems, code execution is not linear. Two API requests can run at the exact same millisecond. If the code logic is `SELECT` -> `IF AVAILABLE` -> `UPDATE`, both requests will successfully pass the `IF` statement before either request reaches the `UPDATE` statement. This results in double-booking. 
The Claims pattern collapses the `SELECT` and `UPDATE` into a single, atomic database instruction.

## Real-World Use Cases
- **Ticketing Systems:** Ticketmaster ensuring a specific seat is only sold to one person.
- **Ridesharing:** Uber ensuring a driver is only assigned to one passenger request.
- **Job Queues:** Multiple worker nodes trying to claim a "PENDING" background job to process.
