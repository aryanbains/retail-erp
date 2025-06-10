import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    let user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)

    if (user.length === 0) {
      const { user: clerkUser } = await auth()
      
      const newUser = await db.insert(users).values({
        clerkId: userId,
        email: 'user@example.com',
        name: 'New User',
        role: 'Employee'
      }).returning()

      return Response.json({ role: newUser[0].role })
    }

    return Response.json({ role: user[0].role })
  } catch (error) {
    console.error('Error fetching user role:', error)
    return Response.json({ role: 'Employee' })
  }
}