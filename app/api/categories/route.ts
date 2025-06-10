import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const categories = await db
    .select({ category: products.category })
    .from(products)
    .groupBy(products.category)
    .orderBy(products.category)

  return Response.json(categories.map(c => c.category).filter(Boolean))
}