import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";
import { desc, like, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { userId } = await auth(); // Awaiting authentication
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let query;

    if (search) {
      query = db
        .select()
        .from(customers)
        .where(
          or(
            like(customers.name, `%${search}%`),
            like(customers.email, `%${search}%`),
            like(customers.phone, `%${search}%`)
          )
        )
        .orderBy(desc(customers.id));
    } else {
      // For no search filter, just select all customers
      query = db
        .select()
        .from(customers)
        .orderBy(desc(customers.id));
    }

    const result = await query;
    return Response.json(result);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response('Failed to fetch customers', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth(); // Awaiting authentication
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

    return Response.json(newCustomer[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    return new Response('Failed to create customer', { status: 500 });
  }
}