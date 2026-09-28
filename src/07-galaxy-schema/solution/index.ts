/**
 * Solution: Galaxy Schema (Fact Constellation)
 * 
 * Multiple Fact tables (fact_sales, fact_shipping) share Conformed Dimensions (dim_date).
 * This eliminates data silos and allows SQL to join across different business processes natively.
 */

// Conformed Dimension (Shared across the whole company)
const dim_date = [
    { id: 100, date_iso: "2023-11-15", month: "November" }
];

// Fact: Sales
const fact_sales = [
    { sale_id: 1, date_id: 100, amount: 5000 }
];

// Fact: Shipping
const fact_shipping = [
    { ship_id: 1, date_id: 100, cost: 800 }
];

function runGalaxySchemaQuery() {
    console.log("--- RUNNING GALAXY SCHEMA QUERY (SOLUTION) ---");
    console.log("CEO asks: Compare Sales and Shipping Costs for '2023-11-15'");

    // 1. Get the single Conformed Dimension
    const dateRecord = dim_date.find(d => d.date_iso === "2023-11-15");

    // 2. Query BOTH fact tables using the EXACT SAME date_id
    // In SQL this would be: 
    // SELECT SUM(s.amount), SUM(sh.cost) FROM dim_date d 
    // JOIN fact_sales s ON d.id = s.date_id JOIN fact_shipping sh ON d.id = sh.date_id
    const sales = fact_sales.filter(f => f.date_id === dateRecord?.id).reduce((sum, f) => sum + f.amount, 0);
    const shipping = fact_shipping.filter(f => f.date_id === dateRecord?.id).reduce((sum, f) => sum + f.cost, 0);

    console.log(`Results: Sales: $${sales}, Shipping Cost: $${shipping}`);
    console.log("Benefit: Single source of truth for dimensions. Natively cross-query different business processes.");
    console.log("----------------------------------------------");
}

runGalaxySchemaQuery();
