import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { UserProfile } from "@/components/profile/user-profile"

export default async function ProfilePage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/signin")
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        <UserProfile user={session.user} />
      </div>
    </div>
  )
}

