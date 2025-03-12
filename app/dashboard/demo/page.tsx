import { HealthDashboard } from "@/components/health-dashboard"

export default function DemoDashboardPage() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Demo Dashboard</h1>
          <p className="text-muted-foreground">Try out the Health Insights AI dashboard with sample data</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
          <p className="flex items-center">
            <span className="font-medium">Demo Mode:</span>
            <span className="ml-2">Changes will not be saved. Sign up for a free account to save your data.</span>
          </p>
        </div>
        <HealthDashboard />
      </div>
    </main>
  )
}

