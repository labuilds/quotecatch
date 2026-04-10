"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, CheckCircle2, Calculator } from "lucide-react"
import RoofingWidget from "@/components/RoofingWidget"
import { PricingConfig } from "@/lib/pricingEngine"
import { useUserTier } from "@/components/UserTierProvider"
import { generateConfigFromPrompt, saveCalculator } from "@/app/actions/calculator"
import CalculatorCard from "@/components/dashboard/CalculatorCard"

export default function AICalculatorBuilder({ initialCalculators }: { initialCalculators: any[] }) {
  const { isPro } = useUserTier()
  const [calculators, setCalculators] = useState(initialCalculators || [])
  const [mode, setMode] = useState<"dashboard" | "building">("dashboard")
  const [prompt, setPrompt] = useState("")
  const [calcName, setCalcName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [config, setConfig] = useState<PricingConfig | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
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
      <div className="flex min-h-[calc(100vh-4rem)] w-[calc(100%+4rem)] -m-8 font-sans">
        {/* Left: Config */}
        <div className="w-[46%] bg-white p-10 overflow-y-auto border-r border-slate-100 flex flex-col pt-14 shadow-[inset_-1px_0_0_#f1f5f9]">
          <div className="mb-10">
            <h1 className="text-[32px] font-black flex items-center gap-3 text-slate-900 tracking-tight">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(185,28,28,0.3)]">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Building Your Engine
            </h1>
            <p className="text-slate-500 mt-3 text-[16px] font-medium">Adjust your pricing rules and watch the widget update live.</p>
          </div>

          <div className="space-y-7 flex-1">
            <div className="space-y-2.5">
              <label className="font-bold text-slate-800 block text-[15px] tracking-tight">Engine Name</label>
              <input
                className="flex h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-[15px] font-semibold text-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-red-300 block transition-all placeholder:text-slate-400 shadow-none"
                placeholder="e.g., Premium Asphalt Campaign"
                value={calcName}
                onChange={(e) => setCalcName(e.target.value)}
              />
            </div>

            <div className="space-y-2.5 flex-1 flex flex-col">
              <label className="font-bold text-slate-800 block text-[15px] tracking-tight">Pricing Rules (Plain English)</label>
              <Textarea
                placeholder="I charge $5.00 per sq ft for Asphalt Shingles. Architectural is $7.50/sq ft. Metal roofs I price at $14/sq ft. I always add a $750 flat trip fee. Steep pitch jobs get a 25% markup..."
                className="flex-1 min-h-[260px] resize-none text-[15px] font-medium border-slate-200 focus-visible:ring-red-500 focus-visible:border-red-300 bg-slate-50/80 block shadow-none p-5 leading-relaxed text-slate-900 placeholder:text-slate-400 rounded-2xl"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-100 pb-6">
            {!config ? (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full h-14 text-[16px] font-bold bg-gradient-to-br from-red-700 to-red-800 hover:to-red-900 text-white shadow-[0_8px_24px_rgba(185,28,28,0.25)] rounded-2xl tracking-wide transition-all hover:shadow-[0_12px_32px_rgba(185,28,28,0.35)] border-none"
              >
                {isGenerating ? (
                  <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Compiling with Gemini AI...</>
                ) : (
                  <><Sparkles className="mr-3 h-5 w-5" /> Generate Pricing Engine</>
                )}
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex gap-4 text-emerald-900">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[18px]">Logic compiled successfully!</p>
                    <p className="text-[15px] text-emerald-800 mt-1 font-medium leading-relaxed">
                      Asphalt: ${config.materials.asphalt.toFixed(2)}/sqft · Tile: ${config.materials.tile.toFixed(2)}/sqft
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 font-bold text-slate-700 bg-white border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300"
                    onClick={() => setConfig(null)}
                  >
                    Tweak Rules
                  </Button>
                  <Button
                    className="flex-1 h-12 bg-slate-900 hover:bg-black text-white font-bold shadow-xl rounded-2xl border-none"
                    onClick={handleConfirm}
                    disabled={isSaving}
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Engine →"}
                  </Button>
                </div>
                <Button variant="ghost" className="w-full text-slate-400 hover:text-slate-700 font-semibold text-sm" onClick={cancelBuild}>
                  ← Cancel & Return to Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-[54%] bg-slate-50 flex flex-col items-center justify-center p-8 overflow-y-auto relative border-l border-slate-100">
          <div className="absolute top-6 left-6 bg-white text-[13px] font-black uppercase tracking-widest text-slate-400 px-4 py-2 rounded-full shadow-sm border border-slate-200 z-10 hidden md:block">
            Live Preview
          </div>

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-5 w-full max-w-sm">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                <Loader2 className="w-8 h-8 animate-spin text-red-700" />
              </div>
              <div className="space-y-2 text-center">
                <p className="font-bold text-slate-700 text-[17px]">Gemini AI is compiling...</p>
                <p className="text-sm text-slate-400 font-medium">Parsing your pricing rules into structured logic</p>
              </div>
              <div className="w-full max-w-[200px] h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-red-700 w-full animate-pulse rounded-full" />
              </div>
            </div>
          ) : config ? (
            <div className="w-full max-w-[420px] transform origin-top animate-in zoom-in-95 duration-500">
              <RoofingWidget isPro={isPro} config={config} calculatorId="preview-mode" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 opacity-60">
              <Calculator className="w-20 h-20 mb-5 text-slate-200" />
              <p className="font-semibold text-lg text-slate-400">Awaiting your pricing rules...</p>
              <p className="text-sm text-slate-400 mt-1 font-medium">Describe your pricing and hit Generate</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12 pt-4 font-sans">
      {/* Hero Input */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-[13px] font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" /> AI Pricing Architect
          </div>
          <h1 className="text-[48px] font-black tracking-tight text-slate-900 leading-tight">
            Design your pricing engine.
          </h1>
          <p className="text-[18px] text-slate-500 font-medium mt-3 leading-relaxed max-w-2xl mx-auto">
            Describe your math in plain English. Gemini AI builds a live, embeddable widget instantly.
          </p>
        </div>

        <div className="relative group mt-4 max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-br from-red-300/30 to-red-100/20 rounded-[1.5rem] blur-lg opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative bg-white rounded-[1.25rem] shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-200 focus-within:border-red-300 focus-within:shadow-[0_8px_32px_rgba(185,28,28,0.08)] transition-all overflow-hidden">
            <Textarea
              placeholder="e.g. Asphalt shingles are $5.00/sq ft. Architectural is $7.50/sq ft. Metal is $14.00/sq ft. I charge a $750 flat fee for every job. Steep pitch gets a 20% markup..."
              className="w-full min-h-[140px] resize-none border-0 shadow-none focus-visible:ring-0 px-5 py-5 text-[17px] font-medium text-slate-800 placeholder:text-slate-400 bg-transparent leading-relaxed tracking-tight"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate() }
              }}
            />
            <div className="flex justify-between items-center px-5 pt-3 pb-4 border-t border-slate-100 mt-1">
              <span className="text-[14px] text-slate-500 font-semibold">Press Enter to generate · Shift+Enter for new line</span>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="bg-slate-900 hover:bg-black text-white font-bold rounded-xl px-6 h-11 shadow-[0_4px_14px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all flex items-center border-none"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Compile Engine
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deployed Engines Grid */}
      {calculators && calculators.length > 0 && (
        <div>
          <div className="mb-8 flex justify-between items-end border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-[28px] font-black tracking-tight text-slate-900">Deployed Engines</h2>
              <p className="text-slate-500 mt-1.5 font-medium text-[16px]">Manage, duplicate, edit, and embed your pricing calculators.</p>
            </div>
            <span className="text-[15px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{calculators.length} active</span>
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
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-white/60 text-center">
          <Calculator className="w-16 h-16 text-slate-200 mb-4" />
          <p className="font-bold text-slate-700 text-[18px]">No engines deployed yet.</p>
          <p className="text-slate-500 font-medium mt-2 text-[15px]">Describe your pricing above to build your first one.</p>
        </div>
      )}
    </div>
  )
}
