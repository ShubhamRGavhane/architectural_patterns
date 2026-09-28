/**
 * Problem: Lack of Idempotency (Processing Duplicates)
 * 
 * In distributed systems, message brokers guarantee "At-Least-Once" delivery.
 * This means a network retry could cause the same message to be delivered twice.
 * Without the Inbox pattern, we process the same message twice, corrupting data.
 */

let accountBalance = 100;

async function processDepositEvent(eventId: string, amount: number) {
    console.log(`[Processor] Processing event ${eventId}...`);
    accountBalance += amount;
    console.log(`[Processor] Deposited $${amount}. New balance: $${accountBalance}`);
}

async function runProblem() {
    console.log("--- RUNNING INBOX PROBLEM (NO IDEMPOTENCY) ---");
    console.log(`Initial balance: $${accountBalance}`);
    
    // Broker delivers the message
    await processDepositEvent("evt-123", 50);
    
    // Broker thinks the first delivery failed, so it retries the exact same message!
    console.log("... Network glitch! Broker resends the message ...");
    await processDepositEvent("evt-123", 50);
    
    console.log(`Final balance: $${accountBalance}`);
    console.log("ERROR: The balance is $200, but it should be $150! The user got double money.");
    console.log("-----------------------------------------------");
}

runProblem();
