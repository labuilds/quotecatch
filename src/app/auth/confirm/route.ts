import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * Route Handler for Supabase Auth Confirmation (Magic Links / PKCE)
 * This handles the transition from a mobile browser context to the app's secure session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/calculators'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Verification successful, redirect to the dashboard or requested page
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Verification failed or parameters missing, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+magic+link`)
}
