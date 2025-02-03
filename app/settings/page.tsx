"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Mail, Shield, User, Building, Briefcase } from "lucide-react"

interface UserSettings {
  personal: {
    name: string
    email: string
    phone: string
    title: string
    licenseNumber: string
    brokerage: string
    website: string
    bio: string
    profileImage?: string
  }
  notifications: {
    emailAlerts: boolean
    smsAlerts: boolean
    leadNotifications: boolean
    showingReminders: boolean
    marketUpdates: boolean
    documentAlerts: boolean
  }
  emailSettings: {
    signature: string
    replyTemplate: string
    autoResponder: {
      enabled: boolean
      message: string
    }
    forwardingAddress: string
  }
  preferences: {
    language: string
    timeZone: string
    currency: string
    dateFormat: string
    theme: 'light' | 'dark' | 'system'
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    loginAlerts: boolean
    trustedDevices: string[]
  }
  business: {
    serviceAreas: string[]
    specializations: string[]
    targetMarket: string
    commission: string
    teamMembers: string[]
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [settings, setSettings] = useState<UserSettings>({
    personal: {
      name: "",
      email: "",
      phone: "",
      title: "",
      licenseNumber: "",
      brokerage: "",
      website: "",
      bio: "",
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: true,
      leadNotifications: true,
      showingReminders: true,
      marketUpdates: false,
      documentAlerts: true,
    },
    emailSettings: {
      signature: "",
      replyTemplate: "",
      autoResponder: {
        enabled: false,
        message: "",
      },
      forwardingAddress: "",
    },
    preferences: {
      language: "en",
      timeZone: "America/Toronto",
      currency: "CAD",
      dateFormat: "MM/DD/YYYY",
      theme: "light",
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date().toISOString(),
      loginAlerts: true,
      trustedDevices: [],
    },
    business: {
      serviceAreas: [],
      specializations: [],
      targetMarket: "",
      commission: "",
      teamMembers: [],
    },
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
    } else {
      // Load saved settings from localStorage
      const savedSettings = localStorage.getItem("userSettings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save settings to localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings))
    toast({
      title: "Settings Updated",
      description: "Your settings have been successfully saved.",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Business
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        value={settings.personal.name}
                        onChange={(e) => setSettings({
                          ...settings,
                          personal: { ...settings.personal, name: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input 
                        id="title"
                        value={settings.personal.title}
                        onChange={(e) => setSettings({
                          ...settings,
                          personal: { ...settings.personal, title: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={settings.personal.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          personal: { ...settings.personal, email: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        value={settings.personal.phone}
                        onChange={(e) => setSettings({
                          ...settings,
                          personal: { ...settings.personal, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">License Number</Label>
                      <Input 
                        id="license"
                        value={settings.personal.licenseNumber}
                        onChange={(e) => setSettings({
                          ...settings,
                          personal: { ...settings.personal, licenseNumber: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brokerage">Brokerage</Label>
                      <Input 
                        id="brokerage"
                        value={settings.personal.brokerage}
                        onChange={(e) => setSettings({
                          ...settings,
                          personal: { ...settings.personal, brokerage: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea 
                      id="bio"
                      value={settings.personal.bio}
                      onChange={(e) => setSettings({
                        ...settings,
                        personal: { ...settings.personal, bio: e.target.value }
                      })}
                      rows={4}
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="flex-1">
                        {key.split(/(?=[A-Z])/).join(" ")}
                      </Label>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [key]: checked }
                        })}
                      />
                    </div>
                  ))}
                  <Button onClick={handleSubmit} className="mt-4">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add other TabsContent components for email, security, and business settings */}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

