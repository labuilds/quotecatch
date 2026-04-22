"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  CheckCircle2,
  ArrowLeft,
  DollarSign,
  Zap,
  ChevronRight,
  Calculator,
  Save,
  Undo2,
  Home,
  Layers,
  ChevronUp,
  ChevronDown,
  Settings2,
  Edit3,
  Info,
  Trash2
} from "lucide-react"
import RoofingWidget from "@/components/RoofingWidget"
import { useUserTier } from "@/components/UserTierProvider"
import { updateCalculatorConfig } from "@/app/actions/calculator"
import { PricingConfig } from "@/lib/pricingEngine"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  event.target.select()
}

// Standard design tokens for consistent UI
const LABEL_CLASS = "text-[15px] font-bold text-slate-900 block"
const SUBTEXT_CLASS = "text-[13.5px] text-slate-400 font-medium leading-tight"

// Custom Input with Stepper Controls
const PremiumInput = ({ value, onChange, placeholder, step = 1, prefix, suffix, dark = false }: any) => {
  const numValue = parseFloat(value) || 0

  const handleIncrement = () => {
    const newVal = (numValue + step).toFixed(2)
    onChange(newVal.endsWith('.00') ? parseInt(newVal).toString() : newVal)
  }

  const handleDecrement = () => {
    const newVal = Math.max(0, numValue - step).toFixed(2)
    onChange(newVal.endsWith('.00') ? parseInt(newVal).toString() : newVal)
  }

  return (
    <div className="relative group/input w-40">
      
      {prefix && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg pointer-events-none z-10">
          {prefix}
        </div>
      )}

      {suffix && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black tracking-widest text-slate-300 uppercase pointer-events-none z-10">
          {suffix}
        </div>
      )}

      <Input
        type="number"
        value={value ?? ""}
        placeholder={placeholder}
        onFocus={handleFocus}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-14 pl-10 pr-12 rounded-xl border-slate-200 font-normal text-lg transition-all text-right w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          dark 
            ? "bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:border-white/40 focus-visible:ring-white/10" 
            : "bg-slate-50/50 text-slate-900 border-slate-200 focus-visible:ring-red-600/10 focus-visible:border-red-600"
        )}
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover/input:opacity-100 transition-opacity">
        <button 
          onClick={handleIncrement}
          className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ChevronUp className="w-3 h-3 stroke-[3px]" />
        </button>
        <button 
          onClick={handleDecrement}
          className="p-1 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ChevronDown className="w-3 h-3 stroke-[3px]" />
        </button>
      </div>
    </div>
  )
}

const PITCH_METADATA = [
  { id: "flat", label: "Flat Roof", sub: "Safe to walk on" },
  { id: "low", label: "Low Pitch", sub: "Easy to climb" },
  { id: "standard", label: "Moderate Pitch", sub: "Walk with caution" },
  { id: "steep", label: "Steep Pitch", sub: "Harness required" },
]

export default function ManualCalculatorEditor({ 
  calculator, companyName, companyLogoUrl 
}: { 
  calculator: any, companyName: string, companyLogoUrl: string 
}) {
  const router = useRouter()
  const { isPro } = useUserTier()
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [activeTab, setActiveTab] = useState<'name' | 'sizing' | 'materials' | 'markups' | 'sequence'>('name')

  const [config, setConfig] = useState<PricingConfig>({
    ...calculator.config_json,
    materials: {
      asphalt: calculator.config_json.materials?.asphalt ?? 5.50,
      tile: calculator.config_json.materials?.tile ?? 14.00,
      metal: calculator.config_json.materials?.metal ?? 11.00,
      cedar: calculator.config_json.materials?.cedar ?? 15.00,
    },
    offered_materials: calculator.config_json.offered_materials || ['asphalt', 'tile', 'metal', 'cedar'],
    free_tier_averages: {
      under_1500: calculator.config_json.free_tier_averages?.under_1500 || 1200,
      "1500_2500": calculator.config_json.free_tier_averages?.["1500_2500"] || 2000,
      over_2500: calculator.config_json.free_tier_averages?.over_2500 || 3200,
    }
  })
  const [engineName, setEngineName] = useState(calculator.name)
  
  const [stepToggles, setStepToggles] = useState({
    buildingType: calculator.config_json.steps?.buildingType ?? true,
    currentMaterial: calculator.config_json.steps?.currentMaterial ?? true,
    desiredMaterial: calculator.config_json.steps?.desiredMaterial ?? true,
    timeline: calculator.config_json.steps?.timeline ?? false,
    financing: calculator.config_json.steps?.financing ?? false,
  })

  const [savedConfig, setSavedConfig] = useState(calculator.config_json)
  const [savedName, setSavedName] = useState(calculator.name)
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')

  useEffect(() => {
    const currentFullConfig = { ...config, steps: stepToggles }
    // Ensure we are comparing clean objects
    const savedFullConfig = { ...savedConfig, steps: savedConfig.steps || (calculator.config_json.steps ?? stepToggles) }
    
    const isDifferent = JSON.stringify(currentFullConfig) !== JSON.stringify(savedFullConfig) || 
                       engineName !== savedName
                       
    setHasChanges(isDifferent)
    if (isDifferent) {
      setShowSuccess(false)
    }
  }, [config, stepToggles, engineName, savedConfig, savedName, calculator.config_json.steps])

  const handleUpdateMaterial = (key: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value)
    setConfig(prev => ({
      ...prev,
      materials: { ...prev.materials, [key]: numValue }
    }))
  }

  const handleUpdatePitch = (key: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value)
    setConfig(prev => ({
      ...prev,
      modifiers: {
        ...prev.modifiers,
        pitch: { ...prev.modifiers.pitch, [key]: numValue }
      }
    }))
  }

  const handleUpdateFlatFee = (value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value)
    setConfig(prev => ({ ...prev, flat_fees: numValue }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const finalConfig = { ...config, steps: stepToggles }
      await updateCalculatorConfig(calculator.id, engineName, finalConfig)
      
      // Update local saved state immediately to clear 'hasChanges' indicator
      setSavedConfig(finalConfig)
      setSavedName(engineName)
      setHasChanges(false)

      setShowSuccess(true)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to save configuration.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setConfig(savedConfig)
    setEngineName(savedName)
  }

  const sizeOrder = [
    { key: "under_1500", label: "Small (Under 1,500)" },
    { key: "1500_2500", label: "Medium (1,500 - 2,500)" },
    { key: "over_2500", label: "Large (2,500+)" }
  ]

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full lg:w-[calc(100%+4rem)] lg:-m-8 font-sans bg-[#F8FAFC] overflow-hidden">
      
      {/* Mobile Perspective Toggle */}
      <div className="lg:hidden shrink-0 p-4 bg-white border-b flex items-center justify-between z-20">
        <Link href="/calculators" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
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
        <div className="w-9" /> {/* Spacer for symmetry */}
      </div>

      {/* Left Sidebar: Controls */}
      <div className={cn(
        "w-full lg:w-[42%] h-full p-6 lg:p-10 overflow-y-auto border-b lg:border-b-0 lg:border-r bg-white flex flex-col shadow-2xl z-10 custom-scrollbar",
        mobileView !== 'editor' && "hidden lg:flex"
      )}>

        <div className="hidden lg:flex items-center justify-between mb-10 shrink-0">
          <Link href="/calculators" className="group inline-flex items-center text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </Link>

          <AnimatePresence>
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-2"
              >
                <Button variant="ghost" onClick={handleReset} className="h-9 px-4 text-slate-400 font-bold hover:bg-slate-50 rounded-xl hidden sm:flex">
                  <Undo2 className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-9 px-6 bg-[#0F172A] hover:bg-black text-white font-black rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                  Save Rules
                </Button>
              </motion.div>
            )}
            {showSuccess && !hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-500 font-black text-sm bg-emerald-50 px-4 py-2 rounded-xl"
              >
                <CheckCircle2 className="w-4 h-4" /> Rules Saved
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-10 shrink-0">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] lg:text-[40px] font-black text-slate-900 tracking-tighter leading-[1.05]">
              Control Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 to-red-500">Pricing Rules.</span>
            </h1>
            
            <Dialog>
              <DialogTrigger
                render={
                  <Button 
                    variant="outline" 
                    className="w-fit h-9 px-4 rounded-xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50 gap-2 cursor-pointer transition-all hover:border-slate-300"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span className="text-[12px] uppercase tracking-wider">Calculation Blueprint</span>
                  </Button>
                }
              />

              <DialogContent className="max-w-xl rounded-[2.5rem] border-slate-100 p-8 sm:p-12 shadow-3xl bg-white font-sans">
                <DialogHeader className="mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                    <Calculator className="w-6 h-6 text-slate-900" />
                  </div>
                  <DialogTitle className="text-[28px] font-black tracking-tight text-[#0F172A]">Pricing Physics</DialogTitle>
                  <DialogDescription className="text-slate-400 font-bold text-sm uppercase tracking-widest pt-1">The Logic Behind Every Lead</DialogDescription>
                </DialogHeader>

                <div className="space-y-8">
                  <div className="bg-slate-900 rounded-3xl p-8 text-center relative overflow-hidden group">
                     <div className="relative z-10">
                        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-4">Master Formula</p>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-white">
                           <span className="text-xl font-black px-3 py-1 bg-white/10 rounded-lg text-red-400">((SQFT</span>
                           <span className="text-slate-500 font-black">×</span>
                           <span className="text-xl font-black px-3 py-1 bg-white/10 rounded-lg text-amber-400">Rate)</span>
                           <span className="text-slate-500 font-black">×</span>
                           <span className="text-xl font-black px-3 py-1 bg-white/10 rounded-lg text-emerald-400">Pitch)</span>
                           <span className="text-slate-500 font-black">+</span>
                           <span className="text-xl font-black px-3 py-1 bg-white/10 rounded-lg text-blue-400">Fees</span>
                        </div>
                     </div>
                     <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-red-500/10 rounded-full blur-3xl" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[12px] font-black text-red-500 uppercase tracking-widest">SQFT (Size)</p>
                      <p className="text-[14px] text-slate-600 font-bold leading-tight">The 2D footprint of the roof area.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] font-black text-amber-500 uppercase tracking-widest">Rate (Material)</p>
                      <p className="text-[14px] text-slate-600 font-bold leading-tight">Price per square foot based on chosen material.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] font-black text-emerald-500 uppercase tracking-widest">Pitch (Complexity)</p>
                      <p className="text-[14px] text-slate-600 font-bold leading-tight">Steepness multiplier (e.g. 1.25x for moderate slope).</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] font-black text-blue-500 uppercase tracking-widest">Fees (Fixed)</p>
                      <p className="text-[14px] text-slate-600 font-bold leading-tight">Transportation, disposal, and mobilization fees.</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50">
                    <p className="text-center text-[13px] text-slate-400 font-bold italic italic">
                      "Mathematically precise. Professional confidence."
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-slate-500 mt-4 text-[15px] font-medium leading-relaxed max-w-sm">
            No guesswork. You have 100% control over the numbers your homeowners see.
          </p>
        </div>

        <div className="flex bg-[#F1F5F9] p-1.5 rounded-2xl mb-8 shadow-inner overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('name')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${activeTab === 'name' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Settings2 className="w-4 h-4" /> Name
          </button>
          <button
            onClick={() => setActiveTab('sizing')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${activeTab === 'sizing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home className="w-4 h-4" /> Sizing
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${activeTab === 'materials' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Layers className="w-4 h-4" /> Materials
          </button>
          <button
            onClick={() => setActiveTab('markups')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${activeTab === 'markups' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Layers className="w-4 h-4" /> Markups
          </button>
          <button
            onClick={() => setActiveTab('sequence')}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${activeTab === 'sequence' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Settings2 className="w-4 h-4" /> Sequence
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="flex-1 pb-10"
          >
            {/* TAB 1: Sizing */}
            {activeTab === 'sizing' && (
              <section className="space-y-4">
                <div className="mb-6 px-1">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Manual Size Defaults</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {sizeOrder.map(({ key, label }) => {
                    const value = config.free_tier_averages[key as keyof typeof config.free_tier_averages]
                    return (
                      <div key={key} className="group bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-6 transition-all duration-300 shadow-sm flex items-center justify-between gap-6">
                        <div className="flex-1">
                          <Label className={LABEL_CLASS}>{label}</Label>
                        </div>
                        <PremiumInput
                          value={value === 0 ? "" : value}
                          placeholder="0"
                          suffix="SQFT"
                          onChange={(val: string) => {
                            const num = parseInt(val) || 0
                            setConfig(prev => ({
                              ...prev,
                              free_tier_averages: { ...prev.free_tier_averages, [key]: num }
                            }))
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* TAB 1: Materials */}
            {activeTab === 'materials' && (
              <section className="space-y-10">
                 <div>
                  <div className="mb-6 px-1">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight text-[20px]">Materials You Offer</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1">Select the roof types homeowners can get estimates for.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-10">
                    {[
                      { id: 'asphalt', img: '/asphalt.jpg' },
                      { id: 'metal', img: '/materials/metal.jpg' },
                      { id: 'tile', img: '/tiles.jpg' },
                      { id: 'cedar', img: '/materials/cedar.png' }
                    ].map((item) => {
                      const offered = config.offered_materials?.includes(item.id) ?? true
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            const current = config.offered_materials ?? ['asphalt', 'tile', 'metal', 'cedar']
                            const next = offered 
                              ? current.filter(m => m !== item.id)
                              : [...current, item.id]
                            setConfig(prev => ({ ...prev, offered_materials: next }))
                          }}
                          className={cn(
                            "group relative h-28 rounded-[2rem] border-2 transition-all p-4 flex items-center gap-4 overflow-hidden",
                            offered 
                              ? "border-red-600 bg-white shadow-xl shadow-red-50" 
                              : "border-slate-100 bg-white grayscale opacity-60 hover:opacity-100 hover:grayscale-0 hover:border-slate-300"
                          )}
                        >
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                             <img src={item.img} className="w-full h-full object-cover" alt={item.id} />
                          </div>
                          <div className="flex-1 text-left">
                            <span className={cn("block font-black text-[15px] capitalize", offered ? "text-slate-900" : "text-slate-400")}>{item.id}</span>
                            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-widest">{offered ? "Currently Offered" : "Inactive"}</span>
                          </div>
                          {offered && <CheckCircle2 className="w-5 h-5 text-red-600 absolute top-4 right-4" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-6 px-1">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight text-[20px]">Base Material Rates</h3>
                    <p className="text-slate-400 font-bold text-sm mt-1">Set your cost per square foot for each material.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {['asphalt', 'metal', 'tile', 'cedar'].map((key) => {
                      const value = config.materials[key] ?? 0
                      const offered = config.offered_materials?.includes(key) ?? true
                      return (
                        <div key={key} className={cn(
                          "group bg-white border rounded-3xl p-6 transition-all duration-300 shadow-sm flex items-center justify-between gap-6",
                          offered ? "border-slate-100 hover:border-slate-200" : "border-slate-50 opacity-50 grayscale select-none"
                        )}>
                          <div className="flex-1">
                            <p className={`${LABEL_CLASS} capitalize text-[17px]`}>{key.replace(/_/g, ' ')}</p>
                            <p className={SUBTEXT_CLASS}>Cost per Square Foot</p>
                          </div>
                          <div className="flex items-center gap-4">
                            {!offered && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Not Offered</span>
                            )}
                            <PremiumInput
                              value={value === 0 ? "" : value}
                              placeholder="0.00"
                              step={0.5}
                              prefix="$"
                              onChange={(val: string) => handleUpdateMaterial(key, val)}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* TAB 3: Markups & Fees */}
            {activeTab === 'markups' && (
              <div className="space-y-10">
                {/* Pitch Modifiers */}
                <section className="space-y-4">
                  <div className="mb-6 px-1">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Pitch Multipliers</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {PITCH_METADATA.map((pitch) => {
                      const value = config.modifiers.pitch[pitch.id as keyof typeof config.modifiers.pitch] ?? 1.0
                      return (
                        <div key={pitch.id} className="bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-6">
                          <div className="space-y-1.5 flex-1">
                            <Label className={LABEL_CLASS}>{pitch.label}</Label>
                            <p className={SUBTEXT_CLASS}>{pitch.sub}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="text-[12px] font-black text-slate-300 uppercase tracking-tighter shrink-0">x</div>
                             <PremiumInput
                               value={value === 0 ? "" : value}
                               placeholder="1.00"
                               step={0.05}
                               onChange={(val: string) => handleUpdatePitch(pitch.id, val)}
                             />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Flat Fees */}
                <section className="bg-white border-2 border-slate-900 rounded-[2.5rem] p-8 text-slate-900 relative overflow-hidden group shadow-2xl shadow-slate-200/50">
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                    <div className="space-y-2">
                       <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center mb-2">
                          <DollarSign className="w-4 h-4 text-white" />
                       </div>
                      <h4 className="text-[18px] font-black tracking-tight">
                        Base Mobilization Fee
                      </h4>
                      <p className="text-slate-400 text-[13.5px] font-bold leading-relaxed max-w-[240px]">
                        Fixed project cost covering setup, permits, and waste disposal.
                      </p>
                    </div>
                    <PremiumInput
                      value={config.flat_fees === 0 ? "" : config.flat_fees}
                      placeholder="0"
                      prefix="$"
                      step={50}
                      onChange={(val: string) => handleUpdateFlatFee(val)}
                    />
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-all duration-700" />
                </section>
              </div>
            )}

            {/* TAB 4: Sequence */}
            {activeTab === 'sequence' && (
              <section className="space-y-6">
                <div className="px-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Question Sequence</h3>
                  <p className="text-slate-400 font-bold text-sm mt-1">Toggle optional lead-capture questions for this widget.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                   {[
                     { id: 'buildingType', label: 'Building Type', sub: 'Ask if Residential vs Commercial', icon: '🏢' },
                     { id: 'currentMaterial', label: 'Current Material', sub: 'What is currently on their roof', icon: '🏠' },
                     { id: 'desiredMaterial', label: 'Desired Material', sub: 'What material they want to switch to', icon: '✨' },
                     { id: 'timeline', label: 'Project Timeline', sub: 'How soon they want to start', icon: '📅' },
                     { id: 'financing', label: 'Financing Interest', sub: 'Ask if they need monthly payments', icon: '💰' }
                   ].map((item) => {
                     const active = stepToggles[item.id as keyof typeof stepToggles]
                     return (
                       <button 
                         key={item.id}
                         onClick={() => setStepToggles(prev => ({ ...prev, [item.id]: !active }))}
                         className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all cursor-pointer ${active ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-100 bg-white opacity-60 grayscale"}`}
                       >
                         <div className="flex items-center gap-4 text-left">
                           <span className="text-2xl">{item.icon}</span>
                           <div>
                             <p className="font-black text-slate-900">{item.label}</p>
                             <p className="text-[13px] text-slate-400 font-bold">{item.sub}</p>
                           </div>
                         </div>
                         <div className={`w-12 h-6 rounded-full relative transition-colors ${active ? "bg-red-700" : "bg-slate-200"}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${active ? "left-7" : "left-1"}`} />
                         </div>
                       </button>
                     )
                   })}
                </div>
              </section>
            )}

            {/* TAB 1: Name */}
            {activeTab === 'name' && (
              <section className="space-y-6">
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 text-slate-900 relative overflow-hidden group shadow-sm">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Edit3 className="w-4 h-4 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-slate-900">Name your machine</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <Input
                        id="engine-name"
                        value={engineName}
                        onChange={(e) => setEngineName(e.target.value)}
                        className="h-14 bg-slate-50/50 border-slate-100 rounded-xl font-normal text-lg focus-visible:ring-red-600/10 focus-visible:border-red-600 px-6 transition-all text-slate-900 placeholder:text-slate-300 shadow-inner"
                        placeholder="e.g. Premium Estimator"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Content: Live Preview */}
      <div className={cn(
        "w-full lg:flex-1 h-full bg-slate-100/50 flex flex-col items-center justify-start p-6 lg:pt-10 lg:px-10 lg:pb-4 overflow-y-auto relative",
        mobileView !== 'preview' && "hidden lg:flex"
      )}>

        <div className="hidden lg:flex w-full max-w-xl justify-start gap-4 z-20 mb-8 shrink-0">
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">Live Machine Preview</span>
            </div>
          </div>
          {hasChanges && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-700 text-white px-4 py-2.5 rounded-xl shadow-xl shadow-red-200 text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              Unsaved Changes
            </motion.div>
          )}
        </div>

        <div className="flex lg:hidden w-full max-w-xl items-center justify-between mb-6 shrink-0">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Preview</span>
          </div>
          {hasChanges && (
            <span className="text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3" /> Unsaved
            </span>
          )}
        </div>

        <div className="w-full max-w-xl transition-all duration-500 lg:hover:scale-[1.01] relative z-10 shrink-0 mb-12">
          <RoofingWidget 
            isPro={isPro} 
            config={{ ...config, steps: stepToggles }} 
            calculatorId="preview-mode" 
            companyName={companyName}
            companyLogoUrl={companyLogoUrl}
          />
          
          <p className="text-center mt-6 text-slate-400 font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-20 lg:mb-0">
            This preview uses the exact <span className="text-slate-900 border-b-2 border-slate-900">pricing rules</span> you set.
          </p>
        </div>

        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed lg:absolute bottom-6 lg:bottom-10 right-4 lg:right-10 z-50 lg:z-30 w-[calc-100%-2rem)] lg:w-auto"
            >
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full lg:w-auto h-16 px-10 bg-[#0F172A] hover:bg-black text-white font-black rounded-2xl shadow-2xl shadow-slate-400/50 flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-white lg:border-none"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Pricing Rules
                <ChevronRight className="w-4 h-4 text-slate-500 hidden sm:block" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-slate-100 p-8 shadow-2xl bg-white font-sans text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border-4 border-emerald-100">
               <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-[28px] font-black tracking-tight text-[#0F172A] leading-tight">
                Pricing Rules <br /> Saved Successfully!
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium text-[16px] leading-relaxed">
                Your lead machine has been updated with your latest numbers.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col w-full gap-3 pt-4">
              <Button 
                onClick={() => setShowSuccess(false)}
                className="h-14 bg-[#F1F5F9] hover:bg-slate-200 text-[#0F172A] font-black rounded-2xl border-none shadow-none text-[15px]"
              >
                Keep Editing
              </Button>
              <Button 
                render={
                  <Link href="/calculators" className="flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> 
                    <span>Back to Dashboard</span>
                  </Link>
                }
                nativeButton={false}
                className="h-16 bg-[#0F172A] hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-200 border-none text-[16px] w-full"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}