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
import { format } from 'date-fns'

interface Employee {
  id: string
  name: string
  email: string
  department: string
  designation: string
  dateOfJoining: string
  attendanceStatus: string
  leaveBalance: number
}

interface EmployeesTableProps {
  employees: Employee[]
  loading: boolean
}

export default function EmployeesTable({ employees, loading }: EmployeesTableProps) {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Designation</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Leave Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium">{employee.name}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell>{employee.designation}</TableCell>
            <TableCell>{format(new Date(employee.dateOfJoining), 'MMM d, yyyy')}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(employee.attendanceStatus)}>
                {employee.attendanceStatus}
              </Badge>
            </TableCell>
            <TableCell>{employee.leaveBalance} days</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}