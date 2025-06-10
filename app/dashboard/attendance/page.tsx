"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import AttendanceTable from './components/AttendanceTable'
import AttendanceModal from './components/AttendanceModal'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchEmployees()
    fetchAttendance()
  }, [selectedDate])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      toast.error('Failed to fetch employees')
    }
  }

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?date=${format(selectedDate, 'yyyy-MM-dd')}`)
      const data = await response.json()
      setAttendance(data)
    } catch (error) {
      toast.error('Failed to fetch attendance')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = async (data: any) => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          date: selectedDate
        })
      })
      
      if (response.ok) {
        toast.success('Attendance marked successfully')
        fetchAttendance()
        setIsModalOpen(false)
      }
    } catch (error) {
      toast.error('Failed to mark attendance')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Attendance Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Calendar className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border rounded-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <AttendanceTable
            attendance={attendance}
            employees={employees}
            loading={loading}
          />
        </CardContent>
      </Card>

      <AttendanceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleMarkAttendance}
        employees={employees}
        existingAttendance={attendance}
      />
    </div>
  )
}