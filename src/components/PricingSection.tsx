"use client"

import { Check, Zap, Globe, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const ProPlan = {
  name: "Pro Satellite",
  monthlyPrice: "$49",
  yearlyPrice: "$39",
  description: "The complete roofing sales toolkit. Stop climbing roofs and start closing deals from your truck.",
  features: [
    "Instant satellite measurements",
    "Unlimited qualified lead capture",
    "Unlimited active pricing engines",
    "Zapier & Webhook integrations",
    "Company Branding & Logo Setup",
    "Priority support & analytics",
  ],
  buttonText: "Start 14-Day Free Trial",
  highlight: true,
  icon: Zap,
  iconColor: "text-red-400",
  bgColor: "bg-[#0F172A]",
}

interface PricingSectionProps {
  onUpgrade?: () => void;
  showButton?: boolean;
  trialDaysRemaining?: number;
  isTrialEnded?: boolean;
}

export function PricingSection({ 
  onUpgrade, 
  showButton = true, 
  trialDaysRemaining = 14,
  isTrialEnded = false 
}: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      {/* Billing Toggle */}
      <div className="flex items-center gap-6 mb-12 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100 shadow-sm">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-10 py-3.5 rounded-2xl text-[16px] font-black transition-all ${billingCycle === "monthly"
            ? "bg-white text-[#0F172A] shadow-lg ring-1 ring-slate-200"
            : "text-slate-400 hover:text-slate-600"
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`px-10 py-3.5 rounded-2xl text-[16px] font-black transition-all flex items-center gap-3 ${billingCycle === "yearly"
            ? "bg-[#0F172A] text-white shadow-xl"
            : "text-slate-400 hover:text-slate-600"
            }`}
        >
          Yearly
          <span className="text-[13px] bg-emerald-600 text-white px-3 py-1 rounded-full uppercase tracking-widest leading-none font-black shadow-sm">
            -20%
          </span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl rounded-[2.5rem] lg:rounded-[3rem] p-8 lg:p-12 flex flex-col border border-red-500/20 shadow-2xl lg:shadow-[0_40px_80px_rgba(185,28,28,0.15)] ring-1 ring-red-500/30 bg-[#0F172A]"
      >
        {!isTrialEnded && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-700 to-red-500 text-white text-[11px] lg:text-[13px] font-black uppercase tracking-[0.2em] px-5 lg:px-6 py-1.5 lg:py-2 rounded-full shadow-lg whitespace-nowrap">
            {trialDaysRemaining}-Day Free Trial Includes Everything
          </div>
        )}

        <div className="flex flex-col items-start w-full text-left">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-10 shadow-sm bg-white/10 shrink-0">
            <ProPlan.icon className={`w-7 h-7 ${ProPlan.iconColor}`} />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12 w-full text-left">
            <div className="flex-1 text-left">
              <h3 className="text-[28px] lg:text-[40px] font-black tracking-tighter mb-3 text-white leading-tight text-left">
                {ProPlan.name}
              </h3>
              <p className="text-[17px] lg:text-[19px] font-medium leading-relaxed text-slate-300 max-w-lg mb-0 text-left">
                {ProPlan.description}
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end shrink-0 lg:pt-1">
              <div className="flex items-baseline gap-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={billingCycle}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[54px] lg:text-[68px] font-black tracking-tighter text-white leading-none"
                  >
                    {billingCycle === "monthly" ? ProPlan.monthlyPrice : ProPlan.yearlyPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[22px] font-bold text-slate-300">/mo</span>
              </div>
              {!isTrialEnded && (
                <p className="text-[13px] font-black text-slate-300 uppercase tracking-widest mt-2">
                  {billingCycle === "yearly" ? "Billed $468 Annually" : `No charges for ${trialDaysRemaining} days`}
                </p>
              )}
              {isTrialEnded && (
                <p className="text-[13px] font-black text-emerald-500 uppercase tracking-widest mt-2">
                  {billingCycle === "yearly" ? "Save 20% with yearly" : "Instant activation"}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-4 mb-14 w-full text-left">
            {ProPlan.features.map((feature) => (
              <div key={feature} className="flex items-center justify-start gap-4 group/feat text-left">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-red-500/10 border border-red-500/20 group-hover/feat:bg-red-500/20 transition-colors">
                  <Check className="w-3.5 h-3.5 text-red-400" />
                </div>
                <span className="text-[17px] font-bold text-slate-200 text-left">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {showButton && (
            <Link
              href={onUpgrade ? "#" : "/login?intent=pro"}
              className="contents"
              onClick={(e) => {
                if (onUpgrade) {
                  e.preventDefault()
                  onUpgrade()
                }
              }}
            >
              <Button
                className="w-full h-16 lg:h-20 rounded-[1.5rem] lg:rounded-[2rem] font-black text-[18px] lg:text-[20px] transition-all hover:scale-[1.02] active:scale-[0.98] bg-white text-[#0F172A] hover:bg-slate-50 border-none shadow-xl shadow-white/5"
              >
                {isTrialEnded || onUpgrade ? "Activate Pro Subscription" : `Start ${trialDaysRemaining}-Day Free Trial`}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          )}

          {!isTrialEnded && (
            <div className="text-center space-y-5 pt-8">
              <p className="text-slate-200 text-[16px] font-medium italic">
                "Try the full satellite widget free for {trialDaysRemaining} days. No commitments."
              </p>
              <p className="text-slate-300 text-[13px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Full access to Solar API & Measurements
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
