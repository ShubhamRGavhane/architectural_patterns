# Run Instructions

To observe how unverified lease commands can cause chaos and how ownership tokens prevent it, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (The Rogue Release)
This script simulates a worker waking up from a pause and accidentally deleting another worker's active lease.

```bash
npx ts-node src/18-lease-ownership/problem/index.ts
```

**Expected Output:**
You will see Worker A wake up and release the lease. Worker B will then panic because its lease suddenly disappeared while it was in the middle of processing the job.

## 2. Run the Solution (Token Verification)
This script simulates the same scenario, but the server issues UUID tokens upon granting the lease.

```bash
npx ts-node src/18-lease-ownership/solution/index.ts
```

**Expected Output:**
You will see Worker A wake up and attempt to release the lease, but the server explicitly rejects the command because Worker A's token doesn't match Worker B's active token. Worker B successfully finishes the job.
