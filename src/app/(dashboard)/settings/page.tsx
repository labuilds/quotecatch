import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { SettingsClient } from "./settings-client"

export const metadata = {
  title: "Settings — QuoteCatch",
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("is_pro")
    .eq("id", user.id)
    .single()

  const isPro = profile?.is_pro ?? false

  return <SettingsClient isPro={isPro} />
}
