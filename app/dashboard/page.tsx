import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HealthMetrics } from "@/components/health-metrics"
import { defaultHealthData } from "@/lib/data"
import { Activity, Calendar, BookOpen, ArrowRight, FileText, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
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

  // Check if the user has submitted health data
  const hasSubmittedData = !!data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your health insights dashboard</p>
      </div>

      {!hasSubmittedData && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Submit your health data to receive personalized insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              To get the most out of Health Insights AI, we need to understand your health profile. Complete your health
              assessment to receive personalized recommendations.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/dashboard/data">
                Complete Health Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Longevity Score</CardTitle>
            <CardDescription>Based on your current health data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{healthData.longevityScore || "N/A"}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Score ranges from 0-100, with higher scores indicating better projected outcomes
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/insights">
                View Insights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Key Focus Areas</CardTitle>
            <CardDescription>Your top priorities for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {healthData.focusAreas?.map((area, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-primary mr-2"></span>
                  {area}
                </li>
              )) || <li>Submit your data to see focus areas</li>}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/data">
                Update Health Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Health Age</CardTitle>
            <CardDescription>Your biological vs chronological age</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold">{healthData.healthAge || "N/A"}</span>
              <span className="text-sm text-muted-foreground ml-2">vs {healthData.age} years chronological</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Based on biomarkers and lifestyle factors</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/analytics">
                View Analytics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto flex-col items-center justify-center py-4" asChild>
                <Link href="/dashboard/data">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Update Health Data</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-center justify-center py-4" asChild>
                <Link href="/dashboard/insights">
                  <Activity className="h-6 w-6 mb-2" />
                  <span>View Insights</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-center justify-center py-4" asChild>
                <Link href="/dashboard/history">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>View History</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-center justify-center py-4" asChild>
                <Link href="/dashboard/studies">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span>Browse Studies</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Progress</CardTitle>
            <CardDescription>Your health journey over time</CardDescription>
          </CardHeader>
          <CardContent>
            {hasSubmittedData ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span>Your longevity score has been calculated</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Continue tracking your health data to see how your metrics change over time.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[100px] text-center">
                <p className="text-muted-foreground">Submit your health data to track progress</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/history">
                View History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Metrics</CardTitle>
          <CardDescription>Visualizing your health data</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthMetrics data={healthData} />
        </CardContent>
      </Card>
    </div>
  )
}

