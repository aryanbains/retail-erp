import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Price must be a positive number',
  }),
  stockQty: z.number().int().min(0, 'Stock quantity must be non-negative'),
  reorderLevel: z.number().int().min(0, 'Reorder level must be non-negative'),
  status: z.enum(['Active', 'Inactive', 'Out of Stock']).optional(),
})

export type ProductFormData = z.infer<typeof productSchema>