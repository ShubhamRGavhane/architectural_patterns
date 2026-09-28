# Architecture Diagrams

## Problem Architecture (Shared Database)

```mermaid
graph TD
    Client((Client)) --> US[User Service]
    Client --> OS[Order Service]
    
    US -->|Renames Column| DB[(Shared Database)]
    OS -->|Queries Old Column| DB
    
    style DB fill:#ff9999
    style OS fill:#ff6666,stroke:#333,stroke-width:4px
    
    classDef crash fill:#ff6666,color:white;
    class OS crash
```
*Because the database is shared, the User Service broke the Order Service.*

## Solution Architecture (Database-per-Service)

```mermaid
graph TD
    Client((Client)) --> US[User Service]
    Client --> OS[Order Service]
    
    US -->|Renames Column| UDB[(User Database)]
    OS --> ODB[(Order Database)]
    
    OS -.->|HTTP API Call| US
    
    style UDB fill:#99ccff
    style ODB fill:#99ff99
```
*The databases are isolated. The Order Service communicates with the User Service via a stable HTTP API, completely unaware of internal database changes.*
