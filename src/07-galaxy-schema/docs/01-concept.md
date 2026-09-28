# Galaxy Schema (Fact Constellation) Pattern

## Definition
A Galaxy Schema (also known as a Fact Constellation) is a data warehouse schema that contains **multiple fact tables** sharing **conformed dimensions**. It looks like a collection of Star Schemas connected together.

## Why it Exists
As a company grows, different departments (Sales, Marketing, HR, Shipping) build their own Star Schemas. If they build them in isolation, you end up with "Data Silos". 
For example, the Sales team creates a `dim_date` table, and the Shipping team creates their own `dim_date` table. When executive leadership wants to run cross-department analytics (e.g., "Do shipping delays impact sales in December?"), they cannot easily write a SQL query joining the two fact tables because the underlying dimension keys do not match.

A Galaxy Schema forces all business processes to share standard, enterprise-wide "Conformed Dimensions" (like a single master `dim_date` or `dim_store`), allowing seamless cross-querying.

## Real-World Use Cases
- **Enterprise Data Warehouses (EDW):** A massive central repository where all business units integrate their data.
- **Supply Chain Analytics:** Comparing `fact_manufacturing` with `fact_shipping` and `fact_returns` over the same `dim_product`.
