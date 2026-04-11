"use server"

import { createClient } from "@/utils/supabase/server"
import DodoPayments from 'dodopayments'

const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY
const DODO_PRODUCT_ID = process.env.DODO_PRO_PRODUCT_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

// Determine environment based on API key prefix or NODE_ENV
// Dodo API keys usually start with 'dp_test_' or 'dp_live_'
const environment = DODO_API_KEY?.startsWith('dp_live_') ? 'live_mode' : 'test_mode'

const dodo = new DodoPayments({
  bearerToken: DODO_API_KEY,
  environment: 'test_mode', // Forced to test_mode as requested
})

export async function createDodoCheckoutSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  if (!DODO_API_KEY || !DODO_PRODUCT_ID) {
    console.error("[Billing] Missing Dodo configuration keys.")
    return { url: "#billing-keys-not-configured" }
  }

  try {
    console.log(`[Billing] Attempting TEST MODE checkout for: ${user.email}`)
    
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: DODO_PRODUCT_ID,
          quantity: 1,
        },
      ],
      customer: {
        email: user.email!,
        name: user.email?.split("@")[0] ?? "Customer",
      },
      metadata: {
        user_id: user.id,
      },
      return_url: `${APP_URL}/settings?billing=success`,
    })

    console.log("[Billing] Session created successfully:", session.checkout_url)
    return { url: session.checkout_url }
  } catch (error: any) {
    // Log the full error for debugging in the terminal
    console.error("[Billing] Dodo SDK Error Details:", {
      message: error.message,
      status: error.status,
      name: error.name,
      // Some SDKs include specific properties for 401s, etc.
    })
    
    throw new Error(`Billing Error: ${error.message || "Unknown checkout error"}`)
  }
}


export async function getUserBillingStatus() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("users")
    .select("is_pro")
    .eq("id", user.id)
    .single()

  return {
    userId: user.id,
    email: user.email ?? "",
    isPro: profile?.is_pro ?? false,
  }
}

