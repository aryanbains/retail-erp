import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { employees, users, activityLogs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const employeesWithUsers = await db
    .select({
      id: employees.id,
      name: users.name,
      email: users.email,
      department: employees.department,
      designation: employees.designation,
      dateOfJoining: employees.dateOfJoining,
      attendanceStatus: employees.attendanceStatus,
      leaveBalance: employees.leaveBalance,
      userId: employees.userId,
    })
    .from(employees)
    .leftJoin(users, eq(employees.userId, users.id))
    .orderBy(desc(employees.dateOfJoining));

  return Response.json(employeesWithUsers);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();

  const newEmployee = await db
    .insert(employees)
    .values({
      userId: body.userId,
      department: body.department,
      designation: body.designation,
      dateOfJoining: body.dateOfJoining || new Date(),
      attendanceStatus: body.attendanceStatus || 'Present',
      leaveBalance: body.leaveBalance || 21,
    })
    .returning();

  const currentUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (currentUser.length > 0) {
    await db.insert(activityLogs).values({
      userId: currentUser[0].id,
      action: `Added new employee to ${body.department} department`,
      entityId: newEmployee[0].id,
      entityType: 'employee',
    });
  }

  return Response.json(newEmployee[0]);
}