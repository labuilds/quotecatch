"use server"

import { createClient } from "@/utils/supabase/server"

const DODO_API_KEY = process.env.DODO_PAYMENTS_API_KEY
const DODO_PRODUCT_ID = process.env.DODO_PRO_PRODUCT_ID
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export async function createDodoCheckoutSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Graceful fallback during local development when keys aren't set yet
  if (!DODO_API_KEY || !DODO_PRODUCT_ID) {
    console.warn("[Billing] Dodo Payments config missing — returning mock URL.")
    return { url: "#billing-keys-not-configured" }
  }

  console.log("[Billing] Creating session for product:", DODO_PRODUCT_ID)
  
  const res = await fetch("https://api.dodopayments.com/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DODO_API_KEY}`,
    },
    body: JSON.stringify({
      billing: {
        city: "",
        country: "US",
        state: "",
        street: "",
        zipcode: "",
      },
      customer: {
        email: user.email,
        name: user.email?.split("@")[0] ?? "Customer",
        // Pass Supabase user ID so the webhook can look up the right user
        customer_reference: user.id,
      },
      metadata: {
        user_id: user.id,
      },
      payment_link: true,
      product_id: DODO_PRODUCT_ID,
      quantity: 1,
      return_url: `${APP_URL}/settings?billing=success`,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error("[Billing] Dodo error:", body)
    throw new Error("Failed to create Dodo Payments checkout session.")
  }

  const data = await res.json()

  // Dodo returns payment_link.url when payment_link: true
  const url: string =
    data.payment_link?.url ??
    data.payment_link ??
    data.url ??
    "#"

  return { url }
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
