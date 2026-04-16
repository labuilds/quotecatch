import { NextRequest, NextResponse } from "next/server"
import { createHmac, timingSafeEqual } from "crypto"
import { createAdminClient } from "@/utils/supabase/admin"

const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET ?? ""

/**
 * Verify Dodo Payments webhook signature.
 * Dodo sends: Webhook-Id, Webhook-Timestamp, Webhook-Signature headers.
 * Signed payload: `${webhookId}.${webhookTimestamp}.${rawBody}`
 */
function verifySignature(req: NextRequest, rawBody: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.warn("[Webhook] DODO_WEBHOOK_SECRET not set — skipping verification.")
    return true // Allow through in dev when secret isn't configured yet
  }

  const webhookId = req.headers.get("webhook-id") ?? ""
  const webhookTimestamp = req.headers.get("webhook-timestamp") ?? ""
  const webhookSignature = req.headers.get("webhook-signature") ?? ""

  if (!webhookId || !webhookTimestamp || !webhookSignature) return false

  // Reject replays older than 5 minutes
  const ts = parseInt(webhookTimestamp, 10)
  if (Math.abs(Date.now() / 1000 - ts) > 300) return false

  const signedPayload = `${webhookId}.${webhookTimestamp}.${rawBody}`
  const expectedHmac = createHmac("sha256", WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("base64")

  // Dodo may send multiple comma-separated signatures (v1,BASE64==)
  const signatures = webhookSignature.split(" ")
  return signatures.some((sig) => {
    const sigBase64 = sig.startsWith("v1,") ? sig.slice(3) : sig
    try {
      return timingSafeEqual(
        Buffer.from(expectedHmac),
        Buffer.from(sigBase64)
      )
    } catch {
      return false
    }
  })
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!verifySignature(req, rawBody)) {
    console.error("[Webhook] Invalid signature verification failed.")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const eventType: string = payload.type ?? payload.event_type ?? ""
  console.log(`[Webhook] Processing event: ${eventType}`)

  // Events that confirm a live, paid subscription
  const activatingEvents = [
    "subscription.active",
    "subscription.renewed",
    "payment.succeeded",
    "payment_intent.succeeded",
  ]

  if (activatingEvents.includes(eventType)) {
    // Dodo puts our metadata at different depths depending on event type and API version
    const data = payload.data ?? {}
    const meta =
      data.metadata ??
      payload.metadata ??
      data.object?.metadata ??
      {}

    const userId: string =
      meta.user_id ??
      data.customer?.customer_reference ??
      data.customer_reference ??
      data.customer_id ?? // Fallback if customer_id was used as reference
      ""

    console.log(`[Webhook] Metadata resolution:`, {
      userId,
      hasMeta: Object.keys(meta).length > 0,
      keys: Object.keys(meta)
    })

    if (!userId) {
      console.warn("[Webhook] No user_id found. Check if metadata was passed during checkout. Full payload:", JSON.stringify(payload, null, 2))
      return NextResponse.json({ received: true, warning: "no user_id" }, { status: 200 })
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from("users")
      .upsert({ 
        id: userId,
        is_pro: true, 
        updated_at: new Date().toISOString() 
      }, { onConflict: 'id' })

    if (error) {
      console.error("[Webhook] Supabase upsert error:", error.message)
      return NextResponse.json({ error: "DB upsert failed" }, { status: 500 })
    }

    console.log(`[Webhook] ✅ SUCCESS: User ${userId} upgraded to Pro.`)
  }

  // Handle subscription cancellations / expirations
  const deactivatingEvents = [
    "subscription.cancelled",
    "subscription.expired",
    "subscription.failed",
  ]

  if (deactivatingEvents.includes(eventType)) {
    const meta =
      payload.data?.metadata ??
      payload.metadata ??
      {}

    const userId: string = meta.user_id ?? payload.data?.customer?.customer_reference ?? ""

    if (userId) {
      const admin = createAdminClient()
      await admin
        .from("users")
        .update({ is_pro: false, updated_at: new Date().toISOString() })
        .eq("id", userId)

      console.log(`[Webhook] ℹ️ User ${userId} downgraded to Free.`)
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
