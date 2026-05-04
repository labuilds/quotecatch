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
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 380 }}
            className="relative w-full max-w-xl bg-[#0F172A] rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-red-500/20"
            style={{ maxHeight: "calc(100vh - 5rem)" }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 z-20 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1 overscroll-contain custom-scrollbar">
              {/* Header */}
                <div className="px-8 pt-12 pb-8 sm:px-12 sm:pt-14">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                  <Star className="w-4 h-4 text-red-500 fill-red-500" />
                  <span className="text-[16px] font-semibold text-red-400 uppercase tracking-widest">Premium Features</span>
                </div>
                
                <h2 className="text-[32px] sm:text-[42px] font-semibold text-white tracking-tighter leading-[1.1] mb-4">
                  Secure your <span className="text-red-400">Pro Plan.</span>
                </h2>
                
                <p className="text-[16px] text-slate-300 font-medium leading-relaxed mb-8">
                  Keep your premium integrations active after your trial ends.
                </p>

                {/* Plan Toggle */}
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-fit mb-8 mx-auto sm:mx-0">
                  <button
                    onClick={() => setInterval('monthly')}
                    className={`px-6 py-2 rounded-xl text-[16px] font-semibold transition-all ${interval === 'monthly' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setInterval('yearly')}
                    className={`px-6 py-2 rounded-xl text-[16px] font-semibold transition-all flex items-center gap-2 ${interval === 'yearly' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Yearly
                    <span className="text-[12px] bg-red-600 text-white px-2 py-0.5 rounded-full">Save 30%</span>
                  </button>
                </div>

                <div className="mb-10 p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-[48px] font-semibold text-white tracking-tighter">
                      {interval === 'monthly' ? '$99' : '$69'}
                    </span>
                    <span className="text-[18px] font-semibold text-slate-300">
                      /mo
                    </span>
                    <span className="ml-3 text-[16px] font-semibold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded">
                      {interval === 'monthly' ? 'Month-to-Month' : 'Billed Annually ($828/yr)'}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    {features.map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-red-500" />
                        </div>
                        <span className="text-[15px] font-semibold text-slate-200">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => onUpgrade(interval)}
                    className="w-full h-14 rounded-xl font-semibold text-[16px] bg-red-700 text-white hover:bg-red-600 border-none shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                    <span className="relative z-10 flex items-center gap-2">
                      Activate Pro Subscription <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </div>
              </div>

              {/* ── Footer (now inside scroll) ── */}
              <div className="px-8 py-6 border-t border-white/5 flex items-center justify-center bg-white/5">
                <p className="text-[16px] font-semibold text-slate-300 flex items-center gap-2 text-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
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
