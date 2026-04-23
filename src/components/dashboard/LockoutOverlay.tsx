"use client"

import { Button } from "@/components/ui/button"
import { Lock, Zap, ShieldCheck, BarChart3, Mail } from "lucide-react"
import { createDodoCheckoutSession } from "@/app/actions/billing"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { PricingSection as StreamingPricing } from "@/components/PricingSection"
import { SidebarUpgradeCard } from "@/components/SidebarUpgradeCard"

export function LockoutOverlay() {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const { url } = await createDodoCheckoutSession()
      if (url) window.location.href = url
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-start pt-12 pb-24 px-4 md:px-8">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-red-50 text-red-600 mb-4 shadow-inner ring-1 ring-red-100">
            <Lock className="w-10 h-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-[42px] md:text-[56px] font-black text-[#0F172A] tracking-tighter leading-[0.95]">
              Your trial has ended.
            </h1>
            <p className="text-[18px] md:text-[22px] text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              We hope you enjoyed the satellite roof scans! Upgrade your plan today to unlock the full platform and continue capturing high-value leads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
            {[
              { icon: Zap, label: "Satellite HD Scans", sub: "Precision measurements" },
              { icon: ShieldCheck, label: "Premium Branding", sub: "Company Logo & Identity" },
              { icon: BarChart3, label: "Unlimited Scale", sub: "Unlimited Pricing Engines" },
              { icon: Mail, label: "Integrations", sub: "Zapier & Webhooks" }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <feature.icon className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-[17px] font-black text-slate-900 leading-tight">{feature.label}</p>
                <p className="text-[15px] font-bold text-slate-500 mt-1.5 tracking-wide">{feature.sub}</p>
              </div>
            ))}
          </div>

          <div className="pt-8">
             {/* Re-using the landing page pricing section but in a "forced upgrade" context */}
             <div className="max-w-3xl mx-auto">
                <StreamingPricing isTrialEnded={true} onUpgrade={handleUpgrade} />
             </div>
          </div>

           <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-slate-400 text-sm font-semibold">Questions? Support ready to help at <span className="text-slate-900">support@getquotecatch.com</span></p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="text-slate-400 hover:text-slate-900 text-sm font-bold underline underline-offset-4"
              >
                  Return to Login
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
