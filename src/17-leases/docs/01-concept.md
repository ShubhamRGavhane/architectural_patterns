# Leases Pattern (Time-Bound Locks)

## Definition
A Lease is a time-bound lock granted to a client for a specific resource. Unlike a hard lock which must be explicitly released by the client, a lease automatically expires after a predefined Time-To-Live (TTL). If the client needs more time, they must explicitly send a "heartbeat" or "renew" request to extend the lease before it expires.

## Why it Exists
In distributed systems (and especially over the open Internet), clients are unreliable. They lose WiFi, they close their browser tabs, or their processes crash. 
If a client acquires a permanent lock on a resource (like a seat reservation) and then vanishes, that resource is "starved" (deadlocked). It can never be allocated to anyone else.
Leases ensure that the server always maintains ultimate authority and can reclaim abandoned resources automatically without manual intervention.

## Real-World Use Cases
- **Ticketing & E-Commerce:** "These tickets are reserved for you for 10:00 minutes." If you don't check out, they go back to the public pool.
- **DHCP:** IP addresses are "leased" to laptops on a WiFi network. If the laptop leaves the cafe, the router reclaims the IP address a few hours later.
- **Leader Election:** In systems like Kubernetes or Kafka, nodes hold a lease to act as the "Leader". If the leader crashes, it stops renewing its lease, and another node takes over.
