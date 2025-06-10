"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

type UserRole = 'Admin' | 'Manager' | 'Employee'

interface RoleContextType {
  role: UserRole | null
  loading: boolean
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  loading: true
})

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRole() {
      if (user) {
        try {
          const response = await fetch('/api/user/role')
          const data = await response.json()
          setRole(data.role)
        } catch (error) {
          setRole('Employee')
        }
      }
      setLoading(false)
    }

    fetchRole()
  }, [user])

  return (
    <RoleContext.Provider value={{ role, loading }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => useContext(RoleContext)