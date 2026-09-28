# Fencing Tokens

## Definition
A Fencing Token is a monotonically increasing number (e.g., 1, 2, 3...) issued by a Distributed Lock service (like Zookeeper or Redis) whenever a lock is granted. 
The underlying storage service (the database or file system) must be configured to only accept writes if the token provided is strictly greater than the last token it has seen.

## Why it Exists
Distributed locks (like Redlock) are inherently unsafe in asynchronous networks. 
If Worker A acquires a lock with a 10-second TTL (Time-To-Live), but then suffers a 15-second Garbage Collection pause, its lock will expire. The Lock Server will give the lock to Worker B.
When Worker A wakes up, it *still thinks it has the lock*, because it missed the expiration event! It will proceed to overwrite Worker B's data. This is known as a "Zombie Lock".
Fencing Tokens solve this by putting the ultimate verification constraint on the *storage layer*, not the compute layer.

## Real-World Use Cases
- **Distributed File Systems:** Preventing split-brain scenarios where two writers attempt to append to the same HDFS chunk.
- **Microservice Cron Jobs:** Ensuring a nightly billing job doesn't accidentally run twice if the primary node lags.
