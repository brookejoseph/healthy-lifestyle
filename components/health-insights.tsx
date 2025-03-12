"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import type { HealthData } from "@/lib/types"
import { InfoIcon, AlertTriangle, Lightbulb, Activity, Heart, Brain } from "lucide-react"

interface HealthInsightsProps {
  insights: string | null
  isLoading: boolean
  healthData: HealthData
}

export function HealthInsights({ insights, isLoading, healthData }: HealthInsightsProps) {
  if (isLoading) {
    return <LoadingInsights />
  }

  if (!insights && !healthData.analyzed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Insights</CardTitle>
          <CardDescription>Submit your health data to receive personalized insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>No data analyzed yet</AlertTitle>
            <AlertDescription>
              Go to the "Your Data" tab to submit your health information and receive AI-powered insights.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // For demo purposes, we'll show some sample insights if no real insights are available yet
  const displayInsights = insights || getSampleInsights(healthData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Personalized Health Insights</CardTitle>
        <CardDescription>AI-generated analysis based on your health data and recent research</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="stress">Stress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <h3 className="flex items-center text-lg font-medium">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Health Overview
              </h3>
              <p>{displayInsights.overview}</p>

              {displayInsights.warnings && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Health Warnings</AlertTitle>
                  <AlertDescription>{displayInsights.warnings}</AlertDescription>
                </Alert>
              )}

              <h4 className="flex items-center mt-6 text-md font-medium">
                <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
                Key Takeaways
              </h4>
              <ul>
                {displayInsights.keyTakeaways.map((takeaway, index) => (
                  <li key={index}>{takeaway}</li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="diet" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <h3 className="flex items-center text-lg font-medium">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Dietary Recommendations
              </h3>
              <p>{displayInsights.diet.overview}</p>

              <h4 className="mt-4 text-md font-medium">Foods to Emphasize</h4>
              <ul>
                {displayInsights.diet.emphasize.map((food, index) => (
                  <li key={index}>{food}</li>
                ))}
              </ul>

              <h4 className="mt-4 text-md font-medium">Foods to Limit</h4>
              <ul>
                {displayInsights.diet.limit.map((food, index) => (
                  <li key={index}>{food}</li>
                ))}
              </ul>

              <h4 className="mt-4 text-md font-medium">Personalized Nutrition Plan</h4>
              <p>{displayInsights.diet.plan}</p>
            </div>
          </TabsContent>

          <TabsContent value="exercise" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <h3 className="flex items-center text-lg font-medium">
                <Activity className="mr-2 h-5 w-5 text-green-500" />
                Exercise Recommendations
              </h3>
              <p>{displayInsights.exercise.overview}</p>

              <h4 className="mt-4 text-md font-medium">Recommended Activities</h4>
              <ul>
                {displayInsights.exercise.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>

              <h4 className="mt-4 text-md font-medium">Weekly Exercise Plan</h4>
              <p>{displayInsights.exercise.plan}</p>
            </div>
          </TabsContent>

          <TabsContent value="sleep" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <h3 className="flex items-center text-lg font-medium">
                <Brain className="mr-2 h-5 w-5 text-purple-500" />
                Sleep Optimization
              </h3>
              <p>{displayInsights.sleep.overview}</p>

              <h4 className="mt-4 text-md font-medium">Sleep Hygiene Tips</h4>
              <ul>
                {displayInsights.sleep.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="stress" className="space-y-4 pt-4">
            <div className="prose max-w-none">
              <h3 className="flex items-center text-lg font-medium">
                <Brain className="mr-2 h-5 w-5 text-blue-500" />
                Stress Management
              </h3>
              <p>{displayInsights.stress.overview}</p>

              <h4 className="mt-4 text-md font-medium">Stress Reduction Techniques</h4>
              <ul>
                {displayInsights.stress.techniques.map((technique, index) => (
                  <li key={index}>{technique}</li>
                ))}
              </ul>

              <h4 className="mt-4 text-md font-medium">Daily Practice</h4>
              <p>{displayInsights.stress.practice}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function LoadingInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyzing Your Health Data</CardTitle>
        <CardDescription>Our AI is processing your information to generate personalized insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-[40%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-5 w-[30%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[85%]" />
        </div>
      </CardContent>
    </Card>
  )
}

function getSampleInsights(healthData: HealthData) {
  // This function provides sample insights for demonstration purposes
  // In a real application, these would come from the AI analysis

  return {
    overview: `Based on your data, your overall health profile shows some strengths and areas for improvement. Your exercise routine of ${healthData.exerciseMinutesPerWeek || 150} minutes per week is ${healthData.exerciseMinutesPerWeek && healthData.exerciseMinutesPerWeek >= 150 ? "meeting" : "below"} recommended guidelines. Your sleep duration of ${healthData.sleepHoursPerNight || 7} hours per night is ${healthData.sleepHoursPerNight && healthData.sleepHoursPerNight >= 7 ? "adequate" : "insufficient"} for optimal health.`,

    warnings:
      healthData.bloodPressureSystolic && healthData.bloodPressureSystolic > 140
        ? "Your blood pressure readings indicate hypertension. We recommend consulting with a healthcare provider for proper evaluation and management."
        : null,

    keyTakeaways: [
      "Increasing your physical activity could significantly improve your longevity metrics",
      "Your diet quality score suggests room for improvement in nutritional intake",
      "Stress management techniques would benefit your overall health profile",
      "Regular monitoring of your blood pressure is recommended",
    ],

    diet: {
      overview:
        "Your current diet quality score indicates opportunities for improvement. Based on recent research, personalizing your nutrition to your specific metabolic profile can significantly impact health outcomes.",
      emphasize: [
        "Leafy green vegetables (spinach, kale, arugula)",
        "Fatty fish rich in omega-3s (salmon, mackerel)",
        "Berries and other antioxidant-rich fruits",
        "Nuts and seeds (particularly walnuts and flaxseeds)",
        "Fermented foods for gut health (yogurt, kimchi, sauerkraut)",
      ],
      limit: [
        "Processed foods with added sugars",
        "Refined carbohydrates",
        "Excessive sodium intake",
        "Red and processed meats",
        "Sugar-sweetened beverages",
      ],
      plan: "Consider adopting a Mediterranean-style eating pattern, which has been consistently associated with longevity and reduced risk of chronic diseases. Focus on plant-based foods, healthy fats, and moderate protein intake.",
    },

    exercise: {
      overview: `Your current activity level of ${healthData.exerciseMinutesPerWeek || 150} minutes per week ${healthData.exerciseMinutesPerWeek && healthData.exerciseMinutesPerWeek >= 150 ? "meets basic recommendations" : "falls short of recommendations"}. Recent research indicates that a combination of aerobic exercise, strength training, and flexibility work provides optimal benefits for longevity.`,
      activities: [
        "Moderate-intensity walking or cycling (30-45 minutes, 3-5 days/week)",
        "Strength training with resistance bands or weights (2-3 days/week)",
        "Flexibility exercises like yoga or stretching (2-3 days/week)",
        "Balance exercises to prevent falls and maintain mobility",
        "Brief high-intensity interval training for metabolic health (if appropriate)",
      ],
      plan: "Start with achievable goals and gradually increase intensity and duration. Aim for 150-300 minutes of moderate activity per week, plus two strength training sessions. Find activities you enjoy to increase adherence.",
    },

    sleep: {
      overview: `You report sleeping ${healthData.sleepHoursPerNight || 7} hours per night, which is ${healthData.sleepHoursPerNight && healthData.sleepHoursPerNight >= 7 ? "within" : "below"} the recommended range. Quality sleep is crucial for cellular repair, cognitive function, and metabolic health.`,
      tips: [
        "Maintain a consistent sleep schedule, even on weekends",
        "Create a relaxing bedtime routine to signal your body it's time to sleep",
        "Optimize your sleep environment (cool, dark, quiet room)",
        "Limit screen time and blue light exposure 1-2 hours before bed",
        "Avoid caffeine after midday and alcohol close to bedtime",
        "Consider relaxation techniques like deep breathing or meditation before sleep",
      ],
    },

    stress: {
      overview: `Your reported stress level of ${healthData.stressLevel || 5}/10 indicates ${healthData.stressLevel && healthData.stressLevel > 7 ? "significant" : "moderate"} perceived stress. Chronic stress accelerates cellular aging and contributes to inflammation, affecting multiple body systems.`,
      techniques: [
        "Mindfulness meditation (even 5-10 minutes daily can be beneficial)",
        "Deep breathing exercises (try the 4-7-8 technique)",
        "Regular physical activity to reduce stress hormones",
        "Time in nature, which research shows reduces stress biomarkers",
        "Social connection and community engagement",
        "Journaling or expressive writing to process emotions",
      ],
      practice:
        "Consider incorporating a 10-minute mindfulness practice into your morning routine, and brief breathing exercises during stressful moments throughout the day. Even small, consistent stress management practices can yield significant benefits.",
    },
  }
}

