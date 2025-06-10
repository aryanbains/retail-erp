import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { attendance, employees, users } from '@/lib/db/schema'
import { desc, eq, and, gte, lte } from 'drizzle-orm'

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const employeeId = searchParams.get('employeeId')

  let query = db
    .select({
      id: attendance.id,
      employeeId: attendance.employeeId,
      employeeName: users.name,
      date: attendance.date,
      status: attendance.status,
    })
    .from(attendance)
    .leftJoin(employees, eq(attendance.employeeId, employees.id))
    .leftJoin(users, eq(employees.userId, users.id))

  const conditions = []
  if (date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)
    conditions.push(gte(attendance.date, startOfDay))
    conditions.push(lte(attendance.date, endOfDay))
  }
  if (employeeId) {
    conditions.push(eq(attendance.employeeId, employeeId))
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions))
  }

  const result = await query.orderBy(desc(attendance.date))
  return Response.json(result)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await request.json()
  
  const newAttendance = await db.insert(attendance).values({
    employeeId: body.employeeId,
    date: new Date(body.date),
    status: body.status
  }).returning()

  return Response.json(newAttendance[0])
}