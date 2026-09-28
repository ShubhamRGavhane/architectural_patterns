# Architecture Diagrams

## Problem Architecture (Star Schema Bloat)

```mermaid
erDiagram
    FACT_SALES }|--|| DIM_STORE : "occurred at"

    DIM_STORE {
        int store_id
        string name
        string city
        string state
        string country
        string region
    }
```
*In a Star Schema, `DIM_STORE` is flattened. Modifying a region requires updating every single store row in that region.*

## Solution Architecture (Snowflake Schema)

```mermaid
erDiagram
    FACT_SALES }|--|| DIM_STORE : "occurred at"
    DIM_STORE }|--|| DIM_CITY : "located in"
    DIM_CITY }|--|| DIM_STATE : "in state"
    DIM_STATE }|--|| DIM_COUNTRY : "in country"
    DIM_COUNTRY }|--|| DIM_REGION : "in region"

    DIM_STORE {
        int store_id
        string name
        int city_id
    }
    DIM_CITY {
        int city_id
        string name
        int state_id
    }
    DIM_REGION {
        int region_id
        string name
    }
```
*In a Snowflake Schema, the dimension branches out. Modifying a region requires updating exactly one row in `DIM_REGION`.*
