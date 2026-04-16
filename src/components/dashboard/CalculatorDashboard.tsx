"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Zap,
  Plus,
  Settings2,
  TrendingUp,
  Layout,
  ExternalLink,
  ChevronRight
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
  const { isPro } = useUserTier()
  const [calculators, setCalculators] = useState(initialCalculators || [])
  const [isCreating, setIsCreating] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Sync state with server-side props when they change (e.g. after revalidation)
  useEffect(() => {
    if (initialCalculators) {
      setCalculators(initialCalculators)
    }
  }, [initialCalculators])

  console.log("Client-side Calculators State:", calculators.length)

  const handleUpgrade = async () => {
    try {
      const { url } = await createDodoCheckoutSession()
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
    // Restriction: 1 calculator for free users
    if (!isPro && calculators.length >= 1) {
      setShowUpgradeModal(true)
      return
    }

    setIsCreating(true)
    try {
      const name = `New Lead Machine ${calculators.length + 1}`
      const savedData = await saveCalculator(name, DEFAULT_PRICING_CONFIG)

      if (savedData && savedData[0]) {
        // Redirect immediately to the editor
        router.push(`/calculators/${savedData[0].id}`)
      }
    } catch (err) {
      console.error("Creation error:", err)
      alert("Failed to create new lead machine.")
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-6 pb-12 font-sans">
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-bold text-xs uppercase tracking-[0.2em]">
            <Settings2 className="w-4 h-4 text-red-500" /> Machine Dashboard
          </div>
          <h1 className="text-[40px] lg:text-[64px] font-black tracking-tighter leading-[1.05]">
            Set Your Prices. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-600">Filter the Tire-Kickers.</span>
          </h1>
          <p className="text-[18px] lg:text-[20px] text-slate-400 font-medium leading-relaxed max-w-lg">
            Manage your lead machines, set your exact material markups, and control the numbers your homeowners see.
          </p>
        </div>

        <div className="shrink-0 flex flex-col gap-4">
          <Button
            onClick={handleCreateNew}
            disabled={isCreating}
            className="h-16 px-8 bg-red-700 hover:bg-red-800 text-white font-black rounded-2xl text-[17px] shadow-2xl shadow-red-900/40 flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 border-none"
          >
            {isCreating ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Plus className="w-5 h-5 stroke-[3px]" />}
            Build New Machine
          </Button>
          <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-widest">
            {!isPro && calculators.length >= 1 ? "Free Tier Limit Reached" : "Live on your website in seconds."}
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-8 gap-6">
          <div className="space-y-1">
            <h2 className="text-[32px] font-black tracking-tight text-[#0F172A] leading-tight">Your Lead Machines</h2>
            <p className="text-slate-500 font-medium text-[16px]">Edit your pricing rules, grab your embed codes, and watch the qualified leads roll in.</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {calculators.length} ACTIVE MACHINES
            </p>
          </div>
        </div>

        {calculators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {calculators.map((calc: any) => (
              <CalculatorCard
                key={calc.id}
                calc={calc}
                onDelete={(id) => setCalculators(prev => prev.filter(c => c.id !== id))}
                onRename={(id, name) => setCalculators(prev => prev.map(c => c.id === id ? { ...c, name } : c))}
                onDuplicate={(newObj) => setCalculators(prev => [newObj, ...prev])}
              />
            ))}

            {/* Create Card placeholder */}
            <button
              onClick={handleCreateNew}
              disabled={isCreating}
              className="group h-[320px] rounded-[3rem] border-4 border-dashed border-slate-100 hover:border-red-100 bg-white/50 hover:bg-red-50/30 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 group-hover:bg-red-700 group-hover:scale-110 transition-all flex items-center justify-center">
                {isCreating ? <Loader2 className="w-6 h-6 animate-spin text-slate-400 group-hover:text-white" /> : <Plus className="w-6 h-6 text-slate-400 group-hover:text-white stroke-[3px]" />}
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm group-hover:text-red-700">Add New Machine</p>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 lg:py-32 border-4 border-dashed border-slate-100 rounded-[3.5rem] bg-white/50 text-center px-8">
            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8">
              <Zap className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="font-black text-[#0F172A] text-[24px] lg:text-[28px] tracking-tight">Stop losing leads to boring contact forms.</h3>
            <p className="text-slate-400 font-medium mt-2 text-[16px] lg:text-[18px] max-w-md mx-auto leading-relaxed">
              Build your first lead machine and let your website qualify homeowners while you sleep.
            </p>
            <Button
              onClick={handleCreateNew}
              disabled={isCreating}
              className="mt-10 h-16 px-10 bg-[#0F172A] hover:bg-black text-white font-black rounded-[1.5rem] text-[16px] shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 border-none"
            >
              Get Started Now <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
