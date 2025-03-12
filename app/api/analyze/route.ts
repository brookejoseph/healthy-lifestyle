import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { HealthData } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const healthData: HealthData = await request.json()

    // Calculate a simple longevity score for demo purposes
    // In a real app, this would be much more sophisticated
    let longevityScore = 70 // Base score

    // Adjust based on exercise
    if (healthData.exerciseMinutesPerWeek) {
      if (healthData.exerciseMinutesPerWeek >= 150) longevityScore += 5
      else if (healthData.exerciseMinutesPerWeek >= 75) longevityScore += 2
    }

    // Adjust based on sleep
    if (healthData.sleepHoursPerNight) {
      if (healthData.sleepHoursPerNight >= 7 && healthData.sleepHoursPerNight <= 9) longevityScore += 5
      else if (healthData.sleepHoursPerNight < 6 || healthData.sleepHoursPerNight > 10) longevityScore -= 3
    }

    // Adjust based on diet quality
    if (healthData.dietQuality) {
      longevityScore += healthData.dietQuality - 5
    }

    // Adjust based on smoking
    if (healthData.smokingStatus === "current") longevityScore -= 10
    else if (healthData.smokingStatus === "former") longevityScore -= 3

    // Adjust based on blood pressure
    if (healthData.bloodPressureSystolic && healthData.bloodPressureDiastolic) {
      if (healthData.bloodPressureSystolic > 140 || healthData.bloodPressureDiastolic > 90) {
        longevityScore -= 5
      }
    }

    // Calculate health age
    const healthAge = healthData.age ? Math.max(20, healthData.age - (longevityScore - 70) / 2) : undefined

    // Determine focus areas
    const focusAreas: string[] = []

    if (healthData.exerciseMinutesPerWeek && healthData.exerciseMinutesPerWeek < 150) {
      focusAreas.push("Increase physical activity")
    }

    if (healthData.sleepHoursPerNight && healthData.sleepHoursPerNight < 7) {
      focusAreas.push("Improve sleep quality and duration")
    }

    if (healthData.stressLevel && healthData.stressLevel > 6) {
      focusAreas.push("Implement stress management techniques")
    }

    if (healthData.dietQuality && healthData.dietQuality < 6) {
      focusAreas.push("Enhance nutritional quality of diet")
    }

    if (healthData.bloodPressureSystolic && healthData.bloodPressureSystolic > 130) {
      focusAreas.push("Monitor and manage blood pressure")
    }

    // Use AI to generate personalized insights
    // In a production app, this would be more sophisticated and use more detailed prompting
    const { text: insights } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Generate personalized health insights based on the following health data:
        
        Age: ${healthData.age}
        Gender: ${healthData.gender}
        Exercise: ${healthData.exerciseMinutesPerWeek} minutes per week
        Sleep: ${healthData.sleepHoursPerNight} hours per night
        Stress Level: ${healthData.stressLevel}/10
        Diet Quality: ${healthData.dietQuality}/10
        Smoking Status: ${healthData.smokingStatus}
        Alcohol Consumption: ${healthData.alcoholConsumption}
        Blood Pressure: ${healthData.bloodPressureSystolic}/${healthData.bloodPressureDiastolic}
        
        Provide specific, actionable recommendations for improving health and longevity based on this data and recent scientific research. Focus on personalized diet, exercise, sleep, and stress management strategies.
      `,
      system:
        "You are a health expert specializing in longevity and preventive medicine. Provide evidence-based, personalized health insights.",
    })

    return NextResponse.json({
      longevityScore: Math.min(100, Math.max(0, Math.round(longevityScore))),
      healthAge: healthAge ? Math.round(healthAge) : undefined,
      focusAreas,
      insights,
      analyzed: true,
    })
  } catch (error) {
    console.error("Error analyzing health data:", error)
    return NextResponse.json({ error: "Failed to analyze health data" }, { status: 500 })
  }
}

