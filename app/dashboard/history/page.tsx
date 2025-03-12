import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { HealthHistory } from "@/components/health-history"

export default async function HistoryPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin")
  }

  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Health History</h1>
          <p className="text-muted-foreground">Track your health data and insights over time</p>
        </div>
        <HealthHistory userId={session.user.id} />
      </div>
    </main>
  )
}

