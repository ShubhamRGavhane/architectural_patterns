# Snowflake Schema Pattern

## Definition
The Snowflake Schema is a variation of the Star Schema where the **Dimension tables are normalized**. Instead of a single, massive, flattened dimension table, the dimension data is split into multiple related tables (e.g., `dim_store` connects to `dim_city`, which connects to `dim_state`).

When visualized, the branching dimension tables make the schema look like a snowflake.

## Why it Exists
A pure Star Schema is intentionally denormalized to maximize read performance. However, this means string data is duplicated millions of times. A `dim_customer` table with 10 million users in California will store the string "California" 10 million times. 
The Snowflake schema attempts to strike a balance between the OLTP (highly normalized) and OLAP (highly denormalized) worlds by normalizing just the dimensions to save space.

## Real-World Use Cases
- **Massive Dimension Tables:** When dimension tables grow so large that they impact memory limits during query execution.
- **Hierarchical Data:** When analyzing hierarchical data (like a company's org chart or product categories) where the depth varies.
