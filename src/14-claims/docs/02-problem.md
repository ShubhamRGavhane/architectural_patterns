# The Problem: Read-Wait-Write Race Conditions

## The Anti-Pattern
Assuming that application-level `if` statements are sufficient to protect shared resources.
```javascript
const seat = await db.query("SELECT status FROM seats WHERE id = 1");
if (seat.status === 'AVAILABLE') {
    // Both Alice and Bob can reach this line simultaneously!
    await db.query("UPDATE seats SET status = 'SOLD' WHERE id = 1");
}
```

## Why it Fails
Because of CPU context switching and network latency, the time between the `SELECT` and the `UPDATE` is not instantaneous. If Alice and Bob both click "Buy" at the same time, the database will return "AVAILABLE" to both of them. 
Alice will update the seat to SOLD (Alice). A millisecond later, Bob will update the seat to SOLD (Bob), overwriting Alice. Alice was charged money but doesn't have the ticket.

## Code Demonstration
In `problem/index.ts`, we simulate Alice and Bob booking a ticket. Because of a simulated 100ms delay in "payment processing", they both read the ticket as available, resulting in a double-booking.
