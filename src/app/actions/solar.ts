"use server"

import { createClient } from "@/utils/supabase/server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function getRoofEstimation(address: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Verify Pro Tier
  const { data: profile } = await supabase
    .from('users')
    .select('is_pro')
    .eq('id', user.id)
    .single()

  if (!profile?.is_pro) {
    throw new Error("Pro subscription required for satellite estimation.")
  }

  if (!GOOGLE_MAPS_API_KEY) {
     console.warn("GOOGLE_MAPS_API_KEY missing. Returning mock data for development.")
     // Mock delay and data
     await new Promise(r => setTimeout(r, 2000))
     return { areaSqFt: 2250, city: "Austin", state: "TX" }
  }

  try {
    // 1. Geocode address to coordinates
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    const geoRes = await fetch(geoUrl)
    const geoData = await geoRes.json()

    if (geoData.status !== "OK") {
      throw new Error(`Geocoding error: ${geoData.status}`)
    }

    const { lat, lng } = geoData.results[0].geometry.location
    const formattedAddress = geoData.results[0].formatted_address

    // 2. Call Google Solar Building Insights
    const solarUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&key=${GOOGLE_MAPS_API_KEY}`
    const solarRes = await fetch(solarUrl)
    const solarData = await solarRes.json()

    if (!solarData.wholeRoofStats) {
      throw new Error("No solar data available for this address.")
    }

    // Convert sq meters to sq ft (1 m2 = 10.7639 ft2)
    const areaM2 = solarData.wholeRoofStats.areaMeters2
    const areaSqFt = Math.round(areaM2 * 10.7639)

    return { 
      areaSqFt, 
      formattedAddress,
      raw: solarData.wholeRoofStats 
    }
  } catch (error: any) {
    console.error("Solar API Error:", error)
    throw new Error(error.message || "Failed to fetch property data.")
  }
}
