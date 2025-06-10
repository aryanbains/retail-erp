import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { activityLogs, users } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const logs = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      entityId: activityLogs.entityId,
      entityType: activityLogs.entityType,
      timestamp: activityLogs.timestamp,
      userName: users.name,
      userEmail: users.email
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(50)

  return Response.json(logs)
}