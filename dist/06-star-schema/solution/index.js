"use strict";
/**
 * Solution: The Star Schema (OLAP)
 *
 * Data is extracted from the OLTP database, denormalized, and loaded into a Data Warehouse.
 *
 * Fact Table: fact_sales (contains the metrics/amounts and foreign keys)
 * Dimension Tables: dim_time, dim_location, dim_product (Denormalized!)
 *
 * Analytics queries now require a maximum of ONE hop (JOIN) to get any attribute.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Dimension: Location (City and State are flattened/denormalized into one table)
const dim_location = [
    { location_id: 1, city: "New York", state: "NY" }
];
// Dimension: Product (Product and Category are flattened)
const dim_product = [
    { product_id: 1, name: "Laptop", category: "Electronics" }
];
// Fact: Sales (Metrics and Foreign Keys)
const fact_sales = [
    { sale_id: 1001, location_id: 1, product_id: 1, amount: 1200, date: "2023-11-15" }
];
function runStarSchemaQuery() {
    console.log("--- RUNNING STAR SCHEMA QUERY (SOLUTION) ---");
    console.log("Executing: 'Total sales of electronics in New York'");
    // Only 2 direct lookups (1 hop each) instead of 5 chained JOINs
    const results = fact_sales.map(sale => {
        const loc = dim_location.find(l => l.location_id === sale.location_id);
        const prod = dim_product.find(p => p.product_id === sale.product_id);
        return {
            amount: sale.amount,
            category: prod?.category,
            city: loc?.city
        };
    }).filter(row => row.category === "Electronics" && row.city === "New York");
    const total = results.reduce((sum, row) => sum + row.amount, 0);
    console.log(`Query Complete. Total: $${total}`);
    console.log("Benefit: Only 2 direct JOINs. Lightning fast read performance for analytics.");
    console.log("--------------------------------------------");
}
runStarSchemaQuery();
