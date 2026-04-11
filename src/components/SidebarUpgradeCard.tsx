"use client"

import { useState } from "react"
import { Zap } from "lucide-react"
import { UpgradeModal } from "@/components/UpgradeModal"
import { createDodoCheckoutSession } from "@/app/actions/billing"


export function SidebarUpgradeCard() {
  const [showModal, setShowModal] = useState(false)

  const handleUpgrade = async () => {
    try {
      const { url } = await createDodoCheckoutSession()
      if (!url || url.startsWith("#")) {
        alert("Billing is not configured. Please add DODO_PAYMENTS_API_KEY and DODO_PRO_PRODUCT_ID to your environment variables.")
        return
      }
      window.location.href = url
    } catch (error) {
      console.error(error)
      alert("Could not start checkout. Please check your internet connection and try again.")
    }

  }

  return (
    <>
      <div className="relative overflow-hidden w-full rounded-[24px] bg-[#0F172A] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            </div>
            <p className="text-[16px] font-black text-white">Go Pro</p>
          </div>
          <p className="text-[14px] text-slate-400 font-medium leading-relaxed mb-4">
            Remove branding, unlock satellite data, and CRM webhooks.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full h-11 bg-white text-[#0F172A] text-[14px] font-black rounded-xl hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Upgrade Now
          </button>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-500/10 rounded-full blur-2xl" />
      </div>

      <UpgradeModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onUpgrade={handleUpgrade}
      />
    </>
  )
}
