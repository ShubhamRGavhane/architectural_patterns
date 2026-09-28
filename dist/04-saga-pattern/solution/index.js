"use strict";
/**
 * Solution: The Saga Pattern (Orchestration)
 *
 * We use an orchestrator to manage the distributed transaction.
 * If any step fails, the orchestrator explicitly calls a "Compensating Transaction"
 * (a rollback API) for every step that previously succeeded.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(res => setTimeout(res, ms));
// --- Microservice Implementations ---
const FlightService = {
    book: async (userId) => {
        console.log(`[Flight Service] Booking flight for ${userId}...`);
        await delay(100);
        console.log(`[Flight Service] Flight booked.`);
    },
    cancel: async (userId) => {
        console.log(`[Flight Service] COMPENSATING: Canceling flight for ${userId}... Refund issued.`);
    }
};
const HotelService = {
    book: async (userId) => {
        console.log(`[Hotel Service] Booking hotel for ${userId}...`);
        await delay(100);
        console.log(`[Hotel Service] Hotel booked.`);
    },
    cancel: async (userId) => {
        console.log(`[Hotel Service] COMPENSATING: Canceling hotel for ${userId}... Refund issued.`);
    }
};
const CarService = {
    book: async (userId) => {
        console.log(`[Car Service] Booking car for ${userId}...`);
        await delay(100);
        throw new Error("No cars available!");
    }
    // No cancel needed because booking never succeeded
};
// --- The Saga Orchestrator ---
async function bookTripSaga(userId) {
    console.log(`[Saga Orchestrator] Starting trip booking saga for ${userId}...`);
    const successfulSteps = [];
    try {
        await FlightService.book(userId);
        successfulSteps.push('flight');
        await HotelService.book(userId);
        successfulSteps.push('hotel');
        await CarService.book(userId);
        successfulSteps.push('car');
        console.log(`[Saga Orchestrator] Saga completed successfully! Trip booked.`);
    }
    catch (error) {
        console.error(`[Saga Orchestrator] Step failed: ${error.message}`);
        console.log(`[Saga Orchestrator] Initiating Saga Rollback...`);
        // Execute compensating transactions in reverse order
        for (let i = successfulSteps.length - 1; i >= 0; i--) {
            const step = successfulSteps[i];
            if (step === 'hotel')
                await HotelService.cancel(userId);
            if (step === 'flight')
                await FlightService.cancel(userId);
        }
        console.log(`[Saga Orchestrator] Rollback complete. System is in a consistent state (All or Nothing).`);
    }
}
async function runSolution() {
    console.log("--- RUNNING SAGA SOLUTION ---");
    await bookTripSaga("U-999");
    console.log("-----------------------------");
}
runSolution();
