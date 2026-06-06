import { createDodoCheckoutSession } from "@/app/actions/billing"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const planParam = searchParams.get('plan')
    const plan: 'monthly' | 'yearly' = planParam === 'monthly' ? 'monthly' : 'yearly'
    const session = await createDodoCheckoutSession(plan)
    
    if (session?.url && !session.url.startsWith("#")) {
      return NextResponse.redirect(session.url)
    }
    
    // If billing keys are missing or creation failed, fallback to landing page
    const fallbackUrl = new URL("/", request.url)
    fallbackUrl.searchParams.set("error", "billing_failed")
    return NextResponse.redirect(fallbackUrl)
  } catch (error) {
    console.error("[Checkout Init Error]:", error)
    const fallbackUrl = new URL("/", request.url)
    fallbackUrl.searchParams.set("error", "billing_failed")
    return NextResponse.redirect(fallbackUrl)
  }
}
