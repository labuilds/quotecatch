"use server"

import { createClient } from "@/utils/supabase/server"

export async function sendSupportEmail(data: {
  message: string
  screenshots?: string[] // array of base64 strings
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.log("--- SUPPORT EMAIL SIMULATION ---")
    console.log("From:", user.email)
    console.log("Message:", data.message)
    if (data.screenshots) console.log(`Has Attachments: ${data.screenshots.length}`)
    return { success: true, simulated: true }
  }

  const attachments = (data.screenshots || []).map((b64, idx) => ({
    filename: `screenshot-${idx + 1}.jpg`,
    content: b64.split(',')[1],
  }))

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'support@getquotecatch.com',
        to: ['contactlaac1@gmail.com'],
        reply_to: user.email,
        subject: `Support Request from ${user.email}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #0f172a;">New Support Message</h2>
            <p><strong>User:</strong> ${user.email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 16px; line-height: 1.6;">
              ${data.message.replace(/\n/g, '<br />')}
            </div>
            ${data.screenshots ? `<p><em>${data.screenshots.length} screenshots attached.</em></p>` : ''}
          </div>
        `,
        attachments
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to send email")
    }

    return { success: true }
  } catch (error: any) {
    console.error("Support email error:", error)
    throw new Error(error.message)
  }
}
