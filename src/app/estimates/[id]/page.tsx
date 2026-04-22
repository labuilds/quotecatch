import { createAdminClient } from "@/utils/supabase/admin"
import { notFound } from "next/navigation"
import EstimatesClient from "./estimates-client"

export const dynamic = 'force-dynamic'

export default async function EstimateResultPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = createAdminClient()

  // 0. Handle Preview Mode
  if (id === 'preview-lead-id') {
    const mockLead = {
      id: 'preview-lead-id',
      estimated_price: 18500,
      address: "123 Solar Way, Austin, TX",
      calculators: { name: "Demo Estimator", user_id: "demo" }
    }
    return <EstimatesClient lead={mockLead} companyName="Your Roofing Co" />
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (!lead) notFound()

  // 2. Fetch Calculator (Optional)
  let companyName = "Our Roofing Team"
  let calculatorData: { name: string; user_id: string } | null = null
  let userProfile: any = null
  
  if (lead.calculator_id) {
    const { data: calculator } = await supabase
      .from('calculators')
      .select('name, user_id')
      .eq('id', lead.calculator_id)
      .single()

    if (calculator) {
      calculatorData = calculator
      companyName = calculator.name
      
      // 3. Fetch User Company Profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', calculator.user_id)
        .single()
      
      if (profile) {
        userProfile = profile
        if (profile.company_name) {
          companyName = profile.company_name
        }
      }
    }
  }

  const isDemo = calculatorData?.name === 'Main Landing Page' || !lead.calculator_id

  // 4. Generate Satellite Map URL (Server-side to ensure env vars are available)
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const staticMapUrl = lead.address && apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(lead.address)}&zoom=19&size=600x400&maptype=satellite&key=${apiKey}`
    : null

  return (
    <EstimatesClient 
      lead={lead} 
      companyName={companyName} 
      userProfile={userProfile}
      isDemo={isDemo}
      staticMapUrl={staticMapUrl}
    />
  )
}
