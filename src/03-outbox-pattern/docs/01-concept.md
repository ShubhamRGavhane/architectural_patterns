# The Outbox Pattern

## Definition
The Transactional Outbox Pattern ensures reliable message delivery in distributed systems. Instead of directly sending a message to a message broker (like Kafka or RabbitMQ) during a business transaction, the service writes the message to an "Outbox" table in the exact same database transaction. A separate process then reads the outbox table and relays the messages to the broker.

## Why it Exists
In microservices, you often need to save data (e.g., create an order) and notify other services (e.g., publish "OrderCreated"). This requires writing to two different systems (PostgreSQL and Kafka). 
Because these systems do not share a transaction coordinator, you encounter the **"Dual Write Problem"**:
- If you write to the DB first, and Kafka crashes, you lose the event.
- If you write to Kafka first, and the DB crashes, you emit an event for an order that doesn't exist.

## Real-World Use Cases
- **Order Fulfillment:** Emitting events for inventory services to deduct stock after an order is placed.
- **Cache Invalidation:** Ensuring that a cache invalidation event is reliably sent to Redis after a database record is updated.
- **Event Sourcing / CQRS:** Propagating changes from the Command database to the Read database safely.
