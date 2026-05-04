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

  // Events that should sync the current status without necessarily downgrading
  const syncEvents = [
    "subscription.updated",
    "subscription.cancelled", // Cancelled in Dodo means "will not renew", but may still be active until end of period
  ]

  // Events that definitively end access
  const deactivatingEvents = [
    "subscription.expired",
    "subscription.failed",
  ]

  if ([...activatingEvents, ...syncEvents, ...deactivatingEvents].includes(eventType)) {
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
      data.customer_id ??
      ""

    if (userId) {
      const admin = createAdminClient()
      
      // Determine new state
      const isPro = activatingEvents.includes(eventType) || (eventType === 'subscription.updated' && data.status === 'active')
      const isDeactivating = deactivatingEvents.includes(eventType)
      const newStatus = data.status || (activatingEvents.includes(eventType) ? 'active' : undefined)
      
      const nextBillingDate = (payload.data as any).next_billing_date
      const productId = (payload.data as any).product_id

      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (activatingEvents.includes(eventType)) {
        updateData.is_pro = true
        updateData.subscription_status = 'active'
        if (nextBillingDate) updateData.subscription_period_end = nextBillingDate
        if (productId) updateData.plan_id = productId
      } else if (deactivatingEvents.includes(eventType)) {
        updateData.is_pro = false
        updateData.subscription_status = eventType === 'subscription.expired' ? 'expired' : 'failed'
        if (nextBillingDate) updateData.subscription_period_end = nextBillingDate
      } else if (eventType === 'subscription.updated' || eventType === 'subscription.cancelled') {
        // Just sync status, don't flip is_pro unless status explicitly says so
        if (newStatus) updateData.subscription_status = newStatus
        if (newStatus === 'active') updateData.is_pro = true
        if (newStatus === 'expired') updateData.is_pro = false
        if (nextBillingDate) updateData.subscription_period_end = nextBillingDate
        if (productId) updateData.plan_id = productId
      }

      const { error } = await admin
        .from("users")
        .update(updateData)
        .eq("id", userId)

      if (error) {
        console.error(`[Webhook] Error updating user ${userId}:`, error.message)
        return NextResponse.json({ error: "DB update failed" }, { status: 500 })
      }

      console.log(`[Webhook] ✅ SUCCESS: Processed ${eventType} for ${userId}. New status: ${updateData.subscription_status}, Pro: ${updateData.is_pro}, Period End: ${updateData.subscription_period_end}`)
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
