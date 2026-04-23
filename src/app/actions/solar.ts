"use server"

import { createClient } from "@/utils/supabase/server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export type SolarResult = {
  success: boolean
  areaSqFt?: number
  formattedAddress?: string
  error?: string
  errorType?: 'NO_DATA' | 'API_ERROR' | 'UNAUTHORIZED' | 'PRO_REQUIRED'
}

async function getRoofEstimationInternal(address: string, calculatorId?: string): Promise<SolarResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const isDemo = calculatorId === "demo"
    if (!user && !isDemo) return { success: false, error: "Unauthorized", errorType: 'UNAUTHORIZED' }

    // Verify Pro Tier or Trial
    let isAuthorized = true
    if (!isDemo && user) {
      const { data: profile } = await supabase
        .from('users')
        .select('is_pro, trial_ends_at, subscription_status')
        .eq('id', user.id)
        .single()
      
      const isPastDue = profile?.subscription_status === 'past_due'
      const trialExpired = profile?.trial_ends_at && new Date(profile.trial_ends_at) < new Date()
      
      // If payment status is active pro, OR if they are still in valid trial and not past due
      isAuthorized = profile?.is_pro || (profile?.trial_ends_at && !trialExpired && !isPastDue)
    }

    if (!isAuthorized) {
      return { success: false, error: "Active subscription or trial required", errorType: 'PRO_REQUIRED' }
    }

    if (!GOOGLE_MAPS_API_KEY || isDemo) {
       const isMockFail = address.toLowerCase().includes("fail")
       if (isMockFail) return { success: false, error: "No solar data available", errorType: 'NO_DATA' }

       console.warn("GOOGLE_MAPS_API_KEY missing or Demo mode. Returning mock data.")
       await new Promise(r => setTimeout(r, 1500))
       return { 
         success: true,
         areaSqFt: 2450, 
         formattedAddress: address.includes(",") ? address : `${address}, Austin, TX, USA`
       }
    }

    // 1. Geocode address to coordinates
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    const geoRes = await fetch(geoUrl)
    const geoData = await geoRes.json()

    if (geoData.status !== "OK") {
      return { success: false, error: `Geocoding error: ${geoData.status}`, errorType: 'API_ERROR' }
    }

    const { lat, lng } = geoData.results[0].geometry.location
    const formattedAddress = geoData.results[0].formatted_address

    // 2. Call Google Solar Building Insights
    // Added requiredQuality=BASE to improve coverage in areas without high-res 3D imagery
    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=BASE&key=${GOOGLE_MAPS_API_KEY}`
    const solarRes = await fetch(solarUrl)
    const solarData = await solarRes.json()

    if (solarData.error) {
      console.error("Solar API Error Response:", solarData.error)
      return { success: false, error: solarData.error.message || "Solar API error", errorType: 'API_ERROR' }
    }

    const potential = solarData.solarPotential
    if (!potential) {
      console.warn(`No solarPotential found for coordinates: ${lat}, ${lng}`)
      return { success: false, error: "No solar data available", errorType: 'NO_DATA' }
    }

    // wholeRoofStats is the part Google is confident is roof.
    // buildingStats is the entire building footprint (useful fallback).
    const stats = potential.wholeRoofStats || potential.buildingStats
    
    if (!stats || !stats.areaMeters2) {
      console.warn(`No area stats found in solarPotential for: ${lat}, ${lng}`)
      return { success: false, error: "No solar data available", errorType: 'NO_DATA' }
    }

    // Convert sq meters to sq ft (1 m2 = 10.7639 ft2)
    const areaM2 = stats.areaMeters2
    const areaSqFt = Math.round(areaM2 * 10.7639)

    return { 
      success: true,
      areaSqFt, 
      formattedAddress
    }
  } catch (error: any) {
    console.error("Solar API Internal Error:", error)
    return { success: false, error: error.message || "Internal failure", errorType: 'API_ERROR' }
  }
}

export async function getRoofEstimation(address: string, calculatorId?: string): Promise<SolarResult> {
  return getRoofEstimationInternal(address, calculatorId)
}
