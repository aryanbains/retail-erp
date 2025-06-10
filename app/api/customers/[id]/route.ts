import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = await params

  const customer = await db.select()
    .from(customers)
    .where(eq(customers.id, id))
    .limit(1)

  if (customer.length === 0) {
    return new Response('Customer not found', { status: 404 })
  }

  return Response.json(customer[0])
}

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

  const updatedCustomer = await db.update(customers)
    .set({
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address
    })
    .where(eq(customers.id, id))
    .returning()

  if (updatedCustomer.length === 0) {
    return new Response('Customer not found', { status: 404 })
  }

  return Response.json(updatedCustomer[0])
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = await params

  const deletedCustomer = await db.delete(customers)
    .where(eq(customers.id, id))
    .returning()

  if (deletedCustomer.length === 0) {
    return new Response('Customer not found', { status: 404 })
  }

  return new Response(null, { status: 204 })
}