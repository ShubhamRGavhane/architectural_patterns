# Star Schema Pattern

## Definition
The Star Schema is an architectural pattern used in Data Warehousing and OLAP (Online Analytical Processing). It organizes data into two types of tables:
1. **Fact Tables:** Contain measurable, quantitative data (e.g., `sale_amount`, `discount_applied`) and foreign keys to dimension tables.
2. **Dimension Tables:** Contain descriptive attributes (e.g., `product_name`, `customer_city`) that give context to the facts.

When visualized, the Fact table sits in the center, radiating out to the Dimension tables, creating the shape of a star.

## Why it Exists
Transactional databases (OLTP) are heavily normalized (3NF) to ensure data integrity and fast writes. However, this normalization means data is fragmented across many tables. 
When data scientists or business intelligence tools try to run aggregate analytics (e.g., "Show me sales by region by month"), the database must perform massive, slow `JOIN` operations across dozens of tables.
The Star Schema sacrifices write speed and storage space (by denormalizing data) to achieve lightning-fast read speeds.

## Real-World Use Cases
- **Business Intelligence Dashboards:** Tableau, PowerBI, and Looker rely on Star Schemas to generate reports quickly.
- **Data Warehouses:** Amazon Redshift, Google BigQuery, and Snowflake are optimized for Star Schemas.
