/**
 * Problem: Concurrent Race Conditions (Double Booking)
 * 
 * Two users (Alice and Bob) try to book the exact same concert ticket at the exact same time.
 * Because the system reads the status, waits for payment processing, and THEN updates,
 * they both read the ticket as "AVAILABLE". 
 * Result: The system sells the same ticket twice.
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const Database = {
    ticket: { id: 101, status: "AVAILABLE", owner: null as string | null }
};

async function bookTicket(user: string) {
    console.log(`[${user}] Attempting to book ticket 101...`);
    
    // 1. Read the state
    if (Database.ticket.status === "AVAILABLE") {
        console.log(`[${user}] Ticket is AVAILABLE! Proceeding to payment...`);
        
        // 2. Simulate network latency / payment processing
        await delay(Math.random() * 100); 
        
        // 3. Write the state
        Database.ticket.status = "SOLD";
        Database.ticket.owner = user;
        console.log(`[${user}] SUCCESS! Ticket purchased.`);
    } else {
        console.log(`[${user}] FAILED! Ticket is already sold.`);
    }
}

async function runRaceCondition() {
    console.log("--- RUNNING RACE CONDITION PROBLEM ---");
    
    // Alice and Bob click "Buy" at the exact same millisecond
    await Promise.all([
        bookTicket("Alice"),
        bookTicket("Bob")
    ]);
    
    console.log("\nFinal Database State:");
    console.log(Database.ticket);
    console.log("Drawback: Both users were charged, but only one is the owner (or the record was overwritten). Double booking occurred!");
    console.log("--------------------------------------");
}

runRaceCondition();
