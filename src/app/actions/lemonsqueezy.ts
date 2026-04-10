"use server"

import { createClient } from "@/utils/supabase/server"

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID
const PRO_VARIANT_ID = process.env.LEMONSQUEEZY_PRO_VARIANT_ID // e.g. "492013"

export async function createCheckoutSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID || !PRO_VARIANT_ID) {
    console.warn("LemonSqueezy config missing. Returning mock checkout URL.")
    return { url: "https://test.lemonsqueezy.com/checkout/buy/mock" }
  }

  try {
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": `Bearer ${LEMONSQUEEZY_API_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: user.email,
              custom: {
                user_id: user.id
              }
            }
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: LEMONSQUEEZY_STORE_ID
              }
            },
            variant: {
              data: {
                type: "variants",
                id: PRO_VARIANT_ID
              }
            }
          }
        }
      })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.detail || "Failed to create checkout session")
    }

    return { url: data.data.attributes.url }
  } catch (error: any) {
    console.error("LemonSqueezy Error:", error)
    throw new Error(error.message || "Failed to initialize checkout.")
  }
}
