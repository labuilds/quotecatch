import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AICalculatorBuilder from '@/components/dashboard/AICalculatorBuilder'

export default async function CalculatorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: calculators, error } = await supabase
    .from('calculators')
    .select('*')

  return (
    <AICalculatorBuilder initialCalculators={calculators || []} />
  )
}
