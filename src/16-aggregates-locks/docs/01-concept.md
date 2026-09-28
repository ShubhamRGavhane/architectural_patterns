# Aggregate-Based Locking

## Definition
In Domain-Driven Design (DDD), an **Aggregate** is a cluster of domain objects that can be treated as a single unit. For example, an `Order` and its `LineItems`. The `Order` is the **Aggregate Root**.
Aggregate-Based Locking mandates that any time you modify a child entity (like inserting a `LineItem`), you MUST lock or increment the version of the Aggregate Root (`Order`).

## Why it Exists
Business invariants (rules) often span across multiple child entities. 
For example: "An order cannot have more than 10 line items."
If two users simultaneously try to add a line item to an order that currently has 9 items, they will both independently `INSERT` a row into the `LineItems` table. Since they are inserting new rows, they aren't conflicting on a database level. The database happily accepts both, and your order now has 11 items, violating the business rule.

By forcing both requests to lock the parent `Order` table, the database serializes the requests, guaranteeing the invariant is protected.

## Real-World Use Cases
- **E-Commerce:** Enforcing maximum order values or quantities across an entire shopping cart.
- **Banking:** Ensuring a portfolio's total exposure limits are not breached when buying individual stocks concurrently.
