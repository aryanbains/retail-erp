import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { generateMockProducts } from '@/lib/mock-data'

export async function POST() {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const mockProducts = generateMockProducts()
    
    for (const product of mockProducts) {
      await db.insert(products).values(product)
    }

    return Response.json({ 
      message: 'Products seeded successfully', 
      count: mockProducts.length 
    })
  } catch (error) {
    return new Response('Failed to seed products', { status: 500 })
  }
}