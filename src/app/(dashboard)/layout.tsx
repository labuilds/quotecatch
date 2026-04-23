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
  
  // 1. Fetch Plan Status and Trial (Essential)
  let { data: profile, error: statusError } = await admin
    .from('users')
    .select('is_pro, trial_ends_at, subscription_status')
    .eq('id', user.id)
    .single()

  console.log(`[DashboardLayout] User: ${user.email}, Pro: ${profile?.is_pro}, TrialEnds: ${profile?.trial_ends_at}, Status: ${profile?.subscription_status}`)

  // Self-heal logic if missing entirely or missing trial info
  if (!profile?.trial_ends_at) {
    console.log(`[DashboardLayout] Initializing trial for ${user.email}`)
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const initialIsPro = profile?.is_pro ?? false
    const initialStatus = profile?.subscription_status ?? 'trialing'

    const { data: updatedProfile, error: upsertError } = await admin
      .from('users')
      .upsert({ 
        id: user.id, 
        email: user.email,
        is_pro: initialIsPro, 
        trial_ends_at: trialEndsAt.toISOString(),
        subscription_status: initialStatus
      }, { onConflict: 'id' })
      .select('is_pro, trial_ends_at, subscription_status')
      .single()
    
    if (upsertError) {
      console.error("[DashboardLayout] Upsert Error:", upsertError)
    } else if (updatedProfile) {
      profile = updatedProfile
      console.log(`[DashboardLayout] Successfully initialized trial: ${profile.trial_ends_at}`)
    }
  }

  const isPro = profile?.is_pro ?? false
  const trialEndsAtString = profile?.trial_ends_at || null
  const trialEndsAt = trialEndsAtString ? new Date(trialEndsAtString) : null
  const isTrialExpired = trialEndsAt ? trialEndsAt < new Date() : false
  const isPastDue = profile?.subscription_status === 'past_due'
  
  // Hard Lockout Logic (Day 15 or past_due)
  const isLocked = !isPro && (isTrialExpired || isPastDue)

  const userEmail = user.email || ''

  return (
    <DashboardLayoutClient 
      isPro={isPro} 
      userEmail={userEmail}
      trialEndsAt={profile?.trial_ends_at}
      isLocked={isLocked}
    >
      {children}
    </DashboardLayoutClient>
  )
}
