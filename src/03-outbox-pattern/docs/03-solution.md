# The Solution: Transactional Outbox

## How the Pattern Fixes the Problem
We use the database itself to guarantee atomicity. 
We create an `outbox` table in our database. When an order is created, we do this:
```sql
BEGIN;
INSERT INTO orders (id, amount) VALUES (123, 100);
INSERT INTO outbox (event_type, payload) VALUES ('OrderCreated', '{"id":123}');
COMMIT;
```
Because this is a standard relational database transaction, either *both* tables get the data, or *neither* do. There is no partial success.

A separate background process (a Relay or Poller) continuously queries the `outbox` table. It reads the rows, publishes them to Kafka, and upon receiving an ACK from Kafka, it deletes the row from the `outbox` table.

## Trade-offs
- **Added Complexity:** You must build and monitor a separate background relay worker (or use a tool like Debezium / Kafka Connect).
- **At-Least-Once Delivery:** If the Relay publishes to Kafka, but crashes before deleting the row from the outbox, it will restart and publish the same message again. Therefore, the *consumer* of the message must implement the **Inbox Pattern** (Topic 02) to handle duplicates!
- **Database Load:** You are doing 2 writes to the DB for every 1 business action, doubling the write IOPS.

## Code Demonstration
In `solution/index.ts`, we mock the database transaction appending to both an `orders` array and an `outbox` array simultaneously. 
The background `outboxRelayWorker` polls the outbox. Even if the network to the broker fails (simulated randomly), the event remains safely in the outbox array and is picked up on the next polling cycle. Data is never lost.
