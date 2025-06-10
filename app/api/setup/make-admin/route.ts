import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const clerkUser = await currentUser()
  
  try {
    let existingUser = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)

    if (existingUser.length === 0) {
      const newUser = await db.insert(users).values({
        clerkId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || 'admin@example.com',
        name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || 'Admin User',
        role: 'Admin'
      }).returning()

      return Response.json({ message: 'Created as Admin', user: newUser[0] })
    } else {
      const updatedUser = await db.update(users)
        .set({ role: 'Admin' })
        .where(eq(users.clerkId, userId))
        .returning()

      return Response.json({ message: 'Updated to Admin', user: updatedUser[0] })
    }
  } catch (error) {
    return new Response('Failed to make admin', { status: 500 })
  }
}