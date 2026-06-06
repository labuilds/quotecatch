"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShieldCheck, Zap, X, ArrowRight, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade: (plan: 'monthly' | 'yearly') => void
  trialDaysRemaining?: number
}

const features = [
  "Instant satellite roof measurements",
  "Unlimited qualified lead capture",
  "Unlimited active lead capture widgets",
  "Zapier & Webhook integrations",
  "Company Branding & Logo Setup",
  "Priority support & analytics",
]

export function UpgradeModal({ isOpen, onClose, onUpgrade, trialDaysRemaining = 14 }: UpgradeModalProps) {
  const [mounted, setMounted] = useState(false)
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('yearly')

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 380 }}
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden border border-slate-100"
            style={{ maxHeight: "calc(100vh - 5rem)" }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 z-20 w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all border border-slate-200/50 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 overscroll-contain custom-scrollbar">
              {/* Header */}
              <div className="px-8 pt-12 pb-8 sm:px-12 sm:pt-14">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full mb-6">
                  <Star className="w-4 h-4 text-red-600 fill-red-600" />
                  <span className="text-[16px] font-semibold text-red-700 uppercase tracking-widest">Premium Features</span>
                </div>
                
                <h2 className="text-[32px] sm:text-[42px] font-semibold text-[#0F172A] tracking-tighter leading-[1.1] mb-4">
                  Secure your <span className="text-red-700">Pro Plan.</span>
                </h2>
                
                <p className="text-[16px] text-slate-600 font-medium leading-relaxed mb-8">
                  Keep your premium integrations active after your trial ends.
                </p>

                {/* Plan Toggle */}
                <div className="relative flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/50 w-fit mb-8 mx-auto sm:mx-0">
                  <button
                    onClick={() => setInterval('monthly')}
                    className={`relative z-10 px-6 h-10 rounded-xl text-[14px] font-bold transition-colors duration-300 flex items-center justify-center cursor-pointer ${
                      interval === 'monthly' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {interval === 'monthly' && (
                      <motion.div 
                        layoutId="activeCycleModal" 
                        className="absolute inset-0 bg-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.15)] border border-slate-950/10 rounded-xl -z-10" 
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>Monthly</span>
                  </button>
                  <button
                    onClick={() => setInterval('yearly')}
                    className={`relative z-10 px-6 h-10 rounded-xl text-[14px] font-bold transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      interval === 'yearly' ? 'text-white' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {interval === 'yearly' && (
                      <motion.div 
                        layoutId="activeCycleModal" 
                        className="absolute inset-0 bg-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.15)] border border-slate-950/10 rounded-xl -z-10" 
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>Yearly</span>
                    <span className={`inline-flex items-center justify-center text-[10px] leading-none h-5 px-2 rounded-full uppercase tracking-wider font-extrabold shadow-sm transition-colors duration-300 ${
                      interval === 'yearly' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Save 30%
                    </span>
                  </button>
                </div>

                <div className="mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-[48px] font-extrabold text-[#0F172A] tracking-tighter">
                      {interval === 'monthly' ? '$99' : '$69'}
                    </span>
                    <span className="text-[18px] font-semibold text-slate-400">
                      /mo
                    </span>
                    <span className="ml-3 text-[13px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                      {interval === 'monthly' ? 'Month-to-Month' : 'Billed Annually ($828/yr)'}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    {features.map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-red-700 stroke-[3px]" />
                        </div>
                        <span className="text-[15px] font-semibold text-slate-700">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => onUpgrade(interval)}
                    className="w-full h-14 rounded-xl font-bold text-[16px] bg-[#0F172A] text-white hover:bg-black border-none shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    <span className="relative z-10 flex items-center gap-2">
                      Activate Pro Subscription <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </div>
              </div>

              {/* ── Footer ── */}
              <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-center bg-slate-50">
                <p className="text-[15px] font-semibold text-slate-600 flex items-center gap-2 text-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  You won't be charged for {trialDaysRemaining} days. {interval === 'monthly' ? 'Cancel easily anytime.' : 'Secure premium access for the year.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
