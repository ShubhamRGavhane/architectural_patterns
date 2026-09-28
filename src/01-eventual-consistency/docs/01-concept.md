# Eventual Consistency Pattern

## Definition
Eventual Consistency is a theoretical guarantee that, provided no new updates are made to a given entity, all reads of that entity will eventually return the last updated value. In distributed systems, it is a pattern used to achieve high availability and low latency by allowing data in different services or databases to be temporarily out of sync, as long as they synchronize "eventually."

## Why it Exists
According to the CAP theorem, a distributed data store can only provide two of the following three guarantees:
1. **Consistency:** Every read receives the most recent write or an error.
2. **Availability:** Every request receives a (non-error) response, without the guarantee that it contains the most recent write.
3. **Partition Tolerance:** The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network.

Since network partitions (P) are unavoidable in distributed systems, architects must choose between strong Consistency (C) and Availability (A). Eventual Consistency chooses **Availability**.

## Real-World Use Cases
- **Social Media Feeds:** If you post a tweet, it is immediately visible to you, but it might take a few seconds to propagate to the timelines of millions of followers.
- **E-Commerce Inventory:** Showing a cached "In Stock" status for a product on the search page, even if the actual inventory is being depleted in the background.
- **Microservice Architectures:** Whenever Service A needs to trigger an action in Service B (like sending a welcome email after signup), doing it asynchronously via eventual consistency prevents Service B's downtime from breaking Service A.
