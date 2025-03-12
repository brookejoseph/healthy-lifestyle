"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { HealthData } from "@/lib/types"
import { Search, BookOpen, Calendar, Users, FileText, ExternalLink } from "lucide-react"

interface StudyReferencesProps {
  healthData: HealthData
}

interface Study {
  id: string
  title: string
  authors: string
  journal: string
  year: number
  url: string
  relevance: string
  tags: string[]
}

export function StudyReferences({ healthData }: StudyReferencesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Sample studies - in a real app, these would be fetched from an API based on the user's health data
  const studies: Study[] = [
    {
      id: "1",
      title: "Association of Step Volume and Intensity With All-Cause Mortality in Older Women",
      authors: "I-Min Lee, et al.",
      journal: "JAMA Internal Medicine",
      year: 2023,
      url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2734709",
      relevance:
        "This study found that taking more steps per day was associated with lower mortality rates, with benefits seen at just 4,400 steps per day.",
      tags: ["exercise", "longevity", "women's health"],
    },
    {
      id: "2",
      title: "Mediterranean Diet and Health Outcomes in the SUN Prospective Cohort",
      authors: "Miguel A. Martínez-González, et al.",
      journal: "Nutrition, Metabolism and Cardiovascular Diseases",
      year: 2022,
      url: "https://www.nmcd-journal.com/article/S0939-4753(18)30084-X/fulltext",
      relevance:
        "Higher adherence to a Mediterranean diet was associated with reduced risk of cardiovascular events and overall mortality.",
      tags: ["diet", "cardiovascular", "nutrition"],
    },
    {
      id: "3",
      title: "Sleep Duration and All-Cause Mortality: A Systematic Review and Meta-Analysis",
      authors: "Francesco P. Cappuccio, et al.",
      journal: "Sleep",
      year: 2021,
      url: "https://academic.oup.com/sleep/article/33/5/585/2454478",
      relevance:
        "Both short (less than 7 hours) and long (more than 9 hours) sleep duration were associated with increased risk of death.",
      tags: ["sleep", "mortality", "meta-analysis"],
    },
    {
      id: "4",
      title: "Association Between Stress and Blood Pressure Variation: A Systematic Review",
      authors: "Jing Liu, et al.",
      journal: "Hypertension Research",
      year: 2023,
      url: "https://www.nature.com/articles/hr2017140",
      relevance: "Chronic psychological stress was associated with increased blood pressure and risk of hypertension.",
      tags: ["stress", "hypertension", "blood pressure"],
    },
    {
      id: "5",
      title: "Alcohol Consumption and Risk of Cardiovascular Disease: A Meta-Analysis",
      authors: "Sarah M. Hartz, et al.",
      journal: "The Lancet",
      year: 2022,
      url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)30134-X/fulltext",
      relevance:
        "Even moderate alcohol consumption was associated with increased risk of cardiovascular disease and mortality.",
      tags: ["alcohol", "cardiovascular", "meta-analysis"],
    },
  ]

  // Filter studies based on search query and active tag
  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      searchQuery === "" ||
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTag = activeTag === null || study.tags.includes(activeTag)

    return matchesSearch && matchesTag
  })

  // Get all unique tags
  const allTags = Array.from(new Set(studies.flatMap((study) => study.tags)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Studies & References</CardTitle>
        <CardDescription>Recent scientific studies relevant to your health profile</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search studies..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setActiveTag(null)
            }}
            size="sm"
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={activeTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredStudies.length > 0 ? (
            filteredStudies.map((study) => (
              <div key={study.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{study.title}</h3>
                  <a
                    href={study.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center text-sm"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </a>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {study.journal}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {study.year}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {study.authors}
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <p className="text-sm">{study.relevance}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No studies found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

