import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Eye, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'

interface Order {
  id: string
  orderDate: string
  status: string
  totalAmount: string
  customerName: string
}

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  onStatusChange: (id: string, status: string) => void
  onViewDetails: (id: string) => void
}

export default function OrdersTable({ orders, loading, onStatusChange, onViewDetails }: OrdersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Shipped': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
            <TableCell>{format(new Date(order.orderDate), 'MMM d, yyyy')}</TableCell>
            <TableCell>{order.customerName || 'N/A'}</TableCell>
            <TableCell>${order.totalAmount}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(order.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'Pending')}>
                      Mark as Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'Shipped')}>
                      Mark as Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'Completed')}>
                      Mark as Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(order.id, 'Cancelled')}>
                      Mark as Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}