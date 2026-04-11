"use client"

import { useState } from "react"
import {
  CreditCard, CheckCircle2, Zap, Globe, ArrowRight,
  ShieldCheck, Check, Loader2, Sparkles, Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createDodoCheckoutSession } from "@/app/actions/billing"

const proFeatures = [
  "Address-Based Google Solar roof measurement",
  "Remove 'Powered by QuoteCatch' branding",
  "Unlimited Pricing Engines",
  "Zapier & Webhook CRM integrations",
  "Priority email support",
]

const freeFeatures = [
  "1 Active Pricing Engine",
  "Manual sq-ft estimation cards",
  "Basic email lead notifications",
  "Standard dashboard access",
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
      if (url.startsWith("#")) {
        alert("Billing is not configured. Please add DODO_PAYMENTS_API_KEY and DODO_PRO_PRODUCT_ID to your .env.local file.")
        setIsLoading(false)
        return
      }
      window.location.href = url
    } catch (err) {
      console.error(err)
      alert("Could not start checkout. Please check your network or Dodo Payments configuration.")
      setIsLoading(false)
    }

  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-[36px] font-black tracking-tighter text-[#0F172A] leading-tight">
          Billing & Plans
        </h1>
        <p className="text-slate-500 font-medium text-[16px] mt-1">
          Manage your QuoteCatch subscription.
        </p>
      </div>

      {/* Success Banner */}
      {justUpgraded && (
        <div className="flex items-center gap-4 p-5 bg-emerald-50 border border-emerald-100 rounded-3xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-emerald-900 text-[17px]">Welcome to the Profit Engine! 🎉</p>
            <p className="text-emerald-700 font-medium text-[14px] mt-0.5">
              Your subscription is now active. All Pro features have been unlocked.
            </p>
          </div>
        </div>
      )}

      {isPro ? (
        /* ─── PRO STATE ─── */
        <div className="space-y-6">
          {/* Active Sub Card */}
          <section className="bg-[#0F172A] rounded-[32px] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-red-400 fill-red-400/30" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[20px] font-black text-white">Profit Engine</p>
                    <span className="text-[11px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-slate-400 font-medium text-[14px]">$49 / month · Billed via Dodo Payments</p>
                </div>
              </div>

              <p className="text-slate-300 font-medium text-[15px] leading-relaxed max-w-lg mb-8">
                Thank you for being a Pro member, <span className="text-white font-bold">{email}</span>. 
                Your satellite-powered estimator and CRM integrations are fully active.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* Manage / Support */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <h3 className="text-[18px] font-black text-[#0F172A] mb-2">Manage Subscription</h3>
            <p className="text-slate-500 font-medium text-[14px] mb-6">
              To cancel or update your payment method, contact us at{" "}
              <a href="mailto:hello@getquotecatch.com" className="text-red-700 font-bold hover:underline">
                hello@getquotecatch.com
              </a>{" "}
              or manage via your Dodo Payments customer portal.
            </p>
            <div className="flex items-center gap-3 text-[13px] text-slate-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secured by Dodo Payments
            </div>
          </section>
        </div>
      ) : (
        /* ─── FREE STATE ─── */
        <div className="space-y-6">
          {/* Current plan */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-slate-500" />
              </div>
              <h3 className="text-[18px] font-black text-[#0F172A]">Current Plan</h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[18px] font-black text-slate-900">Distribution Engine</p>
                  <span className="text-[11px] font-black uppercase tracking-widest border border-slate-200 bg-white px-2 py-0.5 rounded-full text-slate-400">
                    Active
                  </span>
                </div>
                <p className="text-[14px] text-slate-500 font-bold">Free forever · 50 leads/mo · Manual estimation only</p>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-300 shrink-0" />
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {freeFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-[14px] font-bold text-slate-500">{f}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Upgrade CTA */}
          <section className="bg-[#0F172A] rounded-[32px] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-red-400 fill-red-400/30" />
                </div>
                <div>
                  <p className="text-[20px] font-black text-white">Profit Engine</p>
                  <p className="text-slate-400 font-bold text-[14px]">$49 / month</p>
                </div>
              </div>

              <p className="text-slate-300 font-medium text-[15px] leading-relaxed mb-6 max-w-lg">
                Unlock satellite-powered roof measurements, remove our branding from your widget, and push leads directly to your CRM.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {proFeatures.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-[14px] font-bold text-slate-200">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="h-14 px-8 bg-white text-[#0F172A] font-black text-[16px] rounded-2xl hover:bg-slate-50 transition-all hover:scale-[1.02] shadow-xl border-none flex items-center gap-2"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Upgrade Now — $49/mo <ArrowRight className="w-4 h-4 ml-1" /></>
                  )}
                </Button>
                <p className="text-slate-400 font-bold text-[13px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  7-day money-back guarantee
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
