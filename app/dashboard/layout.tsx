import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Header } from "@/components/dashboard/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the current path is the demo path
  const isDemoPath = false // We'll implement this properly later

  if (!session && !isDemoPath) {
    redirect("/signin")
  }

  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header user={session?.user} />
          <main className="flex-1 container py-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

