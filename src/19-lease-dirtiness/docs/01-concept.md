# Lease Dirtiness (State Machines)

## Definition
Lease Dirtiness (or "Partial Execution") occurs when a worker acquires a lease, completes half of a multi-step job, and then crashes. When the lease expires and the job is reassigned to a new worker, the new worker inherits a "dirty" resource. 
To solve this, complex jobs must be modeled as a State Machine with Checkpoints.

## Why it Exists
Leases guarantee that *eventually* a job will be processed by someone. But they do not guarantee *Atomicity* across external API calls.
If a worker has to:
1. Charge a credit card via Stripe API
2. Send an email via SendGrid API
3. Mark job complete in the DB.

If the worker crashes between steps 1 and 2, Stripe has the money, but the Database thinks the job is "OPEN". When Worker B takes the lease, it will charge the card a second time!

## Real-World Use Cases
- **Payment Processing:** Order fulfillment pipelines.
- **Video Transcoding:** If a worker converts 10 minutes of a 20-minute video and crashes, the next worker shouldn't have to start from minute 0. They should resume from the 10-minute checkpoint.
