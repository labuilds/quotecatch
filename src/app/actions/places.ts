"use server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function getAddressSuggestions(input: string) {
  if (!input || input.length < 3) return []
  if (!GOOGLE_MAPS_API_KEY) return []

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=address&key=${GOOGLE_MAPS_API_KEY}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== "OK") {
      console.error(`Places API error: ${data.status}${data.error_message ? ` - ${data.error_message}` : ""}`)
      return []
    }

    return data.predictions.map((p: any) => ({
      description: p.description,
      placeId: p.place_id
    }))
  } catch (error) {
    console.error("Autocomplete fetch failed:", error)
    return []
  }
}
