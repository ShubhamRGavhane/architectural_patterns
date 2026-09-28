# The Solution: Denormalization

## How the Pattern Fixes the Problem
We use an ETL (Extract, Transform, Load) process to pull data from the OLTP database, flatten it out, and insert it into a Data Warehouse using a Star Schema.

We collapse `City` and `State` into a single `dim_location` table.
We collapse `Product` and `Category` into a single `dim_product` table.

Now, every dimension is exactly **one hop** away from the central `fact_sales` table. The query optimizer only needs to perform a maximum of one `JOIN` per dimension, drastically reducing computational overhead.

## Trade-offs
- **Data Redundancy:** Because we denormalized `City` and `State`, the string "New York" will be repeated millions of times in the `dim_location` table. It wastes storage space (which is cheap) to buy read speed (which is expensive).
- **Data Freshness:** Data warehouses are typically updated in batches (e.g., every night at 2 AM). The data is not real-time.

## Code Demonstration
In `solution/index.ts`, we mock a Star Schema. The exact same business question ("Electronics in New York") is answered by doing only 2 direct lookups from the Fact table into the Dimension tables. The code is simpler and orders of magnitude faster.
