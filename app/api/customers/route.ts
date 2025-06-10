import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { customers, users, activityLogs } from "@/lib/db/schema";
import { desc, like, or, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const query = db
      .select()
      .from(customers)
      .where(
        search
          ? or(
              like(customers.name, `%${search}%`),
              like(customers.email, `%${search}%`),
              like(customers.phone, `%${search}%`)
            )
          : undefined
      )
      .orderBy(desc(customers.id));

    const result = await query;
    return Response.json(result);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new Response("Failed to fetch customers", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await request.json();

    const newCustomer = await db
      .insert(customers)
      .values({
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
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
        action: `Added new customer: ${body.name}`,
        entityId: newCustomer[0].id,
        entityType: "customer",
      });
    }

    return Response.json(newCustomer[0]);
  } catch (error) {
    console.error("Error creating customer:", error);
    return new Response("Failed to create customer", { status: 500 });
  }
}