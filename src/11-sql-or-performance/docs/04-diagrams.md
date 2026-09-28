# Architecture Diagrams

## Problem Architecture (The OR Scan)

```mermaid
graph TD
    Query[SELECT * WHERE name='A' OR city='B'] --> Opt[Query Optimizer]
    
    Opt --> |Confused by OR| Scan[Sequential Scan]
    
    Scan --> Row1[Row 1]
    Scan --> Row2[Row 2]
    Scan -.-> RowN[Row 1,000,000]
    
    style Scan fill:#ff9999
    style Row1 fill:#ffcccc
    style Row2 fill:#ffcccc
    style RowN fill:#ffcccc
```
*The optimizer abandons the indexes and forces the CPU to evaluate the boolean condition on every single row in the table.*

## Solution Architecture (The UNION Rewrite)

```mermaid
graph TD
    Query[SELECT * WHERE name='A' UNION ALL SELECT * WHERE city='B'] --> Opt[Query Optimizer]
    
    Opt --> |Query 1| Idx1[Index Seek: Name]
    Opt --> |Query 2| Idx2[Index Seek: City]
    
    Idx1 --> Res1[Alice]
    Idx2 --> Res2[New York]
    
    Res1 --> Final[Concatenated Result]
    Res2 --> Final
    
    style Idx1 fill:#99ff99
    style Idx2 fill:#99ff99
    style Final fill:#99ff99
```
*By splitting the query, the optimizer leverages the B-Tree indexes to instantly jump to the requested data.*
