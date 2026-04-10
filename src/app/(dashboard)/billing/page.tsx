import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { BillingClient } from "./billing-client"

export const metadata = {
  title: "Billing — QuoteCatch",
  description: "Manage your QuoteCatch subscription and billing.",
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>
}) {
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
  const params = await searchParams
  const justUpgraded = params.billing === "success"

  return (
    <BillingClient
      isPro={isPro || justUpgraded}
      email={user.email ?? ""}
      justUpgraded={justUpgraded}
    />
  )
}
