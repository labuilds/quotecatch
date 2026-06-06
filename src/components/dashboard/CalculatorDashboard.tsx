"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Plus,
  Activity,
  ChevronRight,
  Sparkles,
  Zap,
  Layout
} from "lucide-react"
import CalculatorCard from "@/components/dashboard/CalculatorCard"
import { UpgradeModal } from "@/components/UpgradeModal"
import { createDodoCheckoutSession } from "@/app/actions/billing"
import { useUserTier } from "@/components/UserTierProvider"
import { saveCalculator } from "@/app/actions/calculator"
import { DEFAULT_PRICING_CONFIG } from "@/lib/pricingEngine"
import { motion } from "framer-motion"

export default function CalculatorDashboard({ initialCalculators }: { initialCalculators: any[] }) {
  const router = useRouter()
  const { isPro, trialDaysRemaining } = useUserTier()
  const [mounted, setMounted] = useState(false)
  const [calculators, setCalculators] = useState(initialCalculators || [])
  const [isCreating, setIsCreating] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (initialCalculators) {
      setCalculators(initialCalculators)
    }
  }, [initialCalculators])

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    try {
      const { url, error } = await createDodoCheckoutSession(plan)
      if (error) {
        alert(error)
        return
      }
      if (!url || url.startsWith("#")) {
        alert("Billing is not configured.")
        return
      }
      window.location.href = url
    } catch (err) {
      alert("Failed to start checkout.")
    }
  }

  const handleCreateNew = async () => {
    if (!isPro && calculators.length >= 1) {
      setShowUpgradeModal(true)
      return
    }

    setIsCreating(true)
    try {
      const name = `New Lead Machine ${calculators.length + 1}`
      const savedData = await saveCalculator(name, DEFAULT_PRICING_CONFIG)

      if (savedData && savedData[0]) {
        router.push(`/calculators/${savedData[0].id}`)
      }
    } catch (err) {
      console.error("Creation error:", err)
      alert("Failed to create new lead machine.")
      setIsCreating(false)
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50/50" />
  }

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-6 pb-20 font-sans relative overflow-x-hidden">
      {/* Premium background effects */}
      <div className="absolute top-0 right-0 -mr-20 w-[500px] h-[500px] bg-red-50/40 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-40 left-0 -ml-20 w-[400px] h-[400px] bg-slate-50/60 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Hero Section - High-End Premium */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12 pt-8">
        <div className="max-w-2xl">
          <div className="space-y-6 pt-16 pb-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[48px] lg:text-[72px] font-bold tracking-tighter leading-[0.95] text-[#0F172A]"
            >
              Master Your Pricing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-600 to-red-500">Capture Leads.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[18px] lg:text-[21px] text-slate-600 font-medium leading-relaxed max-w-xl"
            >
              Control your quote engines, automate your math, and capture high-intent leads on your website.
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="shrink-0 flex flex-col items-center lg:items-end gap-5"
        >
          <button
            onClick={handleCreateNew}
            disabled={isCreating}
            className="h-16 sm:h-20 px-6 sm:px-10 bg-[#0F172A] hover:bg-black text-white font-bold rounded-[2rem] text-[16px] sm:text-[18px] shadow-2xl shadow-slate-200 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 border-none group cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6 stroke-[3px] group-hover:rotate-90 transition-transform duration-300" />}
            Build New Machine
          </button>
          <div className="flex items-center gap-2">
            {!isPro && calculators.length >= 1 ? (
              <span className="text-red-600 font-semibold text-[11px] uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">Plan Limit Reached</span>
            ) : (
              <p className="flex items-center gap-2 text-slate-600 text-[16px] font-bold uppercase tracking-[0.15em]">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                Live on your site in seconds
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Grid Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-slate-50 pb-1 gap-6">
          <div className="space-y-2">
            <h2 className="text-[36px] font-bold tracking-tighter text-[#0F172A] leading-none">Your estimators</h2>
            <p className="text-slate-600 font-medium text-[17px]">Manage and scale your active web-estimators.</p>
          </div>
          <div className="flex items-center gap-4 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <Activity className="w-4 h-4 text-emerald-500" />
            <p className="text-[15px] font-bold text-slate-600 uppercase tracking-widest">
              {calculators.length} ACTIVE SYSTEMS
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {calculators.map((calc: any) => (
            <CalculatorCard
              key={calc.id}
              calc={calc}
              onDelete={(id) => setCalculators(prev => prev.filter(c => c.id !== id))}
              onRename={(id, name) => setCalculators(prev => prev.map(c => c.id === id ? { ...c, name } : c))}
              onDuplicate={(newObj) => setCalculators(prev => [newObj, ...prev])}
              onUpgradeRequest={() => setShowUpgradeModal(true)}
            />
          ))}

          {/* Premium Create Card placeholder */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateNew}
            disabled={isCreating}
            className="group min-h-[440px] rounded-[2.5rem] border-4 border-dashed border-slate-100 hover:border-red-500/10 bg-slate-50/20 hover:bg-red-50/10 transition-all flex flex-col items-center justify-center gap-6 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 shadow-sm group-hover:bg-[#0F172A] group-hover:border-[#0F172A] group-hover:scale-110 transition-all duration-500 flex items-center justify-center">
              {isCreating ? <Loader2 className="w-8 h-8 animate-spin text-slate-600 group-hover:text-white" /> : <Plus className="w-8 h-8 text-slate-600 group-hover:text-white stroke-[3.5px]" />}
            </div>
            <div className="text-center space-y-2">
              <p className="text-[#0F172A] font-bold uppercase tracking-widest text-[15px] group-hover:text-red-700">Deploy New Machine</p>
              <p className="text-slate-600 font-medium text-[16px] max-w-[220px] mx-auto leading-relaxed">Filter tire-kickers on another site</p>
            </div>
          </motion.button>
        </div>

        {calculators.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 border-4 border-dashed border-slate-50 rounded-[4rem] bg-white/50 text-center px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/30 -z-10" />
            <div className="w-28 h-28 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl flex items-center justify-center mb-10 relative">
              <Zap className="w-14 h-14 text-red-100" />
              <div className="absolute inset-0 bg-red-500/5 blur-2xl rounded-full" />
            </div>
            <h3 className="font-bold text-[#0F172A] text-[36px] tracking-tighter leading-tight max-w-xl">
              Capturing leads <br />
              <span className="text-red-600">is now automated.</span>
            </h3>
            <p className="text-slate-600 font-medium mt-6 text-[20px] max-w-md mx-auto leading-relaxed">
              Start by building your first lead machine and let it qualify homeowners for you.
            </p>
            <button
              onClick={handleCreateNew}
              disabled={isCreating}
              className="mt-12 h-18 px-12 bg-[#0F172A] hover:bg-black text-white font-bold rounded-2xl text-[18px] shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4 disabled:opacity-50"
            >
              Initialize First Machine <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        trialDaysRemaining={trialDaysRemaining}
      />
    </div>
  )
}
