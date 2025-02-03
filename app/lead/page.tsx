"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout"
import { LeadListing } from "@/components/lead-listing"
import { LeadForm } from "@/components/lead-form"

export default function LeadPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/")
    }
  }, [router])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Lead Management</h1>
        <LeadListing />
        <LeadForm />
      </div>
    </DashboardLayout>
  )
}

