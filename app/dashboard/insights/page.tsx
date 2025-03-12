import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { HealthInsights } from "@/components/health-insights"
import { defaultHealthData } from "@/lib/data"

export default async function InsightsPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin")
  }

  // Fetch the latest health data for the user
  const { data } = await supabase
    .from("health_data")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const healthData = data
    ? {
        ...data.data,
        analyzed: data.analyzed,
        longevityScore: data.longevity_score,
        healthAge: data.health_age,
        focusAreas: data.focus_areas,
      }
    : defaultHealthData

  const insights = data?.insights || null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Insights</h1>
        <p className="text-muted-foreground">Personalized recommendations based on your health data</p>
      </div>

      <HealthInsights insights={insights} isLoading={false} healthData={healthData} />
    </div>
  )
}

