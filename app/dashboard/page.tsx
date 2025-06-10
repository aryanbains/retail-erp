import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react'
import SalesChart from './components/SalesChart'
import RecentActivity from './components/RecentActivity'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Products',
      value: '156',
      icon: Package,
      change: '+12%',
      color: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: '89',
      icon: ShoppingCart,
      change: '+23%',
      color: 'text-green-600'
    },
    {
      title: 'Total Customers',
      value: '245',
      icon: Users,
      change: '+5%',
      color: 'text-purple-600'
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      icon: TrendingUp,
      change: '+18%',
      color: 'text-orange-600'
    }
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SalesChart />
        <RecentActivity />
      </div>
    </div>
  )
}