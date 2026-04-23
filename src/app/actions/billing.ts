"use server"

import { createClient } from "@/utils/supabase/server"
import DodoPayments from 'dodopayments'

import { headers } from 'next/headers'

const MODE = process.env.DODO_PAYMENTS_MODE || 'test'
const IS_LIVE = MODE === 'live'

const DODO_API_KEY = IS_LIVE 
  ? process.env.DODO_PAYMENTS_LIVE_API_KEY 
  : process.env.DODO_PAYMENTS_TEST_API_KEY

const DODO_COLLECTION_ID = IS_LIVE 
  ? process.env.DODO_PRO_LIVE_COLLECTION_ID 
  : process.env.DODO_PRO_TEST_COLLECTION_ID

const dodo = new DodoPayments({
  bearerToken: DODO_API_KEY,
  environment: IS_LIVE ? 'live_mode' : 'test_mode',
})

export async function createDodoCheckoutSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  if (!DODO_API_KEY || !DODO_COLLECTION_ID) {
    console.error("[Billing] Missing Dodo configuration keys.")
    return { url: "#billing-keys-not-configured" }
  }

  const headersList = await headers()
  const host = headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') || 'http'
  const dynamicAppUrl = `${proto}://${host}`

  try {
    console.log(`[Billing] Attempting checkout for: ${user.email} on ${dynamicAppUrl}`)
    
    const { data: profile } = await supabase
      .from("users")
      .select("trial_ends_at")
      .eq("id", user.id)
      .single()

    const trialDays = profile?.trial_ends_at 
      ? Math.max(1, Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : 14

    const sessionSettings: any = {
      product_collection_id: DODO_COLLECTION_ID,
      product_cart: [], // Required even for collection-based checkouts
      customer: {
        email: user.email!,
        name: user.email?.split("@")[0] ?? "Customer",
      },
      metadata: {
        user_id: user.id,
      },
      return_url: `${dynamicAppUrl}/settings?billing=success`,
    }

    console.log("[Billing] Creating Dodo session (Collection Mode) with:", JSON.stringify(sessionSettings, null, 2))
    
    // Note: Dodo often requires trial periods to be set in the Dashboard for collections.
    // Top-level subscription_data can trigger 422 if the collection isn't strictly recognized as sub-only at this step.
    const session = await dodo.checkoutSessions.create(sessionSettings)

    if (!session || !session.checkout_url) {
      throw new Error("Dodo Payments did not return a valid checkout URL")
    }

    console.log("[Billing] Collection Session created successfully:", session.checkout_url)
    return { url: session.checkout_url }
  } catch (error: any) {
    console.error("[Billing] Dodo SDK Error Detailed:", {
      message: error.message,
      name: error.name,
      code: error.code,
      status: error.status,
      rawBody: error.rawBody // Some SDKs provide this
    })
    
    // Check for specific error types if needed
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
    .select("is_pro, trial_ends_at, subscription_status")
    .eq("id", user.id)
    .single()

  return {
    userId: user.id,
    email: user.email ?? "",
    isPro: profile?.is_pro ?? false,
    trialEndsAt: profile?.trial_ends_at ?? null,
    subscriptionStatus: profile?.subscription_status ?? 'trialing'
  }
}

