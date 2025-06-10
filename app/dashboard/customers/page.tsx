"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'
import CustomersTable from './components/CustomersTable'
import CustomerFormModal from './components/CustomerFormModal'
import toast from 'react-hot-toast'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  useEffect(() => {
    fetchCustomers()
  }, [searchTerm])

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`/api/customers?search=${searchTerm}`)
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      toast.error('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustomer = async (data: any) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        toast.success('Customer created successfully')
        fetchCustomers()
        setIsModalOpen(false)
      }
    } catch (error) {
      toast.error('Failed to create customer')
    }
  }

  const handleUpdateCustomer = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        toast.success('Customer updated successfully')
        fetchCustomers()
        setIsModalOpen(false)
        setEditingCustomer(null)
      }
    } catch (error) {
      toast.error('Failed to update customer')
    }
  }

  const handleDeleteCustomer = async (id: string) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Customer deleted successfully')
        fetchCustomers()
      }
    } catch (error) {
      toast.error('Failed to delete customer')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-3xl" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Customers</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CustomersTable
            customers={customers}
            loading={loading}
            onEdit={(customer) => {
              setEditingCustomer(customer)
              setIsModalOpen(true)
            }}
            onDelete={handleDeleteCustomer}
          />
        </CardContent>
      </Card>

      <CustomerFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCustomer(null)
        }}
        onSubmit={editingCustomer 
          ? (data) => handleUpdateCustomer(editingCustomer.id, data)
          : handleCreateCustomer
        }
        customer={editingCustomer}
      />
    </div>
  )
}