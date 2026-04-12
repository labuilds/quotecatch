import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LeadsDashboard from '@/components/dashboard/LeadsDashboard'

export const dynamic = 'force-dynamic'

export default async function LeadsPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data?.user
  if (!user) redirect('/login')

  // Parallel fetch: is_pro status AND leads data
  const [profileResult, leadsResult] = await Promise.all([
    supabase.from('users').select('is_pro').eq('id', user.id).single(),
    supabase.from('leads')
      .select(`id, homeowner_name, homeowner_email, homeowner_phone, estimated_price, address, calculators ( name )`)
  ])

  const isPro = profileResult.data?.is_pro ?? false
  const leads = leadsResult.data || []
  const error = leadsResult.error

  if (error) console.error('Error fetching leads:', error)

  return (
    <LeadsDashboard initialLeads={leads} initialIsPro={isPro} />
  )
}
