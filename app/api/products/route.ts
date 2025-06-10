import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { products, users, activityLogs } from '@/lib/db/schema';
import { desc, like, or, eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const query = db
      .select()
      .from(products)
      .where(
        search
          ? or(
              like(products.name, `%${search}%`),
              like(products.sku, `%${search}%`),
              like(products.category, `%${search}%`)
            )
          : undefined
      )
      .orderBy(desc(products.id));

    const result = await query;
    return Response.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Failed to fetch products', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const newProduct = await db
      .insert(products)
      .values({
        name: body.name,
        sku: body.sku,
        category: body.category,
        price: body.price,
        stockQty: body.stockQty,
        reorderLevel: body.reorderLevel,
        status: body.status || 'Active',
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
        action: `Created new product: ${body.name}`,
        entityId: newProduct[0].id,
        entityType: 'product',
      });
    }

    return Response.json(newProduct[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response('Failed to create product', { status: 500 });
  }
}