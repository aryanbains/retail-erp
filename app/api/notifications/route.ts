import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { notifications, users } from '@/lib/db/schema'
import { desc, eq, and } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)
  if (user.length === 0) {
    return Response.json([])
  }

  const userNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user[0].id))
    .orderBy(desc(notifications.createdAt))

  return Response.json(userNotifications)
}

export async function PUT(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { notificationIds } = await request.json()

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(...notificationIds.map((id: string) => eq(notifications.id, id))))

  return Response.json({ success: true })
}