"use server"

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { PricingConfig } from '@/lib/pricingEngine'
import { revalidatePath } from 'next/cache'


export async function saveCalculator(name: string, config: PricingConfig) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to save a calculator.")
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('calculators')
    .insert([{ user_id: user.id, name, config_json: config }])
    .select()

  console.log("Supabase Creation Result:", { data, error })
  
  if (error) {
    console.error("Error creating calculator:", error)
    throw new Error(error.message)
  }

  revalidatePath('/(dashboard)', 'layout')
  return data
}

export async function deleteCalculator(id: string) {
  const admin = createAdminClient()
  const { error } = await admin.from('calculators').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/(dashboard)', 'layout')
}

export async function renameCalculator(id: string, newName: string) {
  const admin = createAdminClient()
  const { error } = await admin.from('calculators').update({ name: newName }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/(dashboard)', 'layout')
}

export async function duplicateCalculator(id: string) {
  const admin = createAdminClient()
  const { data: original, error: fetchErr } = await admin
    .from('calculators').select('*').eq('id', id).single()
  if (fetchErr || !original) throw new Error("Could not duplicate configuration.")
  const { data, error } = await admin
    .from('calculators')
    .insert([{ user_id: original.user_id, name: original.name + ' (Copy)', config_json: original.config_json, brand_color_hex: original.brand_color_hex }])
    .select()
  if (error) throw new Error(error.message)
  revalidatePath('/(dashboard)', 'layout')
  return data
}


export async function updateCalculatorConfig(id: string, name: string, newConfig: PricingConfig) {
  const admin = createAdminClient()
  const { error } = await admin.from('calculators').update({ name, config_json: newConfig }).eq('id', id)
  console.log("Supabase Update Result:", { error })
  if (error) throw new Error(error.message)
  revalidatePath('/(dashboard)', 'layout')
}
