import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { redirect } from "next/navigation"
import { SettingsClient } from "./settings-client"

export const metadata = {
  title: "Settings — QuoteCatch",
}

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const admin = createAdminClient()
  
  // 1. Fetch Pro Status First (So we don't break if other columns are missing)
  let { data: profile, error: profileError } = await admin
    .from("users")
    .select("is_pro")
    .eq("id", user.id)
    .single()

  // Self-heal: Ensure record exists if missing
  if (!profile && (profileError?.code === 'PGRST116' || !profileError)) {
    const { data: newProfile } = await admin
      .from("users")
      .upsert({ id: user.id, is_pro: false }, { onConflict: 'id' })
      .select("is_pro")
      .single()
    profile = newProfile
  }

  // 2. Fetch Profile Info separately (This will fail gracefully if columns are missing)
  const { data: fullProfile } = await admin
    .from("users")
    .select("first_name, last_name, company_name, website, webhook_url, company_logo_url, company_description, facebook_url, linkedin_url, instagram_url")
    .eq("id", user.id)
    .single()

  return <SettingsClient isPro={profile?.is_pro ?? false} userProfile={{ ...profile, ...fullProfile }} />
}
