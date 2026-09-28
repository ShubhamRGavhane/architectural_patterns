# Physical Schema Optimization

## Definition
While Logical Schema Design (Star vs Snowflake vs 3NF) dictates how tables relate to each other, **Physical Schema Design** dictates how those tables are actually stored on the hard drive. 
Techniques include Table Partitioning (splitting one logical table into multiple physical files), Tablespaces (putting hot data on NVMe SSDs and cold data on cheap HDDs), and Clustering (sorting data on disk to match common query patterns).

## Why it Exists
When a table contains a few thousand rows, the database keeps it in RAM, and physical layout doesn't matter. When a table contains 500 million rows (e.g., audit logs, event streams, historical sales), it exceeds RAM and must be read from disk.
If the database isn't told how to organize the physical files, simple tasks like "Delete all logs from 2019" or "Find logs for yesterday" can take hours, max out IOPS, and lock the table.

## Real-World Use Cases
- **Data Retention Policies:** Partitioning tables by month allows you to instantly drop old data without affecting live traffic.
- **Cost Savings:** Moving the 2010-2020 partitions to slower, cheaper storage volumes, while keeping the 2024 partition on high-speed NVMe drives.
