import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { orders, customers, activityLogs, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { userId } = await auth(); // Awaiting authentication
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const ordersWithCustomers = await db
      .select({
        id: orders.id,
        orderDate: orders.orderDate,
        status: orders.status,
        totalAmount: orders.totalAmount,
        customerId: orders.customerId,
        customerName: customers.name,
      })
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .orderBy(desc(orders.orderDate));

    return Response.json(ordersWithCustomers);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response('Failed to fetch orders', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth(); // Awaiting authentication
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const newOrder = await db
      .insert(orders)
      .values({
        customerId: body.customerId,
        totalAmount: body.totalAmount,
        status: "Pending",
      })
      .returning();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (user.length > 0) {
      await db.insert(activityLogs).values({
        userId: user[0].id,
        action: "Created new order",
        entityId: newOrder[0].id,
        entityType: "order",
      });
    }

    return Response.json(newOrder[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response('Failed to create order', { status: 500 });
  }
}