"use client"

import { Check, Zap, Globe, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const ProPlan = {
  name: "Pro Satellite",
  monthlyPrice: "$99",
  yearlyPrice: "$69",
  description: "The complete roofing sales toolkit. Stop climbing roofs and start closing deals from your truck.",
  features: [
    "Instant satellite measurements",
    "Unlimited qualified lead capture",
    "Unlimited active lead capture widgets",
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
      {/* Billing Toggle - Sliding animation */}
      <div className="relative flex items-center bg-slate-100/90 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] mb-12">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`relative z-10 px-8 h-12 rounded-xl text-[15px] font-bold transition-colors duration-300 flex items-center justify-center cursor-pointer ${
            billingCycle === "monthly" ? "text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {billingCycle === "monthly" && (
            <motion.div 
              layoutId="activeCycle" 
              className="absolute inset-0 bg-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.15)] border border-slate-950/10 rounded-xl -z-10" 
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span>Monthly</span>
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`relative z-10 px-8 h-12 rounded-xl text-[15px] font-bold transition-colors duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
            billingCycle === "yearly" ? "text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {billingCycle === "yearly" && (
            <motion.div 
              layoutId="activeCycle" 
              className="absolute inset-0 bg-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.15)] border border-slate-950/10 rounded-xl -z-10" 
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span>Yearly</span>
          <span className={`inline-flex items-center justify-center text-[10px] leading-none h-5 px-2 rounded-full uppercase tracking-wider font-extrabold shadow-sm transition-colors duration-300 ${
            billingCycle === "yearly" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800"
          }`}>
            Save 30%
          </span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.005,
          borderColor: 'rgba(185, 28, 28, 0.15)',
          boxShadow: '0 40px 85px rgba(0, 0, 0, 0.05)'
        }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-2xl rounded-[2.5rem] p-8 lg:p-12 flex flex-col border border-slate-100 shadow-2xl lg:shadow-[0_40px_80px_rgba(0,0,0,0.03)] ring-1 ring-slate-100/50 bg-white cursor-default text-left"
      >
        <div className="flex flex-col items-start w-full text-left">
          {/* Plan Icon */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm bg-slate-50 border border-slate-100 shrink-0">
            <ProPlan.icon className="w-7 h-7 text-red-700" />
          </div>

          {/* Plan Meta & Pricing */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 w-full text-left">
            <div className="flex-1 text-left">
              <h3 className="text-[30px] lg:text-[36px] font-extrabold tracking-tight mb-3 text-slate-950 leading-none text-left">
                {ProPlan.name}
              </h3>
              <p className="text-[15px] font-normal leading-relaxed text-slate-500 max-w-sm text-left">
                {ProPlan.description}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end shrink-0 pt-1 text-left md:text-right">
              <div className="flex items-baseline gap-1 justify-start md:justify-end">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={billingCycle}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[48px] lg:text-[56px] font-extrabold tracking-tight text-slate-950 leading-none"
                  >
                    {billingCycle === "monthly" ? ProPlan.monthlyPrice : ProPlan.yearlyPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[18px] font-semibold text-slate-400">/mo</span>
              </div>
              {!isTrialEnded && (
                <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mt-2.5 text-left md:text-right">
                  {billingCycle === "yearly" ? "Billed $828 Annually" : `No charges for ${trialDaysRemaining} days`}
                </p>
              )}
              {isTrialEnded && (
                <p className="text-[12px] font-bold text-emerald-700 uppercase tracking-wider mt-2.5 text-left md:text-right">
                  {billingCycle === "yearly" ? "Save 30% with yearly" : "Instant activation"}
                </p>
              )}
            </div>
          </div>

          {/* subtle divider */}
          <div className="w-full h-px bg-slate-100 my-8" />

          {/* Features Grid - 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 w-full text-left">
            {ProPlan.features.map((feature) => (
              <div key={feature} className="flex items-center justify-start gap-3.5 group/feat text-left">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-red-50/80 border border-red-100/50 shadow-sm group-hover/feat:bg-red-100 transition-all duration-300">
                  <Check className="w-3.5 h-3.5 text-red-700 stroke-[2.5px]" />
                </div>
                <span className="text-[15px] font-semibold text-slate-700 group-hover/feat:text-slate-900 transition-colors text-left">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* subtle divider */}
        <div className="w-full h-px bg-slate-100 my-8" />

        <div className="space-y-6 w-full">
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
                className="relative overflow-hidden w-full h-16 lg:h-18 rounded-2xl font-bold text-[17px] bg-[#0F172A] text-white hover:bg-black border-none shadow-xl shadow-slate-900/10 active:scale-[0.98] hover:scale-[1.01] transition-transform duration-300 cursor-pointer"
              >
                {/* Shimmer glare overlay */}
                <div className="absolute inset-0 w-full h-full -z-0 pointer-events-none">
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0),rgba(255,255,255,0)_40%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0)_60%,rgba(255,255,255,0))] bg-[length:200%_100%] animate-shimmer" />
                </div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isTrialEnded || onUpgrade ? "Activate Pro Subscription" : `Start ${trialDaysRemaining}-Day Free Trial`}
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
          )}

          {!isTrialEnded && (
            <div className="text-center mt-4 space-y-4">
              <p className="text-slate-500 text-[14px] font-medium italic">
                "Try the full satellite widget free for {trialDaysRemaining} days. No commitments."
              </p>
              <div className="flex items-center justify-center gap-2 text-slate-600 text-[13px] font-medium">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3px] shrink-0" />
                <span>Get precision satellite measurements on every lead</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
