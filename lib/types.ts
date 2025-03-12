export interface HealthData {
  // Basic information
  age?: number
  gender?: string
  height?: number // in cm
  weight?: number // in kg

  // Vital measurements
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  cholesterolTotal?: number
  cholesterolHDL?: number
  cholesterolLDL?: number
  fastingGlucose?: number

  // Lifestyle factors
  exerciseMinutesPerWeek?: number
  sleepHoursPerNight?: number
  stressLevel?: number // 1-10 scale
  dietQuality?: number // 1-10 scale
  smokingStatus?: string // never, former, current
  alcoholConsumption?: string // none, light, moderate, heavy

  // Medical history
  familyHistory?: string[]
  existingConditions?: string[]
  medications?: string
  additionalNotes?: string

  // Analysis results
  analyzed?: boolean
  longevityScore?: number // 0-100 scale
  healthAge?: number // biological age estimate
  focusAreas?: string[] // key areas for improvement
}

