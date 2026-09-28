# Architecture Diagrams

## Problem Architecture (Monolithic File)

```mermaid
graph TD
    App[Application] --> |"DELETE FROM logs WHERE month=1"| DB[(Database)]
    DB -.-> OS[Operating System]
    
    subgraph OS[Hard Drive]
        FILE1[file: /var/lib/pgsql/data/logs.db <br/> Size: 100GB <br/> Status: Fragmented & Locked]
    end
    
    style FILE1 fill:#ff9999
```
*The database has to open the massive 100GB file, scan every byte, delete specific bytes, and shift data around. This is incredibly slow.*

## Solution Architecture (Table Partitioning)

```mermaid
graph TD
    App[Application] --> |"DROP TABLE logs_january"| DB[(Database)]
    DB -.-> OS[Operating System]
    
    subgraph OS[Hard Drive]
        FILE1[file: /var/lib/pgsql/data/logs_jan.db <br/> Status: DELETED INSTANTLY]
        FILE2[file: /var/lib/pgsql/data/logs_feb.db <br/> Status: Safe]
        FILE3[file: /var/lib/pgsql/data/logs_mar.db <br/> Status: Safe]
    end
    
    style FILE1 fill:#99ff99
```
*The application still queries a logical "logs" table, but the DB Maps it to specific files. Deleting old data just means telling the OS to delete a file.*
