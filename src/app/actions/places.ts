"use server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

const FETCH_TIMEOUT = 8000 // 8 seconds for autocomplete

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(id)
    return response
  } catch (error: any) {
    clearTimeout(id)
    if (error.name === 'AbortError') {
      throw new Error('Autocomplete request timed out')
    }
    throw error
  }
}

export async function getAddressSuggestions(input: string) {
  if (!input || input.length < 3) return []
  if (!GOOGLE_MAPS_API_KEY) return []

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=address&key=${GOOGLE_MAPS_API_KEY}`
    
    const response = await fetchWithTimeout(url)
    const data = await response.json()

    if (data.status !== "OK") {
      if (data.status !== "ZERO_RESULTS") {
        console.error(`[PlacesAction] API error: ${data.status}${data.error_message ? ` - ${data.error_message}` : ""}`)
      }
      return []
    }

    return data.predictions.map((p: any) => ({
      description: p.description,
      placeId: p.place_id
    }))
  } catch (error: any) {
    console.error("[PlacesAction] Fetch failed:", error.message)
    return []
  }
}

