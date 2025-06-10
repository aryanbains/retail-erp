import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  status: string
}

interface AttendanceTableProps {
  attendance: AttendanceRecord[]
  employees: any[]
  loading: boolean
}

export default function AttendanceTable({ attendance, employees, loading }: AttendanceTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800'
      case 'Absent': return 'bg-red-100 text-red-800'
      case 'Leave': return 'bg-yellow-100 text-yellow-800'
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

  const attendanceMap = new Map(attendance.map(a => [a.employeeId, a]))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee Name</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => {
          const record = attendanceMap.get(employee.id)
          return (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(record?.status || 'Not Marked')}>
                  {record?.status || 'Not Marked'}
                </Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}