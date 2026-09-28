# Architecture Diagrams

## Problem Architecture (SQL UNION)

```mermaid
graph TD
    T1[Table 1 (1M Rows)] --> |Scan| RAM[Database RAM]
    T2[Table 2 (1M Rows)] --> |Scan| RAM
    
    RAM --> |Implicit DISTINCT| CPU[CPU Hashing / Sorting]
    
    CPU --> |Drop Duplicates| Final[Result Set (2M Rows)]
    
    style CPU fill:#ff9999
    style RAM fill:#ffcccc
```
*Because of the `UNION` keyword, the database is forced to run a deduplication pass over 2 million rows, destroying performance.*

## Solution Architecture (SQL UNION ALL)

```mermaid
graph TD
    T1[Table 1 (1M Rows)] --> |Stream directly to client| Final[Result Set (2M Rows)]
    T2[Table 2 (1M Rows)] --> |Stream directly to client| Final
    
    style Final fill:#99ff99
```
*Because of the `UNION ALL` keyword, the database skips RAM hashing entirely. It just reads from disk and writes to the network socket.*
