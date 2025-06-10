"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Plus } from 'lucide-react'
import { orderSchema, OrderFormData } from '@/lib/validations/order'
import { useToast } from '@/components/ui/use-toast'

// Define types for your data structures
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: string | number
  stockQty: number
  reorderLevel: number
  status: string
}

interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

interface OrderFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: OrderFormData) => void
}

export default function OrderFormModal({ open, onClose, onSubmit }: OrderFormModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: '',
      items: [],
      totalAmount: 0
    }
  })

  useEffect(() => {
    if (open) {
      fetchCustomers()
      fetchProducts()
    }
  }, [open])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const addItem = () => {
    setSelectedItems([...selectedItems, {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0
    }])
  }

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...selectedItems]
    
    switch (field) {
      case 'productId':
        const product = products.find((p) => p.id === value)
        if (product) {
          updated[index].productId = value as string
          updated[index].productName = product.name
          updated[index].unitPrice = parseFloat(product.price.toString())
          updated[index].subtotal = updated[index].quantity * parseFloat(product.price.toString())
        }
        break
      case 'quantity':
        updated[index].quantity = value as number
        updated[index].subtotal = (value as number) * updated[index].unitPrice
        break
      case 'productName':
        updated[index].productName = value as string
        break
      case 'unitPrice':
        updated[index].unitPrice = value as number
        break
      case 'subtotal':
        updated[index].subtotal = value as number
        break
    }

    setSelectedItems(updated)
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.subtotal, 0)
  }

  const handleSubmit = () => {
    const data = {
      customerId: form.getValues('customerId'),
      items: selectedItems,
      totalAmount: calculateTotal()
    }
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Form {...form}>
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Order Items</h3>
              <Button type="button" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {selectedItems.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Product</label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => updateItem(index, 'productId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit Price</label>
                    <Input value={`₹${item.unitPrice}`} disabled />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <label className="text-sm font-medium">Subtotal</label>
                      <div className="text-lg font-semibold">₹{item.subtotal.toFixed(2)}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!form.getValues('customerId') || selectedItems.length === 0}
            >
              Create Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}