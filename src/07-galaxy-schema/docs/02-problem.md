# The Problem: Data Silos

## The Anti-Pattern
Allowing independent teams to build their own isolated Star Schemas without standardizing the dimensions across the company.

## Why it Fails
When a Data Analyst tries to run a cross-department report, they realize that the Sales DB uses a dimension called `dim_date_sales` (where the date is stored as a string "YYYY-MM-DD") and the Shipping DB uses `dim_date_shipping` (where the date is stored as a Unix timestamp). 

Because the Dimension tables are different, the Fact tables cannot be joined via SQL. The analyst has to query both databases separately, dump the results into Python or Excel, manually clean the data, and merge it together. This is highly inefficient and error-prone.

## Code Demonstration
In `problem/index.ts`, we simulate two entirely separate data warehouses for Sales and Shipping. To compare them for a specific date, the code must query both independently, map the different naming conventions (`date_str` vs `date_string`), and then merge the results manually in memory.
