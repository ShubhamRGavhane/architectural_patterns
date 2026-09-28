# Run Instructions

To observe how infinite locks cause resource starvation and how Leases fix it, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Hard Lock)
This script simulates a user locking a resource and then crashing, followed by another user trying to access the resource an hour later.

```bash
npx ts-node src/17-leases/problem/index.ts
```

**Expected Output:**
You will see Bob's request rejected because Alice's lock is infinite. The resource is lost forever.

## 2. Run the Solution (Time-Bound Leases)
This script simulates the same scenario, but Alice is only granted a 2-second lease.

```bash
npx ts-node src/17-leases/solution/index.ts
```

**Expected Output:**
You will see Bob's initial request fail (because the lease is active). However, his second request succeeds because Alice's 2-second lease expired, allowing the system to self-heal and reclaim the ticket.
