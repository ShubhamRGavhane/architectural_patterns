# The Solution: Normalizing Dimensions

## How the Pattern Fixes the Problem
We split the flattened dimension into a hierarchy of tables. 
Instead of `dim_store` containing `city`, `state`, and `country` strings, it simply contains a `city_id`. The string data is stored exactly once in its respective lookup table.

If the business renames a region, the database executes an `UPDATE` on exactly **one row** in the `dim_region` table. The change is instantly reflected across all 10 million stores that reference it.

## Trade-offs
- **Complex Queries:** Analysts can no longer just `JOIN fact_sales` to `dim_store` to get the region name. They must `JOIN fact_sales` to `dim_store` to `dim_city` to `dim_state` to `dim_region`.
- **Slower Reads:** The query optimizer has to perform more hops. A Snowflake Schema is slower to query than a Star Schema, but faster than a fully normalized OLTP database.

## Code Demonstration
In `solution/index.ts`, we simulate snowflaking the store dimension. The total size of the arrays is drastically smaller. When the region is renamed, only a single object in the `dim_region` array is modified.
