"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, MapPin, Zap, ArrowLeft, Home, Search, Loader2, ExternalLink } from "lucide-react"
import { QCLogo } from "@/components/QCLogo"

import { PricingConfig, calculateEstimate } from "@/lib/pricingEngine"
import { getRoofEstimation } from "@/app/actions/solar"
import { triggerLeadWebhook } from "@/app/actions/integrations"

const variants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
}

// Inline SVG icons for each roof pitch — clean minimal line art
const PitchIcon = ({ type, active }: { type: string; active: boolean }) => {
  const stroke = active ? "#b91c1c" : "#475569"
  const sw = "2"
  const dx = active ? "0" : "0" // keeping it simple
  
  if (type === "flat") return (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-12">
      <path d="M4 32 H60" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <path d="M8 32 V40 H56 V32" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
  if (type === "low") return (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-12">
      <path d="M4 32 L32 20 L60 32" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 32 V40 H56 V32" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
  if (type === "standard") return (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-12">
      <path d="M4 34 L32 12 L60 34" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 34 V42 H56 V34" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
  // steep
  return (
    <svg viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-12">
      <path d="M4 38 L32 4 L60 38" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 38 V44 H52 V38" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  )
}

const PITCH_OPTIONS = [
  { id: "flat",     label: "Flat",     sub: "Safe to walk on" },
  { id: "low",      label: "Low",       sub: "Easy to climb" },
  { id: "standard", label: "Moderate",  sub: "Walk with caution" },
  { id: "steep",    label: "Steep",     sub: "Harness required" },
]

const MATERIAL_IMAGES: Record<string, { bg: string; label: string; sub: string }> = {
  asphalt: { bg: "/asphalt.jpg", label: "Premium Asphalt", sub: "Most popular choice" },
  tile:    { bg: "/tiles.jpg", label: "Luxury Tile",        sub: "Spanish & Concrete styles" },
}

type FormData = {
  sqFt: string
  address: string
  material: string
  pitch: string
  firstName: string
  email: string
  phone: string
  notes: string
}

export default function RoofingWidget({
  isPro, config, calculatorId,
}: {
  isPro: boolean
  config: PricingConfig
  calculatorId: string
}) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    sqFt: "", address: "", material: "", pitch: "", firstName: "", email: "", phone: "", notes: "",
  })
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingState, setLoadingState] = useState<string | null>(null)

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  const handleSelect = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setTimeout(() => nextStep(), 250)
  }

  const handleAddressLookup = async () => {
    if (!formData.address.trim()) return
    setLoadingState("Connecting to satellite...")
    
    try {
      const result = await getRoofEstimation(formData.address)
      
      setLoadingState("Analyzing structure...")
      await new Promise(r => setTimeout(r, 800))
      
      setFormData(prev => ({ 
        ...prev, 
        sqFt: result.areaSqFt.toString(),
        address: result.formattedAddress || prev.address 
      }))
      
      setLoadingState(null)
      nextStep()
    } catch (error: any) {
      console.error(error)
      setLoadingState(null)
      alert(error.message || "Could not find property data. Please enter manually.")
    }
  }

  const handleCalculate = async () => {
    setIsSubmitting(true)
    const price = calculateEstimate(
      { sqFt: formData.sqFt, material: formData.material, pitch: formData.pitch },
      config
    )
    setEstimatedPrice(price)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculator_id: calculatorId,
          first_name: formData.firstName,
          email: formData.email,
          phone: formData.phone,
          form_data: formData,
          estimated_price: price,
        }),
      })

      if (response.ok) {
        const lead = await response.json()
        // Trigger Pro Webhook if applicable
        await triggerLeadWebhook(lead)
      }
    } catch (e) { 
      console.error("Lead submission error:", e) 
    } 
    finally {
      setIsSubmitting(false)
      nextStep()
    }
  }

  const totalSteps = isPro ? 6 : 6

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-xl lg:shadow-[0_32px_84px_rgba(0,0,0,0.12)] border border-slate-100/80 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden flex flex-col font-sans touch-manipulation ring-1 ring-slate-900/5">
      {/* Header */}
      <div className="px-5 lg:px-8 pt-6 lg:pt-8 pb-3 lg:pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {step > 1 && step < 6 && (
              <button
                onClick={prevStep}
                className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </button>
            )}
            <div className="flex flex-col">
              <span className="text-[13px] font-black uppercase tracking-[0.1em] text-slate-400 leading-none mb-1.5">Estimator Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-black text-slate-900">Step {step}/{totalSteps}</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? "w-4 bg-red-700" : "w-1 bg-slate-100"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-slate-200">
            <QCLogo size={28} isDark={false} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-5 lg:px-8 pb-6 lg:pb-8 min-h-[360px] lg:min-h-[380px] flex flex-col relative pointer-events-auto">
          {/* Step 1: Address (Pro) / Size (Free) */}
          {step === 1 && (
            <div key="st1" className="space-y-6 animate-in fade-in duration-300">
              {isPro ? (
                <>
                  <div className="space-y-1">
                    <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Property Address</h2>
                    <p className="text-[15px] text-slate-500 font-medium">We'll use satellite data to estimate dimensions.</p>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-6 w-6 text-slate-300 group-focus-within:text-red-700 transition-colors" />
                    </div>
                    <Input
                      className="pl-12 h-16 bg-slate-50 border-slate-100 focus-visible:ring-red-700/10 focus-visible:border-red-700 text-slate-900 placeholder:text-slate-300 rounded-3xl text-[18px] font-bold transition-all shadow-inner"
                      placeholder="Street address, City, ZIP"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleAddressLookup()}
                    />
                  </div>
                  <button
                    onClick={handleAddressLookup}
                    disabled={!formData.address.trim() || !!loadingState}
                    className="w-full h-16 bg-[#0F172A] hover:bg-black active:bg-slate-800 text-white rounded-[1.5rem] font-black text-[15px] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer pointer-events-auto"
                  >
                    {loadingState ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> {loadingState}</>
                    ) : (
                      <>Generate AI Estimate <ArrowLeft className="w-4 h-4 rotate-180" /></>
                    )}
                  </button>
                  <button onClick={nextStep} className="w-full text-center text-[15px] font-bold text-slate-400 hover:text-slate-900 transition-colors cursor-pointer pointer-events-auto">
                    Skip and enter square footage manually
                  </button>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Roof Size</h1>
                    <p className="text-[15px] text-slate-500 font-medium">Approximate square footage of your home.</p>
                  </div>
                  <div className="grid gap-3">
                    {[
                      { id: "under_1500", label: "Under 1,500 sq ft", sub: "Small or Single Story" },
                      { id: "1500_2500",  label: "1,500 – 2,500 sq ft", sub: "Average Family Home" },
                      { id: "over_2500",  label: "2,500+ sq ft",       sub: "Large or Multi-Story" },
                    ].map((item) => {
                      const active = formData.sqFt === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect("sqFt", item.id)}
                          onPointerDown={() => handleSelect("sqFt", item.id)}
                          className={`w-full p-5 rounded-3xl border-2 text-left group cursor-pointer pointer-events-auto ${
                            active
                              ? "border-red-700 bg-red-50/50 shadow-md"
                              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
                          }`}
                        >
                          <p className={`text-[18px] font-black transition-colors ${active ? "text-red-800" : "text-slate-900"}`}>{item.label}</p>
                          <p className="text-[15px] text-slate-400 font-bold mt-0.5">{item.sub}</p>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Material */}
          {step === 2 && (
            <div key="st2" className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Roofing Material</h2>
                <p className="text-[15px] text-slate-500 font-medium">Choose your preferred structural style.</p>
              </div>
              <div className="grid gap-4">
                {Object.entries(MATERIAL_IMAGES).map(([id, { bg, label, sub }]) => {
                  const active = formData.material === id
                  return (
                    <button
                      key={id}
                      onClick={() => handleSelect("material", id)}
                      className={`group relative h-36 rounded-[2rem] overflow-hidden transition-all duration-500 cursor-pointer pointer-events-auto ${
                        active ? "ring-4 ring-red-700 ring-offset-2 shadow-2xl scale-[1.02]" : ""
                      }`}
                    >
                      <img src={bg} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className={`absolute inset-0 transition-opacity duration-300 ${active ? "bg-orange-900/40" : "bg-black/50 group-hover:bg-black/40"}`} />
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <p className="text-white font-black text-[22px] tracking-tight">{label}</p>
                        <p className="text-white/70 text-[15px] font-bold">{sub}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Pitch */}
          {step === 3 && (
            <div key="st3" className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Roof Steepness</h2>
                <p className="text-[15px] text-slate-500 font-medium">Select the pitch that matches your home.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {PITCH_OPTIONS.map(({ id, label, sub }) => {
                  const active = formData.pitch === id
                  return (
                    <button
                      key={id}
                      onClick={() => handleSelect("pitch", id)}
                      className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-300 group cursor-pointer pointer-events-auto ${
                        active
                          ? "border-red-700 bg-red-50/50 shadow-md scale-[1.02]"
                          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="mb-4">
                        <PitchIcon type={id} active={active} />
                      </div>
                      <p className={`text-[18px] font-black transition-colors ${active ? "text-red-800" : "text-slate-900"}`}>{label}</p>
                      <p className="text-[13px] text-slate-400 font-black uppercase tracking-widest mt-1">{sub}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Notes */}
          {step === 4 && (
            <div key="st4" className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Additional Details <span className="text-slate-400 font-bold text-[18px] ml-1">(Optional)</span></h2>
              </div>
              <textarea
                placeholder="Are there skylights? Solar panels? Chimneys? Tell us more..."
                className="w-full min-h-[160px] p-6 bg-slate-50 border-slate-100 focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 rounded-[2rem] text-[16px] font-bold text-slate-900 placeholder:text-slate-400 transition-all resize-none shadow-inner"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
              <button
                onClick={nextStep}
                className="w-full h-16 bg-[#0F172A] hover:bg-black text-white rounded-[1.5rem] font-black text-[15px] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
              >
                Continue <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}

          {/* Step 5: Final Details */}
          {step === 5 && (
            <div key="st5" className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">One Last Step</h2>
                <p className="text-[15px] text-slate-500 font-medium">Verify your details to secure your estimate.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[14px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</Label>
                  <Input className="h-14 bg-slate-50 border-slate-100 focus-visible:ring-red-700/10 focus-visible:border-red-700 rounded-2xl px-5 text-[16px] font-bold" placeholder="John Smith" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</Label>
                  <Input type="email" className="h-14 bg-slate-50 border-slate-100 focus-visible:ring-red-700/10 focus-visible:border-red-700 rounded-2xl px-5 text-[16px] font-bold" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[14px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</Label>
                  <Input type="tel" className="h-14 bg-slate-50 border-slate-100 focus-visible:ring-red-700/10 focus-visible:border-red-700 rounded-2xl px-5 text-[16px] font-bold" placeholder="(555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <button
                  onClick={handleCalculate}
                  disabled={!formData.firstName || !formData.email || !formData.phone || isSubmitting}
                  className="w-full h-16 bg-gradient-to-r from-red-700 to-red-800 hover:to-red-900 text-white rounded-[1.5rem] font-black text-[15px] transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 pointer-events-auto"
                >
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Finalizing...</> : <>Reveal My Estimate →</>}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Result */}
          {step === 6 && (
            <div key="st6" className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center border-2 border-emerald-100 shadow-sm">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <p className="text-[16px] font-black text-slate-400 uppercase tracking-[0.2em]">Predicted Range</p>
                <h1 className="text-[56px] font-black text-[#0F172A] tracking-tighter leading-none">
                  {estimatedPrice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(estimatedPrice) : '$0'}
                </h1>
                <p className="text-[16px] text-slate-500 font-bold">
                  Financing available from <span className="text-red-700">{estimatedPrice ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(estimatedPrice/120) : '$0'}/mo</span>
                </p>
              </div>
              <div className="w-full pt-4 space-y-3">
                 <button className="w-full h-16 bg-[#0F172A] hover:bg-black text-white rounded-[1.5rem] font-black text-[18px] transition-all shadow-2xl shadow-slate-200 cursor-pointer pointer-events-auto">
                   Book Priority Inspection
                 </button>
                 <p className="text-[14px] text-slate-400 font-bold">Expect a call from our expert within 2 hours.</p>
              </div>
            </div>
          )}
      </div>

      {/* Footer Branding */}
      {!isPro && (
        <a 
          href="/" 
          target="_blank" 
          className="flex items-center justify-center gap-2.5 py-5 bg-slate-50/50 border-t border-slate-100 group transition-colors hover:bg-slate-50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
            <QCLogo size={14} isDark={false} />
          </div>
          <p className="text-[14px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
            Powered by <span className="font-black text-slate-900">QuoteCatch</span>
          </p>
          <ExternalLink className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -ml-1" />
        </a>
      )}
    </div>
  )
}

