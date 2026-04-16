import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const sendNotificationEmails = async (lead: any, request: Request, isDemo: boolean = false) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) return;

  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  try {
    // 1. Notify Founder
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'leads@getquotecatch.com',
        to: ['founder@getquotecatch.com'],
        subject: `New Lead Captured: ${lead.homeowner_name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #0f172a;">New Lead Alert!</h2>
            <p><strong>Name:</strong> ${lead.homeowner_name}</p>
            <p><strong>Email:</strong> ${lead.homeowner_email}</p>
            <p><strong>Phone:</strong> ${lead.homeowner_phone}</p>
            <p><strong>Address:</strong> ${lead.address}</p>
            <p><strong>Estimate:</strong> $${lead.estimated_price?.toLocaleString()}</p>
            <div style="margin-top: 20px;">
              <a href="${baseUrl}/estimates/${lead.id}" style="color: #c2410c; font-weight: bold;">View Estimate Details</a>
            </div>
          </div>
        `,
      }),
    });

    // 2. Notify Homeowner
    if (lead.homeowner_email && lead.homeowner_email !== 'pending@example.com') {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'estimates@getquotecatch.com',
          to: [lead.homeowner_email],
          subject: isDemo ? `Your Demo Roofing Estimate - ${lead.homeowner_name}` : `Your Roofing Estimate - ${lead.homeowner_name}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; border: 1px solid #eee; border-radius: 16px;">
              <h2 style="color: #0f172a; font-size: 24px;">Your Estimate is Ready!</h2>
              <p style="color: #475569; line-height: 1.5;">Hello ${lead.homeowner_name},</p>
              <p style="color: #475569; line-height: 1.5;">We've calculated a roofing replacement estimate for the property at <strong>${lead.address}</strong>.</p>
              
              ${isDemo ? `
              <div style="background-color: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 12px; margin: 25px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  Note: This is a demo estimate. To get real, binding quotes for your roofing project, please <a href="${baseUrl}/login?tab=signup" style="color: #c2410c;">sign up on our platform</a>.
                </p>
              </div>
              ` : ''}

              <div style="text-align: center; margin: 40px 0;">
                <a href="${baseUrl}/estimates/${lead.id}" style="background-color: #000000; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">View Full Estimate Details</a>
              </div>

              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">Sent by QuoteCatch. Use our software to automate your roofing lead capture.</p>
            </div>
          `,
        }),
      });
    }
  } catch (err) {
    console.error('Failed to send lead emails:', err);
  }
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const {
      calculator_id,
      homeowner_name = 'Pending...',
      homeowner_email = 'pending@example.com',
      homeowner_phone = 'Pending...',
      estimated_price,
      address,
      notes
    } = body;

    // Aggressive override specifically targeting Dashboard visual iframes capturing preview inputs elegantly without invoking UUID throws
    if (calculator_id === 'preview-mode') {
      return NextResponse.json({ success: true, id: 'preview-lead-id', data: { message: "Simulated capture successful" } }, { status: 200, headers: corsHeaders });
    }

    const { data: calc } = await supabase
      .from('calculators')
      .select('user_id, config_json')
      .eq('id', calculator_id)
      .single();

    let targetUserId = calc?.user_id;
    let finalCalculatorId = calculator_id === 'demo' ? null : calculator_id;

    // Special case for landing page demo widget
    if (calculator_id === 'demo') {
      let { data: founder } = await supabase
        .from('users')
        .select('id')
        .ilike('email', 'founder@getquotecatch.com')
        .maybeSingle();
      
      // FALLBACK: If founder account doesn't exist yet, get the first available pro user
      if (!founder) {
        const { data: anyUser } = await supabase
          .from('users')
          .select('id')
          .limit(1)
          .maybeSingle();
        founder = anyUser;
      }

      if (founder) {
        targetUserId = founder.id;
        
        // Find or Create a "Landing Page" calculator to satisfy NOT NULL constraints
        let { data: demoCalc } = await supabase
          .from('calculators')
          .select('id')
          .eq('user_id', founder.id)
          .eq('name', 'Main Landing Page')
          .maybeSingle();

        if (!demoCalc) {
          const { data: newCalc } = await supabase
            .from('calculators')
            .insert({
              user_id: founder.id,
              name: 'Main Landing Page',
              config_json: body.form_data?.config || {}
            })
            .select()
            .maybeSingle();
          demoCalc = newCalc;
        }
        
        finalCalculatorId = demoCalc?.id;
      }
    }

    const payload = {
      calculator_id: finalCalculatorId,
      user_id: targetUserId,
      homeowner_name,
      homeowner_email,
      homeowner_phone,
      estimated_price,
      address,
      notes,
      pricing_snapshot: calc?.config_json || (calculator_id === 'demo' ? body.form_data?.config : null)
    };

    let { data, error } = await supabase.from('leads').insert([payload]).select();
    
    let currentPayload = { ...payload };
    let finalData = data;
    let finalError = error;

    // Self-Healing Loop: Strips missing columns and retries until success or non-column error
    const schemaColumns = ['pricing_snapshot', 'user_id', 'notes', 'calculator_id']; // columns we know might be missing
    let attempts = 0;
    
    while (finalError && finalError.message.includes("column") && attempts < 5) {
      const missingColumn = schemaColumns.find(col => finalError?.message.includes(`"${col}"`) || finalError?.message.includes(`'${col}'`));
      
      if (missingColumn) {
        console.warn(`Schema desync: removing '${missingColumn}' and retrying.`);
        delete (currentPayload as any)[missingColumn];
        const retry = await supabase.from('leads').insert([currentPayload]).select();
        finalData = retry.data;
        finalError = retry.error;
        attempts++;
      } else {
        break; // Error is not about one of our known fallbacks
      }
    }

    if (finalError) {
      console.error("Supabase Error:", finalError);
      return NextResponse.json({ error: finalError.message }, { status: 400, headers: corsHeaders });
    }

    // Fire-and-forget email notifications
    if (finalData?.[0]) {
      const isDemoLead = calculator_id === 'demo';
      sendNotificationEmails({ ...finalData[0] }, request, isDemoLead).catch(console.error);
    }

    return NextResponse.json({ success: true, id: finalData?.[0]?.id }, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}
