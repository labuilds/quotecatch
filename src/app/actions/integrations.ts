"use server"

import { createClient } from "@/utils/supabase/server"

const WEBHOOK_TIMEOUT = 10000 // 10 seconds

export async function triggerLeadWebhook(leadData: any) {
  const supabase = await createClient()
  
  // 1. Get the calculator owner's preferences
  const { data: calc } = await supabase
    .from('calculators')
    .select('user_id')
    .eq('id', leadData.calculator_id)
    .single()

  if (!calc) return

  // 2. Check if the user is PRO and has a webhook URL set
  const { data: user } = await supabase
    .from('users')
    .select('is_pro, webhook_url')
    .eq('id', calc.user_id)
    .single()

  if (!user?.is_pro || !user.webhook_url) {
    return // Skip if not pro or no webhook
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT)

  try {
    console.log(`[Webhook] Triggering for: ${user.webhook_url}`)
    
    // 3. Send the data
    const response = await fetch(user.webhook_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'lead_captured',
        timestamp: new Date().toISOString(),
        data: leadData
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`[Webhook] Failed with status: ${response.status}`)
    } else {
      console.log(`[Webhook] Successfully triggered`)
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      console.error("[Webhook] Timed out after 10s")
    } else {
      console.error("[Webhook] Failed:", error.message)
    }
  }
}

