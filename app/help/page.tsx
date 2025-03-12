import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">Find answers to common questions and get support</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span>support@healthinsightsai.com</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                <span>Live chat available 9am-5pm EST</span>
              </div>
              <Button className="w-full">Start a Conversation</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Helpful guides and documentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Link href="/help/getting-started" className="text-primary hover:underline">
                  Getting Started Guide
                </Link>
                <Link href="/help/data-guide" className="text-primary hover:underline">
                  Understanding Your Health Data
                </Link>
                <Link href="/help/privacy" className="text-primary hover:underline">
                  Privacy & Security
                </Link>
                <Link href="/help/faq" className="text-primary hover:underline">
                  Frequently Asked Questions
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How is my health data used?</AccordionTrigger>
                <AccordionContent>
                  Your health data is used to generate personalized insights and recommendations. We take your privacy
                  seriously and only use your data in accordance with our privacy policy. You can control how your data
                  is used in your privacy settings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How accurate are the health insights?</AccordionTrigger>
                <AccordionContent>
                  Our health insights are based on the latest scientific research and are designed to provide general
                  guidance. However, they should not be considered medical advice. Always consult with a healthcare
                  professional for medical decisions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Can I export my health data?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can export your health data at any time from your account settings. Your data is provided in
                  a standard format that can be used with other health applications.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How often should I update my health data?</AccordionTrigger>
                <AccordionContent>
                  For the most accurate insights, we recommend updating your health data at least once a month. Some
                  metrics, like weight and exercise, can be updated more frequently for better tracking.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we use industry-standard encryption and security practices to protect your data. Your health
                  information is stored securely and is only accessible to you and authorized personnel who need it to
                  provide services to you.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

