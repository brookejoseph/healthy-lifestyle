import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthMetrics } from "@/components/health-metrics"
import { defaultHealthData } from "@/lib/data"

export default async function AnalyticsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Health Analytics</h1>
        <p className="text-muted-foreground">Visualize and analyze your health metrics</p>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <HealthMetrics data={healthData} />
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Health Trends</CardTitle>
              <CardDescription>Track how your health metrics change over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-center">
                <p className="text-muted-foreground">Submit multiple health data entries to see trends over time</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparisons">
          <Card>
            <CardHeader>
              <CardTitle>Peer Comparisons</CardTitle>
              <CardDescription>Compare your health metrics with others in your age group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-center">
                <p className="text-muted-foreground">Peer comparison feature coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

