"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"

const privacyFormSchema = z.object({
  dataSharing: z.boolean().default(false),
  anonymousAnalytics: z.boolean().default(true),
  researchParticipation: z.boolean().default(false),
  thirdPartyAccess: z.boolean().default(false),
})

type PrivacyFormValues = z.infer<typeof privacyFormSchema>

// This would come from your database
const defaultValues: Partial<PrivacyFormValues> = {
  dataSharing: false,
  anonymousAnalytics: true,
  researchParticipation: false,
  thirdPartyAccess: false,
}

interface PrivacyFormProps {
  userId: string
}

export function PrivacyForm({ userId }: PrivacyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues,
  })

  async function onSubmit(data: PrivacyFormValues) {
    setIsSubmitting(true)
    setSuccess(null)
    setError(null)

    try {
      // In a real app, you would save this to your database
      console.log("Privacy preferences saved:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Privacy preferences updated successfully")
    } catch (err) {
      console.error("Error saving privacy preferences:", err)
      setError("Failed to update privacy preferences")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dataSharing"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Data Sharing</FormLabel>
                  <FormDescription>Allow your health data to be shared with healthcare providers</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anonymousAnalytics"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Anonymous Analytics</FormLabel>
                  <FormDescription>Allow anonymous usage data to improve our services</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="researchParticipation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Research Participation</FormLabel>
                  <FormDescription>
                    Participate in health research studies (you will be notified before any study begins)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thirdPartyAccess"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Third-Party Access</FormLabel>
                  <FormDescription>Allow trusted third-party services to access your health data</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </form>
    </Form>
  )
}

