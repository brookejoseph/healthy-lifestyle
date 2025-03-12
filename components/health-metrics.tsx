"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { HealthData } from "@/lib/types"
import { LineChart, BarChart, PieChart } from "@/components/charts"

interface HealthMetricsProps {
  data: HealthData
}

export function HealthMetrics({ data }: HealthMetricsProps) {
  const [timeframe, setTimeframe] = useState("6months")

  // Sample data for visualization - in a real app, this would come from historical data
  const bloodPressureData = {
    labels: ["6 months ago", "5 months ago", "4 months ago", "3 months ago", "2 months ago", "1 month ago", "Current"],
    datasets: [
      {
        label: "Systolic",
        data: [125, 128, 130, 127, 132, 129, data.bloodPressureSystolic || 120],
        borderColor: "rgb(234, 88, 12)",
        backgroundColor: "rgba(234, 88, 12, 0.1)",
      },
      {
        label: "Diastolic",
        data: [82, 84, 85, 83, 86, 84, data.bloodPressureDiastolic || 80],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
    ],
  }

  const exerciseData = {
    labels: ["Cardio", "Strength", "Flexibility", "Balance", "Sports"],
    datasets: [
      {
        label: "Minutes per Week",
        data: [
          Math.round((data.exerciseMinutesPerWeek || 150) * 0.5),
          Math.round((data.exerciseMinutesPerWeek || 150) * 0.25),
          Math.round((data.exerciseMinutesPerWeek || 150) * 0.1),
          Math.round((data.exerciseMinutesPerWeek || 150) * 0.05),
          Math.round((data.exerciseMinutesPerWeek || 150) * 0.1),
        ],
        backgroundColor: [
          "rgba(234, 88, 12, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
      },
    ],
  }

  const healthFactorsData = {
    labels: ["Diet", "Exercise", "Sleep", "Stress Management", "Social Connection"],
    datasets: [
      {
        label: "Impact on Longevity",
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          "rgba(234, 88, 12, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>Visualizing your health data and trends</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Timeframe:</span>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="text-sm border rounded p-1"
            >
              <option value="1month">1 Month</option>
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bloodPressure" className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="bloodPressure">Blood Pressure</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="factors">Health Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="bloodPressure" className="space-y-4">
            <div className="h-[300px]">
              <LineChart data={bloodPressureData} />
            </div>
            <p className="text-sm text-muted-foreground">
              Your blood pressure readings over time. The ideal range is below 120/80 mmHg.
            </p>
          </TabsContent>

          <TabsContent value="exercise" className="space-y-4">
            <div className="h-[300px]">
              <BarChart data={exerciseData} />
            </div>
            <p className="text-sm text-muted-foreground">
              Breakdown of your exercise activities. Aim for a balanced approach across different types.
            </p>
          </TabsContent>

          <TabsContent value="factors" className="space-y-4">
            <div className="h-[300px]">
              <PieChart data={healthFactorsData} />
            </div>
            <p className="text-sm text-muted-foreground">
              Relative impact of different lifestyle factors on longevity, based on current research.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

