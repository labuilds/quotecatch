import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin') || 'https://getquotecatch.com';

  const sendLeadEmail = async (id: string, email: string, name: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;
    const estimateLink = `${baseUrl}/estimates/${id}`;

    // Fallback simulation if no key is found
    if (!process.env.RESEND_API_KEY) {
      console.log('--- EMAIL SIMULATION (No API Key) ---');
      console.log(`To: ${email} (${name})`);
      console.log(`Link: ${estimateLink}`);
      return;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'estimates@getquotecatch.com', // Replace with your verified domain later
          to: [email],
          subject: `Your Roofing Estimate - ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #0f172a;">Your Estimate is Ready!</h2>
              <p>Hello ${name},</p>
              <p>We've calculated your roofing replacement estimate. You can view your personalized results, financing options, and schedule an inspection by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${estimateLink}" style="background-color: #c2410c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">View My Estimate</a>
              </div>
              <p style="color: #64748b; font-size: 14px;">If you have any questions, simply reply to this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">Sent by QuoteCatch on behalf of your roofing contractor.</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Resend API Error:', error);
      }
    } catch (err) {
      console.error('Failed to send lead email:', err);
    }
  };
  try {
    const { id } = await params;
    const supabase = createAdminClient();
    const body = await request.json();

    const {
      homeowner_name,
      homeowner_email,
      homeowner_phone,
    } = body;

    console.log(`Updating lead ${id} with:`, { homeowner_email, homeowner_name });

    const { data, error } = await supabase
      .from('leads')
      .update({
        homeowner_name,
        homeowner_email,
        homeowner_phone,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("Supabase Update Result Data:", data);

    if (data && data.length > 0) {
      console.log("Found lead record, attempting to send email and trigger webhook...");
      
      // Send email
      await sendLeadEmail(id, homeowner_email, homeowner_name);
      
      // Trigger CRM Webhook (New)
      try {
        const { triggerLeadWebhook } = await import('@/app/actions/integrations');
        await triggerLeadWebhook(data[0]);
      } catch (webhookErr) {
        console.error("Webhook trigger failed:", webhookErr);
      }
    } else {
      console.warn("No lead record found to update (or RLS blocked update). Email/Webhook not sent.");
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
