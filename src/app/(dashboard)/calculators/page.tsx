import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import CalculatorDashboard from '@/components/dashboard/CalculatorDashboard'

export const dynamic = 'force-dynamic'

export default async function CalculatorsPage() {
  const supabase = await createClient()
  
  // Parallel fetch: Auth + Data
  const [authResult, calculatorsResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('calculators').select('*')
  ])

  console.log("Dashboard Data Fetch Result:", { 
    count: calculatorsResult.data?.length, 
    error: calculatorsResult.error,
    userId: authResult.data?.user?.id,
    firstRecordKeys: calculatorsResult.data?.[0] ? Object.keys(calculatorsResult.data[0]) : null
  })

  const user = authResult.data?.user
  if (!user) redirect('/login')

  const calculators = calculatorsResult.data || []

  return (
    <CalculatorDashboard initialCalculators={calculators} />
  )
}
