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
  phone?: string
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

export async function deleteUserAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const admin = createAdminClient()
  
  // 1. Delete from auth (using admin client)
  const { error: authError } = await admin.auth.admin.deleteUser(user.id)
  
  if (authError) {
    console.error("Auth deletion error:", authError)
    throw new Error("Failed to delete authentication account")
  }

  // 2. Note: If we have a public.users table with a delete cascade, it might handle it.
  // But let's be explicit if needed.
  const { error: dbError } = await admin
    .from("users")
    .delete()
    .eq("id", user.id)

  if (dbError) {
    console.error("DB record deletion error:", dbError)
    // Don't throw here if auth is already deleted, just log it.
  }

  return { success: true }
}
