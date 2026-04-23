"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, CheckCircle2, Calculator, ArrowLeft } from "lucide-react"
import RoofingWidget from "@/components/RoofingWidget"
import { PricingConfig } from "@/lib/pricingEngine"
import { useUserTier } from "@/components/UserTierProvider"
import { generateConfigFromPrompt, saveCalculator } from "@/app/actions/calculator"
import CalculatorCard from "@/components/dashboard/CalculatorCard"
import { UpgradeModal } from "@/components/UpgradeModal"
import { createDodoCheckoutSession } from "@/app/actions/billing"
import { cn } from "@/lib/utils"


export default function AICalculatorBuilder({ initialCalculators }: { initialCalculators: any[] }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const { isPro } = useUserTier()
  const [calculators, setCalculators] = useState(initialCalculators || [])
  const [mode, setMode] = useState<"dashboard" | "building">("dashboard")
  const [prompt, setPrompt] = useState("")
  const [calcName, setCalcName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [config, setConfig] = useState<PricingConfig | null>(null)

  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')

  const handleUpgrade = async () => {
    try {
      const { url } = await createDodoCheckoutSession()
      if (!url || url.startsWith("#")) {
        alert("Billing is not configured. Please add DODO_PAYMENTS_API_KEY and DODO_PRO_PRODUCT_ID to your environment variables.")
        return
      }
      window.location.href = url
    } catch (err) {
      alert("Failed to start checkout. Please try again.")
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Restriction: 1 calculator for free users
    if (!isPro && calculators.length >= 1) {
      setShowUpgradeModal(true)
      return
    }

    setMode("building")
    setIsGenerating(true)
    try {
      const result = await generateConfigFromPrompt(prompt)
      setConfig(result)
      if (!calcName) setCalcName("Pricing Engine " + new Date().toLocaleDateString())
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleConfirm = async () => {
    if (!config) return
    setIsSaving(true)
    try {
      const savedData = await saveCalculator(calcName || "New Engine", config)
      if (savedData && savedData.length > 0) setCalculators(prev => [savedData[0], ...prev])
      setConfig(null)
      setPrompt("")
      setCalcName("")
      setMode("dashboard")
    } catch (err) {
      console.error("Save error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const cancelBuild = () => { setMode("dashboard"); setConfig(null) }

  if (mode === "building") {
    return (
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full lg:w-[calc(100%+4rem)] lg:-m-8 font-sans bg-white overflow-hidden">
        
        {/* Mobile Perspective Toggle - Sticky beneath layout navbar */}
        <div className="lg:hidden sticky top-0 shrink-0 p-4 bg-white/95 backdrop-blur-md border-b flex items-center justify-between z-30 shadow-sm">
          <button onClick={cancelBuild} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex bg-slate-100 p-1 rounded-xl w-48">
            <button 
              onClick={() => setMobileView('editor')}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-[13px] font-black transition-all",
                mobileView === 'editor' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
              )}
            >
              Editor
            </button>
            <button 
              onClick={() => setMobileView('preview')}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-[13px] font-black transition-all",
                mobileView === 'preview' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
              )}
            >
              Preview
            </button>
          </div>
          <div className="w-9" />
        </div>

        {/* Left: Config */}
        <div className={cn(
          "w-full lg:w-[46%] bg-white p-6 lg:p-10 lg:overflow-y-auto border-r border-slate-100 flex flex-col pt-8 lg:pt-14 shadow-[inset_-1px_0_0_#f1f5f9]",
          mobileView !== 'editor' && "hidden lg:flex"
        )}>
          <button onClick={cancelBuild} className="hidden lg:flex items-center gap-2 text-slate-400 font-bold mb-6 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="mb-8 lg:mb-10">
            <h1 className="text-[28px] lg:text-[32px] font-black flex items-center gap-3 text-slate-900 tracking-tight">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(185,28,28,0.3)] shrink-0">
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <span>Building Your Engine</span>
            </h1>
            <p className="text-slate-500 mt-2 lg:mt-3 text-[14px] lg:text-[16px] font-medium leading-relaxed">Adjust your pricing rules and watch the widget update live.</p>
          </div>

          <div className="space-y-6 lg:space-y-7 flex-1">
            <div className="space-y-2.5">
              <label className="font-bold text-slate-800 block text-[13px] lg:text-[15px] tracking-tight uppercase">Engine Name</label>
              <input
                className="flex h-12 lg:h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-[15px] font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-all placeholder:text-slate-400"
                placeholder="e.g., Premium Asphalt Campaign"
                value={calcName}
                onChange={(e) => setCalcName(e.target.value)}
              />
            </div>

            <div className="space-y-2.5 flex-1 flex flex-col">
              <label className="font-bold text-slate-800 block text-[13px] lg:text-[15px] tracking-tight uppercase">Pricing Rules</label>
              <Textarea
                placeholder="I charge $5.00 per sq ft for Asphalt..."
                className="flex-1 min-h-[160px] lg:min-h-[260px] resize-none text-[15px] font-medium border-slate-200 focus-visible:ring-red-500 bg-slate-50/80 p-5 leading-relaxed text-slate-900 rounded-2xl"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6 lg:pt-8 mt-6 lg:mt-8 border-t border-slate-100 pb-6">
            {!config ? (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full h-14 text-[16px] font-bold bg-gradient-to-br from-red-700 to-red-800 hover:to-red-900 text-white shadow-xl rounded-2xl transition-all"
              >
                {isGenerating ? (
                  <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Thinking...</>
                ) : (
                  <><Sparkles className="mr-3 h-5 w-5" /> Generate Pricing Engine</>
                )}
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-3 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[16px]">Logic compiled!</p>
                    <p className="text-[13px] text-emerald-800 mt-0.5 font-medium">
                      Asphalt: ${config.materials.asphalt.toFixed(2)}/sqft · Tile: ${config.materials.tile.toFixed(2)}/sqft
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    variant="outline"
                    className="w-full h-12 font-bold text-slate-700 bg-white border-slate-200 rounded-2xl"
                    onClick={() => setConfig(null)}
                  >
                    Tweak Rules
                  </Button>
                  <Button
                    className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold shadow-xl rounded-2xl"
                    onClick={handleConfirm}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Engine →"}
                  </Button>
                </div>
                <Button variant="ghost" className="hidden lg:flex w-full text-slate-400 hover:text-slate-700 font-semibold text-sm" onClick={cancelBuild}>
                  ← Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className={cn(
          "w-full lg:w-[54%] bg-slate-50 flex flex-col items-center justify-center p-6 lg:p-8 lg:overflow-y-auto relative min-h-[500px] border-t lg:border-t-0 lg:border-l border-slate-100",
          mobileView !== 'preview' && "hidden lg:flex"
        )}>
          <div className="absolute top-6 left-6 bg-white text-[11px] font-black uppercase tracking-widest text-slate-400 px-4 py-1.5 rounded-full shadow-sm border border-slate-200 z-10">
            Live Preview
          </div>

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-5 w-full max-w-[280px]">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                <Loader2 className="w-8 h-8 animate-spin text-red-700" />
              </div>
              <p className="font-bold text-slate-700 text-center">Our system is parsing your pricing rules...</p>
            </div>
          ) : config ? (
            <div className="w-full max-w-[420px] transform animate-in zoom-in-95 duration-500 pt-12 lg:pt-0">
              <RoofingWidget isPro={isPro} config={config} calculatorId="preview-mode" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 opacity-60 px-8 text-center">
              <Calculator className="w-16 h-16 lg:w-20 lg:h-20 mb-5 text-slate-200" />
              <p className="font-semibold lg:text-lg text-slate-400 leading-tight">Awaiting your rules...</p>
              <p className="text-[13px] lg:text-sm text-slate-400 mt-1 font-medium">Describe your math to see the live widget.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="space-y-8 lg:space-y-12 max-w-7xl mx-auto pb-12 pt-0 lg:pt-4 font-sans px-4 lg:px-0">
      {/* Hero Input */}
      <div className="max-w-4xl mx-auto text-center space-y-4 lg:space-y-6">
        <div className="pt-4 lg:pt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-[11px] lg:text-[13px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Smart Pricing Architect
          </div>
          <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-black tracking-tighter text-slate-900 leading-[1.1] lg:leading-tight">
            Design your pricing engine.
          </h1>
          <p className="text-[15px] lg:text-[18px] text-slate-500 font-medium mt-3 leading-relaxed max-w-2xl mx-auto">
            Describe your math in plain English. Our system builds a live widget instantly.
          </p>
        </div>

        <div className="relative group mt-2 lg:mt-4 max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-br from-red-200/20 to-transparent rounded-[1.5rem] blur-lg opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none" />
          <div className="relative bg-white rounded-2xl lg:rounded-[1.25rem] shadow-xl border border-slate-200 focus-within:border-red-300 transition-all overflow-hidden">
            <Textarea
              placeholder="e.g. Asphalt shingles are $5.00/sq ft. I charge a $750 flat fee..."
              className="w-full min-h-[120px] lg:min-h-[140px] resize-none border-0 shadow-none focus-visible:ring-0 px-4 lg:px-5 py-4 lg:py-5 text-[16px] lg:text-[17px] font-medium text-slate-800 placeholder:text-slate-400 bg-transparent leading-relaxed"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) { e.preventDefault(); handleGenerate() }
              }}
            />
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 lg:px-5 py-3 lg:py-4 border-t border-slate-100 gap-3">
              <span className="hidden lg:block text-[13px] text-slate-400 font-bold uppercase tracking-wide">Press Enter to generate</span>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full sm:w-auto bg-[#0F172A] hover:bg-black text-white font-bold rounded-xl px-8 h-12 shadow-lg transition-all flex items-center justify-center border-none"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-red-500" />}
                Compile Engine
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deployed Engines Grid */}
      {calculators && calculators.length > 0 && (
        <div className="pt-4">
          <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-5 gap-4">
            <div>
              <h2 className="text-[24px] lg:text-[28px] font-black tracking-tight text-slate-900 leading-tight">Deployed Engines</h2>
              <p className="text-slate-500 mt-1 font-medium text-[14px] lg:text-[16px]">Manage and embed your pricing calculators.</p>
            </div>
            <div className="flex self-start">
              <span className="text-[12px] lg:text-[14px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{calculators.length} active engines</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc: any) => (
              <CalculatorCard
                key={calc.id}
                calc={calc}
                onDelete={(id) => setCalculators(prev => prev.filter(c => c.id !== id))}
                onRename={(id, name) => setCalculators(prev => prev.map(c => c.id === id ? { ...c, name } : c))}
                onDuplicate={(newObj) => setCalculators(prev => [newObj, ...prev])}
              />
            ))}
          </div>
        </div>
      )}

      {calculators.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 lg:py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-white/60 text-center px-6">
          <Calculator className="w-12 h-12 lg:w-16 lg:h-16 text-slate-200 mb-4" />
          <p className="font-bold text-slate-700 text-[16px] lg:text-[18px]">No engines deployed yet.</p>
          <p className="text-slate-400 font-medium mt-1 text-[14px] lg:text-[15px]">Describe your pricing above to build your first one.</p>
        </div>
      )}

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
