# Run Instructions

To see the difference between isolated Star Schemas and a unified Galaxy Schema, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Isolated Data Silos)
This script simulates trying to answer a cross-department business question when the underlying data is siloed. 

```bash
npx ts-node src/07-galaxy-schema/problem/index.ts
```

**Expected Output:**
You will see that the application code has to perform two completely different lookups using two different dimension schemas, shifting the burden of data integration onto the developer.

## 2. Run the Solution (Galaxy Schema)
This script simulates the same business question answered via Conformed Dimensions.

```bash
npx ts-node src/07-galaxy-schema/solution/index.ts
```

**Expected Output:**
You will see that the application logic is greatly simplified. It queries one dimension, and uses that shared ID to seamlessly query both fact tables.
