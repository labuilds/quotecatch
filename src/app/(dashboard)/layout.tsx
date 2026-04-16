import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'
import { ReactNode } from 'react'

export const dynamic = "force-dynamic"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  
  // Single parallel fetch for user + profile
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  
  // 1. Fetch Plan Status (Essential)
  let { data: profile, error: statusError } = await admin
    .from('users')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  // Self-heal logic if missing entirely
  if (!profile && (statusError?.code === 'PGRST116' || !statusError)) {
    const { data: newProfile } = await admin
      .from('users')
      .upsert({ id: user.id, is_pro: false }, { onConflict: 'id' })
      .select('is_pro')
      .single()
    profile = newProfile
  }

  const isPro = profile?.is_pro ?? false
  const userEmail = user.email || ''

  return (
    <DashboardLayoutClient isPro={isPro} userEmail={userEmail}>
      {children}
    </DashboardLayoutClient>
  )
}
