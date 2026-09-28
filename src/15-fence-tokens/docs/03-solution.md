# The Solution: The Monotonic Fence

## How the Pattern Fixes the Problem
We change the Lock Server so that every time it grants a lock, it returns an incrementing integer (the Fencing Token).
- Worker A gets Token `1`. (Pause happens)
- Lock expires.
- Worker B gets Token `2`.
- Worker B writes to the Database, passing Token `2`. The Database remembers: "The highest token I've seen is 2".
- Worker A wakes up. It attempts to write to the Database, passing Token `1`.
- The Database checks `1 > 2`. It evaluates to `false` and explicitly REJECTS Worker A's write.

The "fence" is built at the storage layer, completely neutralizing the Zombie process.

## Trade-offs
- **Storage Support Required:** The underlying storage system *must* support verifying and storing the token atomically. If you are writing to a basic file system, you can't easily implement this. You usually need an RDBMS or a consensus-backed storage system (like ZooKeeper or etcd).
- **Complexity:** You have to pass this token through every layer of your application.

## Code Demonstration
In `solution/index.ts`, the `Database` object tracks `lastToken`. When Zombie Worker A wakes up and attempts to write with Token 1, the Database rejects the write because it has already seen Token 2 from Worker B. The valid data is protected.
