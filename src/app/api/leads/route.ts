import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      calculator_id,
      homeowner_name,
      homeowner_email,
      homeowner_phone,
      estimated_price,
      address
    } = body;

    // Aggressive override specifically targeting Dashboard visual iframes capturing preview inputs elegantly without invoking UUID throws
    if (calculator_id === 'preview-mode') {
      return NextResponse.json({ success: true, data: { message: "Simulated capture successful" } }, { status: 200, headers: corsHeaders });
    }

    const { data: calc } = await supabase.from('calculators').select('user_id, config_json').eq('id', calculator_id).single();

    const payload = {
      calculator_id,
      user_id: calc?.user_id,
      homeowner_name,
      homeowner_email,
      homeowner_phone,
      estimated_price,
      address,
      pricing_snapshot: calc?.config_json
    };

    let { data, error } = await supabase
      .from('leads')
      .insert([payload]);

    let currentPayload: any = { ...payload };
    let finalData = data;
    let finalError = error;

    // Cascade fallback #1: missing pricing_snapshot
    if (finalError && finalError.message.includes("pricing_snapshot")) {
       console.warn("Schema desync detected on pricing_snapshot. Re-attempting.");
       delete currentPayload.pricing_snapshot;
       const retry = await supabase.from('leads').insert([currentPayload]);
       finalData = retry.data;
       finalError = retry.error;
    }

    // Cascade fallback #2: missing user_id
    if (finalError && finalError.message.includes("user_id")) {
       console.warn("Schema desync detected on user_id. Re-attempting.");
       delete currentPayload.user_id;
       const retry = await supabase.from('leads').insert([currentPayload]);
       finalData = retry.data;
       finalError = retry.error;
    }

    if (finalError) {
      console.error("Supabase Error:", finalError);
      return NextResponse.json({ error: finalError.message }, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, data: finalData }, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}
