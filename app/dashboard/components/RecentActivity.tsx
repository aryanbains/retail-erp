"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivityLogs()
  }, [])

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch('/api/activity-logs')
      const data = await response.json()
      setActivities(data.slice(0, 10))
    } catch (error) {
      console.error('Failed to fetch activity logs')
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (entityType: string) => {
    switch (entityType) {
      case 'order': return 'bg-blue-100 text-blue-800'
      case 'product': return 'bg-green-100 text-green-800'
      case 'customer': return 'bg-purple-100 text-purple-800'
      case 'employee': return 'bg-orange-100 text-orange-800'
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
          {loading ? (
            <p className="text-sm text-gray-500">Loading activities...</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activities</p>
          ) : (
            activities.map((activity: any) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Badge className={getTypeColor(activity.entityType)}>
                  {activity.entityType}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">
                    by {activity.userName || 'System'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}