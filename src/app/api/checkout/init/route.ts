import { createDodoCheckoutSession } from "@/app/actions/billing"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await createDodoCheckoutSession()
    
    if (session?.url && !session.url.startsWith("#")) {
      return NextResponse.redirect(session.url)
    }
    
    // If billing keys are missing or creation failed, fallback to dashboard
    return NextResponse.redirect(new URL("/dashboard?error=billing_failed", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
  } catch (error) {
    console.error("[Checkout Init Error]:", error)
    return NextResponse.redirect(new URL("/dashboard?error=billing_failed", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
  }
}
