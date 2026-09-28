# The Problem: Resource Starvation

## The Anti-Pattern
Issuing infinite-duration locks on shared resources, trusting the client to eventually release them.

## Why it Fails
You are coupling the availability of your server-side resources to the stability of a client's machine. 
If Alice clicks "Checkout" on a concert ticket, she locks it. If she then receives a phone call and closes her laptop, the `release_lock()` API endpoint is never called. 
The ticket sits in the database marked as `locked_by = 'Alice'`. Bob wants to buy the ticket, but he can't. The company loses the sale. The only way to fix it is for an engineer to manually edit the database.

## Code Demonstration
In `problem/index.ts`, we simulate Alice locking a ticket and then "crashing". An hour later, Bob tries to buy the ticket but is rejected. The resource is permanently deadlocked.
