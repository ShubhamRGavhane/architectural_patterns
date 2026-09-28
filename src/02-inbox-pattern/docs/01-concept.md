# The Inbox Pattern

## Definition
The Inbox Pattern is a technique used in asynchronous, event-driven distributed systems to guarantee **idempotency**. It involves storing the unique IDs of incoming messages in an "Inbox" database table. Before processing any message, the system checks if the message ID already exists in the Inbox.

## Why it Exists
Message brokers like Kafka, RabbitMQ, or AWS SQS operate on an **"At-Least-Once"** delivery guarantee. This means that if a network partition occurs right after a consumer processes a message, but before it can send the "ACK" (acknowledgement) back to the broker, the broker will assume the message failed and will send the exact same message again.

Without idempotency, processing a "Deposit $50" message twice results in the user getting $100.

## Real-World Use Cases
- **Payment Processing:** Ensuring a webhook from Stripe/PayPal isn't processed twice, which would result in double-crediting a user's account.
- **Order Fulfillment:** Ensuring the warehouse doesn't ship the same physical item twice if the message broker retries the fulfillment event.
- **Microservice Sync:** When Service A emits updates, Service B uses an inbox to prevent applying the same update twice, which could ruin analytics or aggregates.
