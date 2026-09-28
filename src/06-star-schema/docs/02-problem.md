# The Problem: OLTP for Analytics

## The Anti-Pattern
Running complex analytical queries directly against a highly normalized (3rd Normal Form) transactional database.

## Why it Fails
In a normalized database, a "Product" table might link to a "Category" table, which links to a "Department" table. A "Customer" table links to a "City" table, which links to a "State" table.
To answer a simple business question like *"How many Electronics did we sell in New York?"*, the query optimizer has to stitch together 5 or 6 tables using `INNER JOIN` operations. 
If the `Sales` table has 100 million rows, joining it to 5 other tables will cause massive CPU and RAM spikes, potentially crashing the primary database and taking down the live application.

## Code Demonstration
In `problem/index.ts`, we mock an OLTP schema. To calculate the total sales for "Electronics" in "New York", the script has to manually hop across 5 different arrays (simulating `JOIN`s). At scale, this computational complexity is crippling.
