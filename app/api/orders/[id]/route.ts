import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { orders, activityLogs, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const order = await db.select()
    .from(orders)
    .where(eq(orders.id, params.id))
    .limit(1)

  if (order.length === 0) {
    return new Response('Order not found', { status: 404 })
  }

  return Response.json(order[0])
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()

  const updatedOrder = await db.update(orders)
    .set({
      status: body.status
    })
    .where(eq(orders.id, params.id))
    .returning()

  if (updatedOrder.length === 0) {
    return new Response('Order not found', { status: 404 })
  }

  const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)
  
  if (user.length > 0) {
    await db.insert(activityLogs).values({
      userId: user[0].id,
      action: `Updated order status to ${body.status}`,
      entityId: params.id,
      entityType: 'order'
    })
  }

  return Response.json(updatedOrder[0])
}