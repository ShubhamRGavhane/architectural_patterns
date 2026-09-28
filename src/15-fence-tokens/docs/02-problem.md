# The Problem: The Zombie Lock

## The Anti-Pattern
Relying solely on a Distributed Lock TTL (Time To Live) to protect a shared resource.

## Why it Fails
In a distributed system, you cannot guarantee that a process will execute within a specific time frame. 
1. Worker A gets the lock.
2. Worker A's language runtime (Java, Go, Node.js) triggers a massive "Stop-The-World" Garbage Collection pause. The process is completely frozen.
3. The Lock Server sees that Worker A hasn't responded in 10 seconds and revokes the lock.
4. Worker B gets the lock, writes to the database, and finishes.
5. Worker A's Garbage Collection finishes. It wakes up. Its code resumes *exactly where it left off*. It sends a write request to the database, overwriting Worker B's data.

## Code Demonstration
In `problem/index.ts`, we simulate Worker A getting paused for 5 seconds. The lock expires. Worker B correctly acquires the lock and writes its data. Because the database has no defense mechanism, when Worker A finally wakes up, it blindly overwrites Worker B's valid data.
