"use client"

import { useState } from "react"
import { Zap, Clock } from "lucide-react"
import { UpgradeModal } from "@/components/UpgradeModal"
import { createDodoCheckoutSession } from "@/app/actions/billing"


export function SidebarUpgradeCard({ trialDaysRemaining = 14 }: { trialDaysRemaining?: number }) {
  const [showModal, setShowModal] = useState(false)

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    try {
      const { url, error } = await createDodoCheckoutSession(plan)
      if (error) {
        alert(error)
        return
      }
      if (!url || url.startsWith("#")) {
        alert(`Billing for ${plan} is not configured. Please add DODO_PRO_${plan.toUpperCase()}_LIVE_ID to your environment variables.`)
        return
      }
      window.location.href = url
    } catch (error) {
      console.error(error)
      alert("Could not start checkout: " + (error instanceof Error ? error.message : "Please check your network or configuration."))
    }
  }

  return (
    <>
      <div className="group relative overflow-hidden w-full rounded-[32px] bg-white border border-slate-200/60 p-5 shadow-sm transition-all duration-700 hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-slate-50/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 flex items-center justify-center shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50/80 backdrop-blur-md rounded-full border border-red-100/50">
               <Clock className="w-3.5 h-3.5 text-red-600" />
               <span className="text-[11px] font-semibold text-red-600 uppercase tracking-[0.12em]">{trialDaysRemaining} {trialDaysRemaining === 1 ? 'day' : 'days'} left</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[20px] font-semibold text-[#0F172A] tracking-tight leading-tight">
              Unlock Full Access
            </p>
            <p className="text-[16px] text-slate-600 font-medium leading-relaxed">
              Scale your roofing business with satellite measurement tech.
            </p>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="w-full h-14 bg-white border border-slate-900/80 hover:bg-slate-50 text-slate-900 hover:text-slate-950 text-[15px] font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">
              Upgrade Now
              <Clock className="w-4 h-4 opacity-40 group-hover/btn:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>
        
        {/* Atmospheric Glows */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-red-500/10 transition-colors duration-700" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
      </div>

      <UpgradeModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onUpgrade={handleUpgrade}
        trialDaysRemaining={trialDaysRemaining}
      />
    </>
  )
}
