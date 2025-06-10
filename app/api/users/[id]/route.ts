import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()

  const updatedUser = await db.update(users)
    .set({ role: body.role })
    .where(eq(users.id, params.id))
    .returning()

  return Response.json(updatedUser[0])
}