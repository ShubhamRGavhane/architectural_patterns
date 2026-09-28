/**
 * Problem: Distributed Transaction Failure (No Rollback)
 * 
 * We attempt to book a Flight, Hotel, and Car across three different microservices.
 * If the Car booking fails, the Flight and Hotel are already paid for.
 * Because they don't share a database, there is no automatic rollback.
 * The user is left in an inconsistent state.
 */

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function bookFlight(userId: string) {
    console.log(`[Flight Service] Booking flight for ${userId}...`);
    await delay(100);
    console.log(`[Flight Service] Flight booked successfully.`);
}

async function bookHotel(userId: string) {
    console.log(`[Hotel Service] Booking hotel for ${userId}...`);
    await delay(100);
    console.log(`[Hotel Service] Hotel booked successfully.`);
}

async function bookCar(userId: string) {
    console.log(`[Car Service] Booking car for ${userId}...`);
    await delay(100);
    throw new Error("No cars available!"); // Simulate Failure
}

async function runProblem() {
    console.log("--- RUNNING DISTRIBUTED TRANSACTION PROBLEM ---");
    const userId = "U-123";
    try {
        await bookFlight(userId);
        await bookHotel(userId);
        await bookCar(userId); // This will crash
        console.log("Trip booked successfully!");
    } catch (error: any) {
        console.error(`[Orchestrator Error] ${error.message}`);
        console.error(`[Fatal] The system crashed. The flight and hotel were booked, but the car was not. The user lost money and there was NO rollback!`);
    }
    console.log("-----------------------------------------------");
}

runProblem();
