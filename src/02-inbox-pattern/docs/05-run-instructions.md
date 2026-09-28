# Run Instructions

To see the difference between non-idempotent code and idempotent code using the Inbox pattern, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Data Corruption)
This script simulates a network broker delivering the exact same "Deposit $50" message twice. The naive code processes both.

```bash
npx ts-node src/02-inbox-pattern/problem/index.ts
```

**Expected Output:**
You will see the final balance end up at $200 instead of $150 because the duplicate was not caught.

## 2. Run the Solution (Inbox Pattern)
This script also simulates a broker delivering a duplicate message. However, the Inbox catches the duplicate ID and ignores it.

```bash
npx ts-node src/02-inbox-pattern/solution/index.ts
```

**Expected Output:**
You will see the duplicate message being logged as "skipped" and the final balance will correctly remain at $150.
