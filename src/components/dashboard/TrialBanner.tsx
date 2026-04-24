"use client"

import { Clock } from "lucide-react"
import { createDodoCheckoutSession } from "@/app/actions/billing"
import { useState } from "react"
import { UpgradeModal } from "@/components/UpgradeModal"

export function TrialBanner({ trialEndsAt }: { trialEndsAt: string }) {
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const ends = new Date(trialEndsAt)
  const now = new Date()
  const diffMs = ends.getTime() - now.getTime()
  const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  
  if (diffMs < 0) return null

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true)
    try {
      const { url } = await createDodoCheckoutSession(plan)
      if (url && !url.startsWith("#")) {
        window.location.href = url
        return
      }
      alert(`Billing for ${plan} is not configured.`)
    } catch (e: any) {
      console.error(e)
      alert("Could not start checkout: " + (e.message || "Unknown error"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="relative group">
          {/* Pro Red atmospheric glow */}
          <div className="absolute -inset-2 bg-red-500/10 rounded-[2.5rem] blur-3xl opacity-100 transition duration-1000"></div>
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-400/20 rounded-full blur-xl animate-pulse" />
          
          <div className="relative bg-white/40 backdrop-blur-2xl border border-white/40 rounded-[2.2rem] p-6 shadow-[0_20px_60px_rgba(185,28,28,0.12)] flex flex-col items-center gap-5 min-w-[300px] ring-1 ring-red-500/10 overflow-hidden">
            {/* Subtle red tint overlay */}
            <div className="absolute inset-0 bg-red-500/[0.04] pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center shrink-0 border border-red-600/10 shadow-inner">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-red-900/40 uppercase tracking-[0.15em] leading-none">Trial Status</p>
                <p className="text-[20px] font-semibold text-slate-950 tracking-tight">
                  {diffDays} {diffDays === 1 ? 'day' : 'days'} left
                </p>
              </div>
            </div>
            
            <div className="relative z-10 w-full h-[1px] bg-red-900/5" />
            
            <div className="relative z-10 w-full flex items-center justify-between gap-6">
              <p className="text-[15px] font-semibold text-slate-600 leading-tight max-w-[130px]">
                No commitment. You won't be charged for {diffDays} days.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 bg-slate-950 text-white text-[15px] font-semibold rounded-xl transition-all hover:bg-black hover:scale-[1.05] active:scale-[0.95] cursor-pointer whitespace-nowrap shadow-2xl shadow-black/20"
              >
                Activate Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onUpgrade={handleUpgrade}
        trialDaysRemaining={diffDays}
      />
    </>
  )
}
