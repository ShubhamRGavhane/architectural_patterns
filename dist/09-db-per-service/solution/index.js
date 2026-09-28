"use strict";
/**
 * Solution: Database-per-Service
 *
 * UserService and OrderService have their own isolated databases.
 * OrderService cannot query UserService's database. It must call an API.
 * When UserService refactors its internal database, it keeps its API contract
 * the same, ensuring OrderService never breaks.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Isolated Databases
const UserDatabase = {
    users_table: [{ account_id: 1, name: "Alice" }] // Refactored internally
};
const OrderDatabase = {
    orders_table: [{ id: 101, userId: 1, item: "Laptop" }]
};
// UserService hides its database behind an API
const UserServiceAPI = {
    getUserById: async (id) => {
        console.log(`[UserService API] Received request for User ID: ${id}`);
        // Maps internal 'account_id' back to the agreed-upon public contract 'id'
        const user = UserDatabase.users_table.find(u => u.account_id === id);
        if (!user)
            return null;
        return { id: user.account_id, name: user.name };
    }
};
const OrderService = {
    getOrderDetails: async (orderId) => {
        const order = OrderDatabase.orders_table.find(o => o.id === orderId);
        if (!order)
            throw new Error("Order not found");
        // Instead of querying the database directly, call the API
        const user = await UserServiceAPI.getUserById(order.userId);
        if (!user) {
            throw new Error(`CRASH: Could not find user.`);
        }
        return { order, user };
    }
};
async function runSolution() {
    console.log("--- RUNNING DATABASE PER SERVICE SOLUTION ---");
    console.log("OrderService attempts to fetch order details via API:");
    try {
        const details = await OrderService.getOrderDetails(101);
        console.log("[Success] Fetched details:");
        console.log(details);
    }
    catch (e) {
        console.error(`[Error] ${e.message}`);
    }
    console.log("---------------------------------------------");
}
runSolution();
