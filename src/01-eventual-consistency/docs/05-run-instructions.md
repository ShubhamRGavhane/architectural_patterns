# Run Instructions

To see the difference between the synchronous failure and the asynchronous success, run the two PoC scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project and have installed dependencies:
```bash
npm install
```

## 1. Run the Problem (Synchronous)
This script demonstrates tight coupling. The billing service is simulated to be down, which causes the entire user signup process to crash and rollback.

```bash
npx ts-node src/01-eventual-consistency/problem/index.ts
```

**Expected Output:**
You will see the User Service wait, receive an error from the Billing Service, and output a rollback message.

## 2. Run the Solution (Eventual Consistency)
This script demonstrates loose coupling. The User Service emits an event and finishes instantly. The Billing Service receives the event in the background, retries through the network failures, and eventually succeeds.

```bash
npx ts-node src/01-eventual-consistency/solution/index.ts
```

**Expected Output:**
You will see the User Service finish instantly with "User can start using the app immediately." A few seconds later, you will see the Billing Service log its successful retries.
