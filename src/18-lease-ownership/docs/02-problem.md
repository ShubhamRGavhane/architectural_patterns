# The Problem: The Rogue Release

## The Anti-Pattern
Implementing a `release()` or `renew()` endpoint that only takes the Resource ID as an argument.

## Why it Fails
It assumes that the client's internal state accurately reflects the server's state. 
Worker A thinks: "I own Job 123. I will release Job 123."
The Server thinks: "Job 123 is currently owned by Worker B."
Because the API doesn't require proof of ownership, the server blindly accepts Worker A's command, resulting in the destruction of Worker B's active lease. Worker B is now operating on an unprotected resource, leading to data corruption or double-processing.

## Code Demonstration
In `problem/index.ts`, we simulate Worker A taking a GC Pause. While it is paused, Worker B takes over the job. When Worker A wakes up, it calls `JobServer.release()`. Because the `release()` function doesn't verify ownership, it sets the lease to `null`, panicking Worker B.
