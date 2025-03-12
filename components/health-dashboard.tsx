"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HealthDataForm } from "@/components/health-data-form"
import { HealthInsights } from "@/components/health-insights"
import { HealthMetrics } from "@/components/health-metrics"
import { StudyReferences } from "@/components/study-references"
import type { HealthData } from "@/lib/types"
import { defaultHealthData } from "@/lib/data"
import { supabase } from "@/lib/supabase/client"
import { LoadingDashboard } from "@/components/loading-dashboard"

interface HealthDashboardProps {
  userId?: string
}

export function HealthDashboard({ userId }: HealthDashboardProps) {
  const [healthData, setHealthData] = useState<HealthData>(defaultHealthData)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [insights, setInsights] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHealthData() {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("health_data")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching health data:", error)
          return
        }

        if (data) {
          setHealthData({
            ...data.data,
            analyzed: data.analyzed,
            longevityScore: data.longevity_score,
            healthAge: data.health_age,
            focusAreas: data.focus_areas,
          })

          if (data.insights) {
            setInsights(data.insights)
          }
        }
      } catch (error) {
        console.error("Error fetching health data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHealthData()
  }, [userId])

  const handleDataSubmit = async (data: HealthData) => {
    setHealthData(data)
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setInsights(result.insights)

      // Save the data and analysis results to Supabase
      if (userId) {
        await supabase.from("health_data").insert({
          user_id: userId,
          data: data,
          analyzed: true,
          longevity_score: result.longevityScore,
          health_age: result.healthAge,
          focus_areas: result.focusAreas,
          insights: result.insights,
        })

        // Update the health data with the analysis results
        setHealthData({
          ...data,
          analyzed: true,
          longevityScore: result.longevityScore,
          healthAge: result.healthAge,
          focusAreas: result.focusAreas,
        })
      }
    } catch (error) {
      console.error("Error analyzing health data:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isLoading) {
    return <LoadingDashboard />
  }

  return (
    <Tabs defaultValue="dashboard" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="data">Your Data</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
        <TabsTrigger value="studies">Studies</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard" className="space-y-6">
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
          </Card>
        </div>

        <HealthMetrics data={healthData} />
      </TabsContent>

      <TabsContent value="data">
        <Card>
          <CardHeader>
            <CardTitle>Your Health Data</CardTitle>
            <CardDescription>Update your information to get personalized insights</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthDataForm initialData={healthData} onSubmit={handleDataSubmit} isSubmitting={isAnalyzing} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="insights">
        <HealthInsights insights={insights} isLoading={isAnalyzing} healthData={healthData} />
      </TabsContent>

      <TabsContent value="studies">
        <StudyReferences healthData={healthData} />
      </TabsContent>
    </Tabs>
  )
}

