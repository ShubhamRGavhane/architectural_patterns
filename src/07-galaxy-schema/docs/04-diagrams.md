# Architecture Diagrams

## Problem Architecture (Isolated Data Silos)

```mermaid
erDiagram
    FACT_SALES }|--|| DIM_DATE_SALES : "uses"
    FACT_SHIPPING }|--|| DIM_DATE_SHIPPING : "uses"

    FACT_SALES {
        int amount
    }
    DIM_DATE_SALES {
        string date_str
    }
    
    FACT_SHIPPING {
        int cost
    }
    DIM_DATE_SHIPPING {
        string date_string
    }
```
*Because the dimension tables are isolated, you cannot write a SQL JOIN between FACT_SALES and FACT_SHIPPING.*

## Solution Architecture (Galaxy Schema)

```mermaid
erDiagram
    FACT_SALES }|--|| DIM_DATE_CONFORMED : "uses"
    FACT_SHIPPING }|--|| DIM_DATE_CONFORMED : "uses"
    FACT_SALES }|--|| DIM_STORE_CONFORMED : "uses"
    FACT_SHIPPING }|--|| DIM_STORE_CONFORMED : "uses"

    FACT_SALES {
        int amount
    }
    FACT_SHIPPING {
        int cost
    }
    
    DIM_DATE_CONFORMED {
        int date_id
        string date_iso
    }
    DIM_STORE_CONFORMED {
        int store_id
        string location
    }
```
*Notice how the Dimensions act as bridges between the two Fact tables. A single query can now group both Sales and Shipping by Date or Store.*
