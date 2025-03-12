"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart } from "@/components/charts"
import { supabase } from "@/lib/supabase/client"
import { Activity, Calendar, TrendingUp, TrendingDown } from "lucide-react"

interface HealthHistoryProps {
  userId: string
}

interface HistoryEntry {
  id: string
  created_at: string
  longevity_score: number
  health_age: number
  data: any
}

export function HealthHistory({ userId }: HealthHistoryProps) {
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("6months")

  useEffect(() => {
    async function fetchHealthHistory() {
      try {
        const { data, error } = await supabase
          .from("health_data")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10)

        if (error) {
          console.error("Error fetching health history:", error)
          return
        }

        setHistoryData(data || [])
      } catch (error) {
        console.error("Error fetching health history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHealthHistory()
  }, [userId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Skeleton className="h-16 w-16" />
                  <div className="space-y-2 flex-1 ml-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Prepare data for the chart
  const chartData = {
    labels: historyData.map((entry) => format(new Date(entry.created_at), "MMM d, yyyy")).reverse(),
    datasets: [
      {
        label: "Longevity Score",
        data: historyData.map((entry) => entry.longevity_score).reverse(),
        borderColor: "rgb(234, 88, 12)",
        backgroundColor: "rgba(234, 88, 12, 0.1)",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Longevity Score Trend</CardTitle>
              <CardDescription>Track how your health score changes over time</CardDescription>
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
          {historyData.length > 1 ? (
            <div className="h-[300px]">
              <LineChart data={chartData} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Not enough data</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Submit your health data at least twice to see how your longevity score changes over time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Health Data Entries</h2>

        {historyData.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No health data yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Submit your health data to start tracking your progress over time.
              </p>
              <Button asChild>
                <a href="/dashboard">Submit Health Data</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          historyData.map((entry) => {
            const previousEntry = historyData[historyData.indexOf(entry) + 1]
            const scoreDifference = previousEntry ? entry.longevity_score - previousEntry.longevity_score : 0

            return (
              <Card key={entry.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{format(new Date(entry.created_at), "MMMM d, yyyy")}</CardTitle>
                  <CardDescription>{format(new Date(entry.created_at), "h:mm a")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start">
                    <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-4 w-20 h-20">
                      <span className="text-2xl font-bold">{entry.longevity_score}</span>
                      <span className="text-xs text-muted-foreground">Score</span>
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex items-center mb-2">
                        <span className="font-medium">Health Age: </span>
                        <span className="ml-2">{entry.health_age}</span>
                        {entry.data.age && (
                          <span className="text-sm text-muted-foreground ml-2">
                            (vs {entry.data.age} chronological)
                          </span>
                        )}
                      </div>

                      {previousEntry && (
                        <div className="flex items-center text-sm">
                          {scoreDifference > 0 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-600">+{scoreDifference.toFixed(1)} from previous</span>
                            </>
                          ) : scoreDifference < 0 ? (
                            <>
                              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-600">{scoreDifference.toFixed(1)} from previous</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">No change from previous</span>
                          )}
                        </div>
                      )}
                    </div>

                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/history/${entry.id}`}>View Details</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

