"use server"

import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateUserProfile(data: {
  first_name?: string
  last_name?: string
  company_name?: string
  website?: string
  webhook_url?: string
  company_logo_url?: string
  company_description?: string
  facebook_url?: string
  linkedin_url?: string
  instagram_url?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from("users")
    .upsert({ 
      id: user.id,
      email: user.email,
      ...data,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' })

  if (error) {
    console.error("Profile update error:", error)
    throw new Error(error.message)
  }

  revalidatePath("/settings")
  return { success: true }
}
