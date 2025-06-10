import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { generateMockCustomers } from '@/lib/mock-data'

export async function POST() {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const mockCustomers = generateMockCustomers()
    
    for (const customer of mockCustomers) {
      await db.insert(customers).values(customer)
    }

    return Response.json({ 
      message: 'Customers seeded successfully', 
      count: mockCustomers.length 
    })
  } catch (error) {
    return new Response('Failed to seed customers', { status: 500 })
  }
}