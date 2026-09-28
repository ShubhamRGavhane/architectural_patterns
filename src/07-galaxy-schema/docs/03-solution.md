# The Solution: Conformed Dimensions

## How the Pattern Fixes the Problem
The Data Engineering team creates a **Conformed Dimension**. A single, universally agreed-upon table (e.g., `dim_date`).
Both the Sales ETL process and the Shipping ETL process are modified to use this exact same dimension table and store its foreign key in their respective Fact tables.

Now, an analyst can write a simple SQL query to join `fact_sales` and `fact_shipping` together using the shared `dim_date` key.

## Trade-offs
- **High Governance Overhead:** Teams cannot move fast and independently. Adding a new column to a Conformed Dimension requires approval from an architectural review board because it impacts every department.
- **Complex ETL Pipelines:** The process that generates the Conformed Dimension must run flawlessly before any of the Fact tables can be populated, creating a massive bottleneck in the nightly data load.

## Code Demonstration
In `solution/index.ts`, we define a single `dim_date` array. Both the `fact_sales` and `fact_shipping` arrays reference the exact same `date_id` (100). The query is simplified because both facts are tied to a single source of truth.
