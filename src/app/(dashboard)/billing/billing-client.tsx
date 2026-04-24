"use client"

import { useState } from "react"
import {
  CreditCard, CheckCircle2, Zap, Globe, ArrowRight,
  ShieldCheck, Check, Loader2, Sparkles, Crown, Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createDodoCheckoutSession } from "@/app/actions/billing"

const proFeatures = [
  "Remote Satellite measurements (Google Solar API)",
  "Full Qualified Leads with Property Specs",
  "Company Branding & Logo Setup",
  "Unlimited Smart Pricing Engines",
  "Zapier & CRM integrations",
  "Priority support & analytics",
]

export function BillingClient({
  isPro,
  email,
  justUpgraded,
}: {
  isPro: boolean
  email: string
  justUpgraded: boolean
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const { url } = await createDodoCheckoutSession()
      
      if (!url || url.startsWith("#")) {
        alert("Billing is not configured. Please add DODO_PAYMENTS_LIVE_API_KEY and DODO_PRO_LIVE_COLLECTION_ID to your environment variables.")
        setIsLoading(false)
        return
      }
      
      window.location.href = url
    } catch (err) {
      console.error(err)
      alert("Could not start checkout: " + (err instanceof Error ? err.message : "Please check your network or Dodo configuration."))
      setIsLoading(false)
    }

  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-[36px] font-black tracking-tighter text-[#0F172A] leading-tight">
          Subscription & Billing
        </h1>
        <p className="text-slate-500 font-medium text-[16px] mt-1">
          Manage your QuoteCatch premium access.
        </p>
      </div>

      {/* Success Banner */}
      {justUpgraded && (
        <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-3xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-emerald-900 text-[17px]">Welcome to the Pro Satellite! 🎉</p>
            <p className="text-emerald-700 font-medium text-[14px] mt-0.5">
              Your subscription is now active. All Pro features have been unlocked.
            </p>
          </div>
        </div>
      )}

      {isPro ? (
        /* ─── PRO STATE ─── */
        <div className="space-y-6">
          <section className="bg-[#0F172A] rounded-[32px] p-8 relative overflow-hidden shadow-2xl shadow-red-900/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-red-400 fill-red-400/30" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[22px] font-black text-white">Pro Satellite</p>
                    <span className="text-[11px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-slate-400 font-medium text-[14px]">$49 / month · Premium Access</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {proFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-[14px] font-bold text-slate-200">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-[18px] font-black text-[#0F172A] mb-2">Manage Account</h3>
            <p className="text-slate-500 font-medium text-[14px] mb-6 leading-relaxed">
              To update your billing info, download invoices, or cancel your plan, please contact us at{" "}
              <a href="mailto:hello@getquotecatch.com" className="text-red-700 font-bold hover:underline">
                hello@getquotecatch.com
              </a>.
            </p>
            <div className="flex items-center gap-3 text-[13px] text-slate-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure payments via Dodo Payments
            </div>
          </section>
        </div>
      ) : (
        /* ─── TRIAL/NON-PRO STATE ─── */
        <div className="space-y-8">
          {/* Trial Status Card */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-slate-500" />
              </div>
              <h3 className="text-[18px] font-black text-[#0F172A]">Account Status</h3>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 rounded-[28px] border border-slate-100 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[20px] font-black text-slate-900">14-Day Free Trial</p>
                  <span className="text-[11px] font-black uppercase tracking-widest bg-white border border-slate-200 px-2.5 py-1 rounded-full text-slate-400">
                    Active
                  </span>
                </div>
                <p className="text-[15px] text-slate-500 font-bold leading-relaxed">
                  You have full unrestricted access to satellite measurements and all premium features.
                </p>
              </div>
            </div>

            <div className="space-y-4 max-w-lg">
              <p className="text-[14px] font-bold text-slate-400 uppercase tracking-widest">Included in your trial:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proFeatures.slice(0, 4).map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-[13px] font-bold text-slate-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Locked Pro Card */}
          <section className="bg-[#0F172A] rounded-[32px] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-red-900/20 border border-red-500/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="relative z-10">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-400 fill-red-400/30" />
                  </div>
                  <div>
                    <p className="text-[24px] font-black text-white">Unlock Lifetime Pro</p>
                    <p className="text-slate-400 font-bold text-[15px]">$49 / month</p>
                  </div>
                </div>

                <p className="text-slate-300 font-medium text-[16px] leading-relaxed mb-8">
                  Keep your satellite power after the trial and stop climbing roofs forever. Move leads straight to your CRM and professionalize your sales process.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Button
                    onClick={handleUpgrade}
                    disabled={isLoading}
                    className="w-full sm:w-auto h-16 px-10 bg-white text-[#0F172A] font-black text-[18px] rounded-2xl hover:bg-slate-50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-2xl border-none flex items-center gap-2 relative overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    {isLoading ? (
                      <span className="relative z-10 flex items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /> Connecting...</span>
                    ) : (
                      <span className="relative z-10 flex items-center gap-2"><Sparkles className="w-6 h-6 text-red-500" /> Upgrade to Pro Lifetime <ArrowRight className="w-5 h-5 ml-1" /></span>
                    )}
                  </Button>
                  <p className="text-slate-400 font-bold text-[14px] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Trusted by 500+ roofers
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
