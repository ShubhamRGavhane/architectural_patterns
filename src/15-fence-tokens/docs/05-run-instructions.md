# Run Instructions

To observe how GC Pauses break distributed locks and how Fencing Tokens save them, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Zombie Lock Overwrite)
This script simulates a worker acquiring a lock but getting delayed. The lock expires, a second worker takes over, and then the first worker wakes up and corrupts the database.

```bash
npx ts-node src/15-fence-tokens/problem/index.ts
```

**Expected Output:**
You will see Worker A wake up from its 5-second pause and successfully overwrite the database, proving that TTLs on locks are not safe by themselves.

## 2. Run the Solution (Token Rejection)
This script simulates the same scenario, but the lock server issues incrementing tokens.

```bash
npx ts-node src/15-fence-tokens/solution/index.ts
```

**Expected Output:**
You will see Worker A wake up and attempt to write, but the Database explicitly rejects the write because Token 1 is stale compared to Worker B's Token 2. The valid data is preserved.
