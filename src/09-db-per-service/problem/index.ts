/**
 * Problem: The Shared Database (Distributed Monolith)
 * 
 * UserService and OrderService share the exact same database schema.
 * UserService decides to refactor their data model, renaming 'userId' to 'account_id'.
 * They deploy their change. Suddenly, OrderService crashes because it was secretly 
 * relying on the 'userId' column in the shared database.
 */

const SharedDatabase = {
    users_table: [{ account_id: 1, name: "Alice" }], // Renamed by UserService!
    orders_table: [{ id: 101, userId: 1, item: "Laptop" }]
};

const UserService = {
    getUser: (id: number) => {
        // UserService updated its code to use 'account_id'
        return SharedDatabase.users_table.find(u => u.account_id === id);
    }
};

const OrderService = {
    getOrderDetails: (orderId: number) => {
        const order = SharedDatabase.orders_table.find(o => o.id === orderId);
        if (!order) throw new Error("Order not found");
        
        // OrderService was NOT updated. It still expects 'userId' to exist on the user table!
        // But UserService renamed it!
        // @ts-ignore
        const user = SharedDatabase.users_table.find(u => u.userId === order.userId);
        
        if (!user) {
            throw new Error(`CRASH: Could not find user for order ${orderId}. Shared Database schema changed!`);
        }
        return { order, user };
    }
};

function runProblem() {
    console.log("--- RUNNING SHARED DATABASE PROBLEM ---");
    console.log("UserService successfully fetches user:");
    console.log(UserService.getUser(1));

    console.log("\nOrderService attempts to fetch order details:");
    try {
        OrderService.getOrderDetails(101);
    } catch (e: any) {
        console.error(`[Fatal Error] ${e.message}`);
    }
    console.log("---------------------------------------");
}
runProblem();
