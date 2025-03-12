"use client"

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HealthDataForm } from "@/components/health-data-form"
import { defaultHealthData } from "@/lib/data"

export default async function HealthDataPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Health Data</h1>
        <p className="text-muted-foreground">Update your information to get personalized insights</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Information</CardTitle>
          <CardDescription>Enter your health metrics and lifestyle factors</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthDataForm initialData={healthData} onSubmit={() => {}} isSubmitting={false} userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

