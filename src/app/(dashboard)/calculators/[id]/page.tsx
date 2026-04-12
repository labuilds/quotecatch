import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ManualCalculatorEditor from '@/components/dashboard/ManualCalculatorEditor'

export const dynamic = 'force-dynamic'

export default async function CalculatorEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: calculator } = await supabase
    .from('calculators')
    .select('*')
    .eq('id', id)
    .single()

  if (!calculator) redirect('/calculators')

  return <ManualCalculatorEditor calculator={calculator} />
} 
