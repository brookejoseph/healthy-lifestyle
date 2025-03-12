"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"
import type { HealthData } from "@/lib/types"
import { Loader2, CheckCircle } from "lucide-react"

const healthDataSchema = z.object({
  age: z.coerce.number().min(18).max(120),
  gender: z.string().min(1),
  height: z.coerce.number().min(100).max(250),
  weight: z.coerce.number().min(30).max(300),
  bloodPressureSystolic: z.coerce.number().min(70).max(220),
  bloodPressureDiastolic: z.coerce.number().min(40).max(140),
  cholesterolTotal: z.coerce.number().min(100).max(350).optional(),
  cholesterolHDL: z.coerce.number().min(20).max(100).optional(),
  cholesterolLDL: z.coerce.number().min(30).max(250).optional(),
  fastingGlucose: z.coerce.number().min(50).max(300).optional(),
  exerciseMinutesPerWeek: z.coerce.number().min(0).max(1200),
  sleepHoursPerNight: z.coerce.number().min(3).max(12),
  stressLevel: z.coerce.number().min(1).max(10),
  dietQuality: z.coerce.number().min(1).max(10),
  smokingStatus: z.string(),
  alcoholConsumption: z.string(),
  familyHistory: z.array(z.string()).optional(),
  existingConditions: z.array(z.string()).optional(),
  medications: z.string().optional(),
  additionalNotes: z.string().optional(),
})

const healthConditions = [
  { id: "diabetes", label: "Diabetes" },
  { id: "heartDisease", label: "Heart Disease" },
  { id: "cancer", label: "Cancer" },
  { id: "hypertension", label: "Hypertension" },
  { id: "stroke", label: "Stroke" },
  { id: "alzheimers", label: "Alzheimer's" },
]

interface HealthDataFormProps {
  initialData: HealthData
  onSubmit: (data: HealthData) => void
  isSubmitting: boolean
  userId?: string
}

export function HealthDataForm({ initialData, onSubmit, isSubmitting, userId }: HealthDataFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false)

  const form = useForm<z.infer<typeof healthDataSchema>>({
    resolver: zodResolver(healthDataSchema),
    defaultValues: {
      age: initialData.age || 35,
      gender: initialData.gender || "",
      height: initialData.height || 170,
      weight: initialData.weight || 70,
      bloodPressureSystolic: initialData.bloodPressureSystolic || 120,
      bloodPressureDiastolic: initialData.bloodPressureDiastolic || 80,
      cholesterolTotal: initialData.cholesterolTotal,
      cholesterolHDL: initialData.cholesterolHDL,
      cholesterolLDL: initialData.cholesterolLDL,
      fastingGlucose: initialData.fastingGlucose,
      exerciseMinutesPerWeek: initialData.exerciseMinutesPerWeek || 150,
      sleepHoursPerNight: initialData.sleepHoursPerNight || 7,
      stressLevel: initialData.stressLevel || 5,
      dietQuality: initialData.dietQuality || 6,
      smokingStatus: initialData.smokingStatus || "never",
      alcoholConsumption: initialData.alcoholConsumption || "moderate",
      familyHistory: initialData.familyHistory || [],
      existingConditions: initialData.existingConditions || [],
      medications: initialData.medications || "",
      additionalNotes: initialData.additionalNotes || "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof healthDataSchema>) => {
    setError(null)
    setSuccess(null)
    setIsSubmittingLocal(true)

    try {
      // If we have a userId, save directly to Supabase
      if (userId) {
        // First, analyze the data
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          throw new Error("Failed to analyze health data")
        }

        const result = await response.json()

        // Then save to Supabase
        const { error: supabaseError } = await supabase.from("health_data").insert({
          user_id: userId,
          data: values,
          analyzed: true,
          longevity_score: result.longevityScore,
          health_age: result.healthAge,
          focus_areas: result.focusAreas,
          insights: result.insights,
        })

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        setSuccess("Health data saved successfully!")

        // Redirect to insights page
        setTimeout(() => {
          router.push("/dashboard/insights")
          router.refresh()
        }, 1500)
      } else {
        // Otherwise use the provided onSubmit handler
        onSubmit(values as HealthData)
      }
    } catch (err) {
      console.error("Error submitting health data:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmittingLocal(false)
    }
  }

  return (
    <Form {...form}>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="nonbinary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloodPressureSystolic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Pressure (Systolic)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloodPressureDiastolic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Pressure (Diastolic)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cholesterolTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Cholesterol (mg/dL)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fastingGlucose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fasting Glucose (mg/dL)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Lifestyle Factors</h3>

          <FormField
            control={form.control}
            name="exerciseMinutesPerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exercise (minutes per week): {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={600}
                    step={10}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sleepHoursPerNight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sleep (hours per night): {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={3}
                    max={12}
                    step={0.5}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stressLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stress Level (1-10): {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dietQuality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diet Quality (1-10): {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="smokingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Smoking Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="never">Never Smoked</SelectItem>
                      <SelectItem value="former">Former Smoker</SelectItem>
                      <SelectItem value="current">Current Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alcoholConsumption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alcohol Consumption</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="light">Light (1-2 drinks/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                      <SelectItem value="heavy">Heavy (8+ drinks/week)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Medical History</h3>

          <FormField
            control={form.control}
            name="familyHistory"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Family History</FormLabel>
                  <FormDescription>Select conditions present in your immediate family</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {healthConditions.map((condition) => (
                    <FormField
                      key={condition.id}
                      control={form.control}
                      name="familyHistory"
                      render={({ field }) => {
                        return (
                          <FormItem key={condition.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(condition.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), condition.id])
                                    : field.onChange(field.value?.filter((value) => value !== condition.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{condition.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="existingConditions"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Existing Conditions</FormLabel>
                  <FormDescription>Select conditions you currently have</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {healthConditions.map((condition) => (
                    <FormField
                      key={condition.id}
                      control={form.control}
                      name="existingConditions"
                      render={({ field }) => {
                        return (
                          <FormItem key={condition.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(condition.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), condition.id])
                                    : field.onChange(field.value?.filter((value) => value !== condition.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{condition.label}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Medications</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any medications you're currently taking"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any other health information you'd like to share"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting || isSubmittingLocal}>
          {isSubmitting || isSubmittingLocal ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze My Health Data"
          )}
        </Button>
      </form>
    </Form>
  )
}

