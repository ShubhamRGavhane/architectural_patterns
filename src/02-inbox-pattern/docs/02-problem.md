# The Problem: Lack of Idempotency

## The Anti-Pattern
When consuming messages from a queue, the naive approach is to simply receive the event, parse the JSON, and update the database directly.

## Why it Fails
Because message brokers guarantee **At-Least-Once** delivery, they will occasionally deliver duplicate messages. 
If your code is not *idempotent* (meaning it can be applied multiple times without changing the result beyond the initial application), you will corrupt your database. 

A common example is an `UPDATE account SET balance = balance + 50` query. Running this twice changes the state incorrectly.

## Code Demonstration
In `problem/index.ts`, we simulate a broker delivering a deposit event (`evt-123`). Then, we simulate a network glitch causing the broker to resend the exact same event. The naive processor processes both, resulting in an incorrect final balance.
