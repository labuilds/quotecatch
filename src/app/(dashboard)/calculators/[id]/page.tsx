import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AICalculatorEditor from '@/components/dashboard/AICalculatorEditor'

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

  return <AICalculatorEditor calculator={calculator} />
} 
