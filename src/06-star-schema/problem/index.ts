/**
 * Problem: Highly Normalized Schema (OLTP) for Analytics
 * 
 * In a highly normalized (3NF) database designed for transactions, data is spread 
 * across many tables to prevent duplication. 
 * 
 * If a data analyst wants to know: "Total sales of electronics in New York in 2023",
 * they must execute a massive JOIN across 5+ tables.
 */

// Simulating an OLTP Normalized Database
const Customers = [{ id: 1, name: "Alice", city_id: 10 }];
const Cities = [{ id: 10, name: "New York", state_id: 100 }];
const States = [{ id: 100, name: "NY" }];

const Products = [{ id: 50, name: "Laptop", category_id: 5 }];
const Categories = [{ id: 5, name: "Electronics" }];

const Sales = [
    { id: 1001, customer_id: 1, product_id: 50, amount: 1200, date: "2023-11-15" }
];

function runNormalizedQuery() {
    console.log("--- RUNNING NORMALIZED OLTP QUERY (PROBLEM) ---");
    console.log("Executing: 'Total sales of electronics in New York'");
    
    // Simulating the computational cost of 5 JOINs
    const results = Sales.map(sale => {
        // JOIN 1
        const customer = Customers.find(c => c.id === sale.customer_id);
        // JOIN 2
        const city = Cities.find(c => c.id === customer?.city_id);
        // JOIN 3
        const state = States.find(s => s.id === city?.state_id);
        // JOIN 4
        const product = Products.find(p => p.id === sale.product_id);
        // JOIN 5
        const category = Categories.find(c => c.id === product?.category_id);
        
        return {
            amount: sale.amount,
            category: category?.name,
            city: city?.name
        };
    }).filter(row => row.category === "Electronics" && row.city === "New York");

    const total = results.reduce((sum, row) => sum + row.amount, 0);
    console.log(`Query Complete. Total: $${total}`);
    console.log("Drawback: 5 JOINs required. Terrible read performance at scale.");
    console.log("-----------------------------------------------");
}

runNormalizedQuery();
