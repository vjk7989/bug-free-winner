"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users } from "lucide-react"
import type { User } from "@/lib/types"

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
      return
    }

    // Load users from localStorage
    const loadUsers = () => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      setUsers(storedUsers)
    }

    // Load initial users
    loadUsers()

    // Add event listener for storage changes
    window.addEventListener('storage', loadUsers)

    return () => {
      window.removeEventListener('storage', loadUsers)
    }
  }, [router])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <Button 
            className="flex items-center gap-2"
            onClick={() => router.push('/users/add')}
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {users.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No users found</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">@{user.username}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{user.role}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.push(`/users/permissions?userId=${user.id}`)}
                      >
                        Permissions
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => router.push(`/users/${user.id}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 