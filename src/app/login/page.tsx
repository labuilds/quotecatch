"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import { Loader2, ArrowLeft, Shield, TrendingUp, CheckCircle2, Zap } from "lucide-react"
import { QCLogo } from "@/components/QCLogo"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [mounted, setMounted] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const errParam = searchParams.get('error')
    if (errParam) setError(errParam)
  }, [searchParams])

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      setError(null)

      const intent = searchParams.get("intent")
      if (intent === "pro") {
        document.cookie = "checkout_intent=pro; path=/; max-age=3600; SameSite=Lax"
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/calculators`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })

      if (error) throw error
    } catch (err: any) {
      console.error("[Google Login Error]:", err)
      setError(err?.message || "Failed to initialize Google login. Please try again.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-8 sm:px-20 py-12">
      <motion.div className="w-full max-w-[440px] space-y-10">
        <div className="space-y-3">
          <h1 className="text-[44px] font-semibold tracking-tighter text-[#0F172A] leading-[1.1]">
            Welcome back.
          </h1>
          <p className="text-[17px] text-slate-600 font-medium leading-relaxed">
            Log in to your dashboard to manage your widget, view your leads, and close more roofs.
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="p-6 text-[15px] text-red-700 bg-red-50/80 rounded-[2rem] border-2 border-red-100 font-semibold flex flex-col gap-2 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
                  error.toLowerCase().includes('security') || error.toLowerCase().includes('authorized') 
                    ? "bg-red-500" 
                    : "bg-amber-500"
                )} />
                <span className="text-[16px] uppercase tracking-widest text-slate-600 font-semibold">
                  {error.toLowerCase().includes('security') || error.toLowerCase().includes('authorized') 
                    ? "Security Alert" 
                    : "System Notice"}
                </span>
              </div>
              <p className="leading-relaxed pl-4">
                {error}
                {error.includes('magic link email') && (
                  <span className="block mt-2 text-[15px] font-medium text-slate-600">
                    This usually happens if the email provider is busy or you've requested too many links recently. Please try again in 15 minutes or use Google Login.
                  </span>
                )}
              </p>
            </div>
          )}

          {mounted ? (
            <div className="space-y-4">
              <Button
                type="button"
                className="w-full h-16 text-[17px] font-semibold bg-white hover:bg-slate-50 border-2 border-slate-200 text-[#0F172A] rounded-[1.5rem] transition-all hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 flex items-center justify-center gap-4"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                )}
                Continue with Google
              </Button>
            </div>
          ) : (
            <div className="h-[100px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-slate-200" />
            </div>
          )}
        </div>

        <p className="text-center text-[15px] text-slate-600 font-semibold leading-relaxed px-4">
          By joining, you agree to our <Link href="/terms" className="text-slate-900 border-b border-slate-900 hover:text-slate-700 transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-slate-900 border-b border-slate-900 hover:text-slate-700 transition-colors">Privacy Policy</Link>.
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  const stats = [
    { icon: Zap, value: "24/7", label: "Lead Capture" },
    { icon: CheckCircle2, value: "100%", label: "Pre-Qualified" },
    { icon: Shield, value: "Secure", label: "Data Protection" },
  ]

  return (
    <div className="flex min-h-screen w-full bg-white font-sans selection:bg-red-50 selection:text-red-900">
      {/* Left: Auth Panel */}
      <div className="w-full lg:w-[48%] flex flex-col relative z-20 bg-white">
        {/* Top nav */}
        <div className="flex items-center justify-between px-10 py-8">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center transition-all duration-300">
              <QCLogo size={26} isDark={true} />
            </div>
            <span className="text-[20px] font-semibold tracking-tight text-[#0F172A]">QuoteCatch</span>
          </Link>
        </div>

        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-slate-200" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

      {/* Right: Feature Panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col items-center justify-center bg-slate-50 border-l border-slate-200/50">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1635848253029-27ef193d7431?w=1600&q=80"
            alt="Premium Roofing"
            className="w-full h-full object-cover opacity-[0.06] mix-blend-luminosity scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-slate-50/90 to-slate-50/50" />
        </div>

        <div className="relative z-10 px-16 max-w-2xl w-full py-14 space-y-8 text-left">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/50">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(185,28,28,0.4)]" />
              <span className="text-[12px] font-bold text-red-700 tracking-widest uppercase">Built for Roofing Contractors</span>
            </div>
            <h2 className="text-[48px] font-extrabold text-slate-950 leading-[1.15] tracking-tight text-left">
              Stop driving to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-500">tire-kickers.</span>
            </h2>
            <p className="text-[18px] text-slate-600 font-semibold leading-relaxed max-w-md text-left">
              Let your website qualify homeowners and calculate instant ballparks while you sleep.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5 text-left">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 group hover:border-slate-350/50 text-left">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-red-700" />
                </div>
                <p className="text-[22px] font-bold text-slate-950 tracking-tight text-left">{value}</p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 text-left">{label}</p>
              </div>
            ))}
          </div>

          <div className="relative text-left">
            <div className="absolute -inset-4 bg-red-100/10 blur-[80px] pointer-events-none" />
            <div className="relative bg-white border border-slate-200/60 rounded-[2.5rem] p-8 overflow-hidden shadow-xl text-left">
              <div className="flex items-center gap-4 mb-6 text-left">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100/50 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-red-700" />
                </div>
                <div className="text-left">
                  <p className="text-slate-950 font-bold text-[16px] text-left">The QuoteCatch Edge</p>
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider text-left">Why We Built This</p>
                </div>
              </div>
              <p className="text-[17px] text-slate-700 font-medium leading-relaxed italic text-left relative z-10">
                "Your time is your most valuable asset. We built QuoteCatch so you can stop doing free roof inspections for window shoppers, and focus entirely on customers who are ready to buy."
              </p>
              <div className="absolute bottom-4 right-6 opacity-[0.04] z-0 pointer-events-none">
                <Shield className="w-24 h-24 text-red-700 fill-red-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}