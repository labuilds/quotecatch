"use server"

import { createClient } from "@/utils/supabase/server"
import DodoPayments from 'dodopayments'

import { headers } from 'next/headers'

const MODE = process.env.DODO_PAYMENTS_MODE || 'test'
const IS_LIVE = MODE === 'live'

const DODO_API_KEY = IS_LIVE 
  ? process.env.DODO_PAYMENTS_LIVE_API_KEY 
  : process.env.DODO_PAYMENTS_TEST_API_KEY

const DODO_PRODUCT_ID = IS_LIVE 
  ? process.env.DODO_PAYMENTS_LIVE_PRODUCT_ID 
  : process.env.DODO_PAYMENTS_TEST_PRODUCT_ID

const dodo = new DodoPayments({
  bearerToken: DODO_API_KEY,
})

export async function createDodoCheckoutSession(plan: 'monthly' | 'yearly' = 'yearly') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const CURRENT_PRODUCT_ID = IS_LIVE 
    ? (plan === 'monthly' ? process.env.DODO_PRO_MONTHLY_LIVE_ID : process.env.DODO_PRO_YEARLY_LIVE_ID)
    : (plan === 'monthly' ? process.env.DODO_PRO_MONTHLY_TEST_ID : process.env.DODO_PRO_YEARLY_TEST_ID)

  if (!DODO_API_KEY || !CURRENT_PRODUCT_ID) {
    console.error(`[Billing] Missing Dodo configuration for ${plan} plan.`)
    return { url: "#billing-keys-not-configured" }
  }

  const headersList = await headers()
  const host = headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') || 'http'
  const dynamicAppUrl = `${proto}://${host}`

  try {
    console.log(`[Billing] Attempting ${plan} checkout for: ${user.email} on ${dynamicAppUrl}`)
    
    // 1. Get user profile for trial calculation
    const { data: profile } = await supabase
      .from("users")
      .select("trial_ends_at")
      .eq("id", user.id)
      .single()

    // 2. Calculate remaining trial days
    const trialDays = profile?.trial_ends_at 
      ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      : 14

    // 3. Configure checkout session with specific product_id and subscription_data
    const sessionSettings: any = {
      product_cart: [{
        product_id: CURRENT_PRODUCT_ID,
        quantity: 1
      }],
      customer: {
        email: user.email!,
        name: user.email?.split("@")[0] ?? "Customer",
      },
      metadata: {
        user_id: user.id,
      },
      subscription_data: trialDays > 0 ? {
        trial_period_days: trialDays
      } : undefined,
      return_url: `${dynamicAppUrl}/settings?billing=success`,
    }

    console.log(`[Billing] Creating Dodo session (${plan}) with:`, JSON.stringify(sessionSettings, null, 2))
    
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

