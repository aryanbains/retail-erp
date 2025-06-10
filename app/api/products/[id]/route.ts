import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const product = await db.select()
    .from(products)
    .where(eq(products.id, params.id))
    .limit(1)

  if (product.length === 0) {
    return new Response('Product not found', { status: 404 })
  }

  return Response.json(product[0])
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

  const updatedProduct = await db.update(products)
    .set({
      name: body.name,
      sku: body.sku,
      category: body.category,
      price: body.price,
      stockQty: body.stockQty,
      reorderLevel: body.reorderLevel,
      status: body.status
    })
    .where(eq(products.id, params.id))
    .returning()

  if (updatedProduct.length === 0) {
    return new Response('Product not found', { status: 404 })
  }

  return Response.json(updatedProduct[0])
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const deletedProduct = await db.delete(products)
    .where(eq(products.id, params.id))
    .returning()

  if (deletedProduct.length === 0) {
    return new Response('Product not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}