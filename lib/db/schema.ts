import { pgTable, serial, text, timestamp, varchar, integer, boolean, decimal, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('Employee'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const employees = pgTable('employees', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  department: varchar('department', { length: 100 }),
  designation: varchar('designation', { length: 100 }),
  dateOfJoining: timestamp('date_of_joining').defaultNow(),
  attendanceStatus: varchar('attendance_status', { length: 50 }).default('Present'),
  leaveBalance: integer('leave_balance').default(21),
})

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  category: varchar('category', { length: 100 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stockQty: integer('stock_qty').notNull().default(0),
  reorderLevel: integer('reorder_level').default(10),
  status: varchar('status', { length: 50 }).default('Active'),
})

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
})

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id),
  orderDate: timestamp('order_date').defaultNow(),
  status: varchar('status', { length: 50 }).default('Pending'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
})

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  entityId: varchar('entity_id', { length: 255 }),
  entityType: varchar('entity_type', { length: 100 }),
  timestamp: timestamp('timestamp').defaultNow(),
})