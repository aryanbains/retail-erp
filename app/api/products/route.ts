import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { desc, like, or } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    let query;

    if (search) {
      query = db
        .select()
        .from(products)
        .where(
          or(
            like(products.name, `%${search}%`),
            like(products.sku, `%${search}%`),
            like(products.category, `%${search}%`)
          )
        )
        .orderBy(desc(products.id))
    } else {
      // For no search filter, just select all products
      query = db
        .select()
        .from(products)
        .orderBy(desc(products.id))
    }

    const result = await query

    return Response.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    return new Response('Failed to fetch products', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    
    const newProduct = await db.insert(products).values({
      name: body.name,
      sku: body.sku,
      category: body.category,
      price: body.price,
      stockQty: body.stockQty,
      reorderLevel: body.reorderLevel,
      status: body.status || 'Active'
    }).returning()

    return Response.json(newProduct[0])
  } catch (error) {
    console.error('Error creating product:', error)
    return new Response('Failed to create product', { status: 500 })
  }
}