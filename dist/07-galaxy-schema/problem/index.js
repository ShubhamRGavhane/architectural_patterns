"use strict";
/**
 * Problem: Isolated Star Schemas (Data Silos)
 *
 * The Sales Team built their own Star Schema.
 * The Shipping Team built their own Star Schema.
 * They both have a "dim_date" table, but they are isolated.
 * When the CEO asks: "Compare Total Sales to Total Shipping Costs for Nov 15th",
 * it requires querying two entirely different systems and manually merging the data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const SalesDataWarehouse = {
    fact_sales: [{ date_id: 1, amount: 5000 }],
    dim_date_sales: [{ id: 1, date_str: "2023-11-15" }]
};
const ShippingDataWarehouse = {
    fact_shipping: [{ date_id: 99, cost: 800 }],
    dim_date_shipping: [{ id: 99, date_string: "2023-11-15" }] // Different ID and column name!
};
function runIsolatedQuery() {
    console.log("--- RUNNING ISOLATED STAR SCHEMAS (PROBLEM) ---");
    console.log("CEO asks: Compare Sales and Shipping Costs for '2023-11-15'");
    // 1. Query Sales DB
    const salesDate = SalesDataWarehouse.dim_date_sales.find(d => d.date_str === "2023-11-15");
    const salesFact = SalesDataWarehouse.fact_sales.find(f => f.date_id === salesDate?.id);
    const totalSales = salesFact ? salesFact.amount : 0;
    // 2. Query Shipping DB (Notice the different column name 'date_string')
    const shipDate = ShippingDataWarehouse.dim_date_shipping.find(d => d.date_string === "2023-11-15");
    const shipFact = ShippingDataWarehouse.fact_shipping.find(f => f.date_id === shipDate?.id);
    const totalShipping = shipFact ? shipFact.cost : 0;
    console.log(`Results: Sales: $${totalSales}, Shipping Cost: $${totalShipping}`);
    console.log("Drawback: Duplicate dimension data, inconsistent naming, and requires application-level joins.");
    console.log("-----------------------------------------------");
}
runIsolatedQuery();
