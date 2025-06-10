"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface AttendanceModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  employees: any[]
  existingAttendance: any[]
}

export default function AttendanceModal({ 
  open, 
  onClose, 
  onSubmit, 
  employees, 
  existingAttendance 
}: AttendanceModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [status, setStatus] = useState('Present')

  const markedEmployeeIds = new Set(existingAttendance.map(a => a.employeeId))
  const unmarkedEmployees = employees.filter(e => !markedEmployeeIds.has(e.id))

  const handleSubmit = () => {
    if (selectedEmployee && status) {
      onSubmit({
        employeeId: selectedEmployee,
        status
      })
      setSelectedEmployee('')
      setStatus('Present')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {unmarkedEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Leave">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedEmployee}>
              Mark Attendance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}