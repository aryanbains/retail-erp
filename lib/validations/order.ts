import { z } from 'zod'

export const orderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number(),
    subtotal: z.number()
  })).min(1, 'At least one item is required'),
  totalAmount: z.number().min(0)
})

export type OrderFormData = z.infer<typeof orderSchema>