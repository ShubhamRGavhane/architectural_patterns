# Architecture Diagrams

## Problem Architecture (Highly Normalized OLTP)

```mermaid
erDiagram
    SALES }|--|| CUSTOMER : "purchased by"
    CUSTOMER }|--|| CITY : "lives in"
    CITY }|--|| STATE : "located in"
    SALES }|--|| PRODUCT : "includes"
    PRODUCT }|--|| CATEGORY : "belongs to"

    SALES {
        int id
        int customer_id
        int product_id
        float amount
    }
```
*Notice how deep the tree goes. A query requires traversing 5 different tables.*

## Solution Architecture (Star Schema OLAP)

```mermaid
erDiagram
    FACT_SALES }|--|| DIM_LOCATION : "occurred at"
    FACT_SALES }|--|| DIM_PRODUCT : "includes"
    FACT_SALES }|--|| DIM_TIME : "occurred on"

    FACT_SALES {
        int sale_id
        int location_id
        int product_id
        int time_id
        float amount
    }
    
    DIM_LOCATION {
        int location_id
        string city
        string state
    }
    
    DIM_PRODUCT {
        int product_id
        string name
        string category
    }
```
*Notice the star shape. The central FACT table is exactly one hop away from any descriptive DIMENSION.*
