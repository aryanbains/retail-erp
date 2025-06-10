import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const updatedUser = await db.update(users)
    .set({ role: body.role })
    .where(eq(users.id, id))
    .returning()

  return Response.json(updatedUser[0])
}