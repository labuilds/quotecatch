import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/calculators'

  const callbackError = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (callbackError || errorDescription) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription || callbackError || 'Authentication failed')}`
    )
  }

  if (code) {
    // Build a redirect response first so @supabase/ssr can write the session
    // cookies onto it via setAll — critical for PKCE to work in Next.js.
    const redirectUrl = `${origin}${next}`
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Write session cookies onto the redirect response so the browser
            // receives them on the way to /calculators.
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Check for checkout intent cookie
      const intent = request.cookies.get('checkout_intent')?.value
      
      if (intent === 'pro') {
        const checkoutResponse = NextResponse.redirect(`${origin}/api/checkout/init`)
        // Clear intent and preserve session cookies
        request.cookies.getAll().forEach(c => {
           if (c.name.startsWith('sb-')) { // Basic heuristic for session cookies
              checkoutResponse.cookies.set(c.name, c.value, { path: '/' })
           }
        })
        checkoutResponse.cookies.set('checkout_intent', '', { maxAge: 0 })
        return checkoutResponse
      }
      
      return response
    }

    // Friendly error transformation
    let friendlyError = error.message
    if (error.message.includes("code verifier not found") || error.message.includes("PKCE")) {
      friendlyError = "Sign-in link expired or opened in a different browser. Please use the original browser window or copy/paste the link manually."
    }

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(friendlyError)}`
    )
  }

  return NextResponse.redirect(`${origin}/login?error=Missing_Auth_Code`)
}
