import { db } from '@/lib/db'
import { notifications, users, products } from '@/lib/db/schema'
import { eq, lte } from 'drizzle-orm'

export async function checkLowStockProducts() {
  const lowStockProducts = await db
    .select()
    .from(products)
    .where(lte(products.stockQty, products.reorderLevel))

  for (const product of lowStockProducts) {
    const admins = await db
      .select()
      .from(users)
      .where(eq(users.role, 'Admin'))

    for (const admin of admins) {
      await db.insert(notifications).values({
        userId: admin.id,
        message: `Low stock alert: ${product.name} (${product.stockQty} units remaining)`,
        isRead: false
      })
    }
  }
}

export async function createOrderNotification(orderId: string, customerName: string) {
  const managers = await db
    .select()
    .from(users)
    .where(eq(users.role, 'Manager'))

  for (const manager of managers) {
    await db.insert(notifications).values({
      userId: manager.id,
      message: `New order #${orderId.slice(0, 8)} placed by ${customerName}`,
      isRead: false
    })
  }
}