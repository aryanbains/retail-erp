"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

const activities = [
  {
    id: 1,
    action: 'New order placed',
    description: 'Order #1234 by John Doe',
    timestamp: new Date(),
    type: 'order'
  },
  {
    id: 2,
    action: 'Product stock low',
    description: 'iPhone 14 Pro - Only 5 left',
    timestamp: new Date(Date.now() - 3600000),
    type: 'alert'
  },
  {
    id: 3,
    action: 'Customer registered',
    description: 'Sarah Johnson joined',
    timestamp: new Date(Date.now() - 7200000),
    type: 'customer'
  },
  {
    id: 4,
    action: 'Payment received',
    description: '₹1,234 from Order #1233',
    timestamp: new Date(Date.now() - 10800000),
    type: 'payment'
  },
]

export default function RecentActivity() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-800'
      case 'alert': return 'bg-red-100 text-red-800'
      case 'customer': return 'bg-green-100 text-green-800'
      case 'payment': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Badge className={getTypeColor(activity.type)}>
                {activity.type}
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(activity.timestamp, 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}