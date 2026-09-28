# The Solution: Auto-Expiring Leases

## How the Pattern Fixes the Problem
Instead of a simple boolean `is_locked`, the database stores a `lease_expires_at` timestamp.
When Bob wants to buy a ticket, the system checks:
`IF leased_to IS NULL OR current_time > lease_expires_at THEN grant_lease(Bob)`

If Alice acquires a 5-minute lease and crashes, the system does nothing. Five minutes later, the lease passively expires. The next time a customer queries the ticket, the system sees the expiration timestamp is in the past, ignores Alice's claim, and grants the ticket to the new customer.
The system is self-healing.

## Trade-offs
- **Time Sync:** This relies heavily on system clocks. If server clocks drift, leases might expire too early or too late.
- **False Positives:** If Alice is just a very slow typer, her lease might expire while she's entering her credit card. When she clicks "Submit", she gets an error, which is a poor user experience.

## Code Demonstration
In `solution/index.ts`, Alice is granted a 2-second lease and crashes. Bob tries to buy it after 1 second and is rejected (the lease is respected). Bob tries again after 3 seconds and succeeds (the system self-healed and reclaimed the ticket).
