"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Zap, Globe, X, ArrowRight, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: () => void
}

const features = {
  free: [
    "Unlimited lead generation",
    "Ballpark estimation cards",
    "Instant lead notifications",
    "1 Active Pricing Engine",
  ],
  pro: [
    "Unlimited leads & engines",
    "High-Resolution Satellite measurements",
    "Custom branding & badge removal",
    "Zapier & CRM integrations",
    "Priority support & insights",
  ],
}

export function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
          style={{ zIndex: 9999999, isolation: "isolate" }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Shell */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 380 }}
            className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_40px_120px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
            style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all group cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-500 group-hover:text-slate-900" />
            </button>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              {/* Header */}
              <div className="px-6 pt-8 pb-6 sm:px-10 sm:pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-4">
                  <Star className="w-3.5 h-3.5 text-red-700 fill-red-700" />
                  <span className="text-[12px] font-black text-red-800 uppercase tracking-widest">Premium Growth Toolkit</span>
                </div>
                <h2 className="text-[28px] sm:text-[38px] font-black text-[#0F172A] tracking-tighter leading-none mb-3">
                  Unlock the <span className="text-red-700">Pro Satellite.</span>
                </h2>
                <p className="text-[15px] text-slate-500 font-medium max-w-lg leading-relaxed">
                  Stop climbing roofs for free. Unlock remote satellite measurements, custom branding removal, and seamless CRM integrations.
                </p>
              </div>

              {/* Pricing grid */}
              <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Free tier */}
                  <div className="relative rounded-3xl p-6 border border-slate-100 bg-white flex flex-col">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                      <Globe className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-[20px] font-black text-slate-900 tracking-tight mb-1">Basic Estimator</h3>
                    <p className="text-[14px] text-slate-500 font-medium mb-4">Stop driving to tire-kickers. Build trust with ballpark pricing.</p>
                    <div className="mb-5 flex items-baseline gap-1">
                      <span className="text-[40px] font-black text-slate-900 tracking-tighter">$0</span>
                      <span className="text-[15px] font-bold text-slate-400">/mo</span>
                    </div>
                    <div className="space-y-3 mb-6 flex-1">
                      {features.free.map(f => (
                        <div key={f} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-emerald-500" />
                          </div>
                          <span className="text-[14px] font-bold text-slate-600">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      disabled
                      className="w-full h-12 rounded-2xl font-black text-[14px] border-slate-200 text-slate-400 cursor-not-allowed"
                    >
                      Current Plan
                    </Button>
                  </div>

                  {/* Pro tier */}
                  <div className="relative rounded-3xl p-6 border border-red-500/20 bg-[#0F172A] flex flex-col shadow-[0_24px_60px_rgba(185,28,28,0.18)] ring-1 ring-red-500/20">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-700 to-red-500 text-white text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 shadow-sm">
                      <Zap className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-[20px] font-black text-white tracking-tight mb-1">Pro Satellite</h3>
                    <p className="text-[14px] text-slate-400 font-medium mb-4">Exact square footage and leads pushed straight to your CRM.</p>
                    <div className="mb-5 flex items-baseline gap-1">
                      <span className="text-[40px] font-black text-white tracking-tighter">$49</span>
                      <span className="text-[15px] font-bold text-slate-400">/mo</span>
                    </div>
                    <div className="space-y-3 mb-6 flex-1">
                      {features.pro.map(f => (
                        <div key={f} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-red-400" />
                          </div>
                          <span className="text-[14px] font-bold text-slate-200">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={onUpgrade}
                      className="w-full h-12 rounded-2xl font-black text-[15px] bg-white text-[#0F172A] hover:bg-slate-50 border-none shadow-xl cursor-pointer"
                    >
                      Upgrade to Pro Satellite <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                </div>
              </div>
            </div>

            {/* ── Pinned footer ── */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-center bg-white shrink-0">
              <p className="text-[13px] font-bold text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                7-day money-back guarantee. No questions asked.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
