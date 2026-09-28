# Lease Ownership (Lease Versioning)

## Definition
Lease Ownership is the practice of attaching a unique identifier (a UUID or incrementing token) to a lease *at the moment it is granted*. 
Whenever a client wishes to extend, modify, or release the lease, they must provide that exact token. 
If the token matches, the operation succeeds. If the token does not match, it means the client's original lease expired and was given to someone else, so the operation is rejected.

## Why it Exists
This is a defense against the "Zombie Release" problem. 
If Worker A acquires a lock on a background job, but then pauses for 5 minutes, the server will auto-expire the lease and give the job to Worker B.
When Worker A wakes up, it might realize it's been asleep too long and decide to gracefully "release" the job back to the queue.
If Worker A just sends `RELEASE job_123`, the server will execute it, *accidentally deleting Worker B's lease!*
By requiring a token, we prove that the client issuing the command actually owns the *current active iteration* of the lease.

## Real-World Use Cases
- **Kubernetes Leader Election:** Nodes use resource versions. You can only step down as leader if your resource version matches the active one.
- **Background Job Processing (Sidekiq, Celery):** Ensuring that delayed workers don't accidentally acknowledge or release jobs that have been reassigned to healthy workers.
