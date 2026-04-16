"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, MapPin, Zap, ArrowLeft, ArrowRight, Home, Search, Loader2, ExternalLink, ChevronRight, X } from "lucide-react"
import { GoogleMap, Autocomplete, useJsApiLoader } from "@react-google-maps/api"

import { PricingConfig, calculateEstimate } from "@/lib/pricingEngine"
import { getRoofEstimation } from "@/app/actions/solar"
import { triggerLeadWebhook } from "@/app/actions/integrations"
import { getAddressSuggestions } from "@/app/actions/places"

const variants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
}

const GOOGLE_MAPS_LIBRARIES: any = ["places"]

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
  { id: "flat", label: "Flat", sub: "Safe to walk on" },
  { id: "low", label: "Low", sub: "Easy to climb" },
  { id: "standard", label: "Moderate", sub: "Walk with caution" },
  { id: "steep", label: "Steep", sub: "Harness required" },
]

const MATERIAL_IMAGES: Record<string, { bg: string; label: string; sub: string }> = {
  asphalt: { bg: "/asphalt.jpg", label: "Premium Asphalt", sub: "Most popular choice" },
  tile: { bg: "/tiles.jpg", label: "Luxury Tile", sub: "Spanish & Concrete styles" },
  metal: { bg: "/materials/metal.jpg", label: "Standing Seam Metal", sub: "Lifetime durability" },
  cedar: { bg: "/materials/cedar.png", label: "Natural Cedar", sub: "Premium wood shake" },
}

type FormData = {
  sqFt: string
  address: string
  buildingType: string
  material: string
  desiredMaterial: string
  pitch: string
  timeline: string
  financing: string
  firstName: string
  email: string
  phone: string
  notes: string
}

export default function RoofingWidget({
  isPro, config, calculatorId, companyName, companyLogoUrl, isDemo = false
}: {
  isPro: boolean
  config: PricingConfig
  calculatorId: string
  companyName?: string
  companyLogoUrl?: string
  isDemo?: boolean
}) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    sqFt: isDemo ? "2450" : "", 
    address: isDemo ? "21345 Lassen St, Chatsworth, CA 91311" : "", 
    buildingType: "", material: "", desiredMaterial: "", pitch: "", timeline: "", financing: "", firstName: "", email: "", phone: "", notes: "",
  })
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingState, setLoadingState] = useState<string | null>(null)
  const [isAdvancing, setIsAdvancing] = useState(false)
  
  const [addressSuggestions, setAddressSuggestions] = useState<{description: string, placeId: string}[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // -- MODULAR STEP LOGIC --
  const stepsConfig = [
    { id: 'INTRO', show: true },
    { id: 'ADDRESS', show: true },
    { id: 'BUILDING_TYPE', show: config.steps?.buildingType ?? true },
    { id: 'MATERIAL_CURRENT', show: config.steps?.currentMaterial ?? true },
    { id: 'MATERIAL_DESIRED', show: config.steps?.desiredMaterial ?? true },
    { id: 'PITCH', show: true },
    { id: 'TIMELINE', show: config.steps?.timeline ?? false },
    { id: 'FINANCING', show: config.steps?.financing ?? false },
    { id: 'NOTES', show: true },
    { id: 'LEAD_CAPTURE', show: true },
    { id: 'RESULT', show: isDemo }
  ]

  const visibleSteps = stepsConfig.filter(s => s.show)
  const questionSteps = visibleSteps.filter(s => s.id !== 'INTRO' && s.id !== 'RESULT')
  const totalQuestions = questionSteps.length
  
  const currentStepId = visibleSteps[step - 1]?.id
  // Find current step's index in the question array for accurate counting
  const currentQuestionIndex = questionSteps.findIndex(s => s.id === currentStepId)

  // Map State
  const [mapCenter, setMapCenter] = useState({ lat: 34.256, lng: -118.601 }) // Default to Chatsworth for demo
  const [mapZoom, setMapZoom] = useState(isDemo ? 18 : 4)
  const [addressConfirmed, setAddressConfirmed] = useState(isDemo)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  // Log specific load error for debugging in production console
  if (loadError) {
    console.error("Google Maps Load Error:", loadError)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const formattedAddress = place.formatted_address || ""
        
        setFormData(prev => ({ ...prev, address: formattedAddress }))
        setMapCenter({ lat, lng })
        setMapZoom(20)
        setAddressConfirmed(true)
        
        // Background pre-fetch: Trigger estimation immediately after selection
        handleAddressLookup(formattedAddress, false)
      }
    }
  }

  const handleConfirmProperty = () => {
    // Immediate transition! The background fetch is already handling the data.
    nextStep()
  }

  const nextStep = () => {
    if (isAdvancing) return
    setIsAdvancing(true)
    setStep((s) => s + 1)
    setTimeout(() => setIsAdvancing(false), 400) // Cooling period to prevent tap-through
  }

  const prevStep = () => {
    setStep((s) => s - 1)
  }

  const handleSelect = (field: keyof FormData, value: string) => {
    if (isAdvancing) return
    setIsAdvancing(true) // Lock immediately!
    
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Slightly longer timeout for visual feedback of selection before moving
    setTimeout(() => {
      setStep((s) => s + 1)
      setTimeout(() => setIsAdvancing(false), 400) // Cooling period for ghost clicks
    }, 300)
  }

  const handleAddressLookup = async (selectedAddress?: string, shouldAdvance: boolean = true) => {
    const addr = selectedAddress || formData.address
    if (!addr.trim()) return

    if (isDemo) {
      setFormData(prev => ({
        ...prev,
        sqFt: "2450", // Static mock size
        address: addr
      }))
      if (shouldAdvance) nextStep()
      return
    }
    
    // If we're already loading or have data, we might not need to do this again
    // but for now let's keep it simple
    setLoadingState("Connecting to satellite...")
    setShowSuggestions(false)
    setErrorMessage(null)

    try {
      const result = await getRoofEstimation(addr, calculatorId)

      if (!result.success) {
        setLoadingState(null)
        if (result.errorType === 'NO_DATA') {
          setErrorMessage("Satellite scan unavailable for this specific property. Please enter manually.")
        } else {
          setErrorMessage(result.error || "Could not connect to satellite.")
        }
        return
      }

      setFormData(prev => ({
        ...prev,
        sqFt: result.areaSqFt?.toString() || "",
        address: result.formattedAddress || addr
      }))

      setLoadingState(null)
      if (shouldAdvance) nextStep()
    } catch (error: any) {
      console.error("Widget Estimation Error:", error)
      setLoadingState(null)
      // Only show error if we're not doing background work, 
      // or if we want them to know it failed.
      setErrorMessage("An unexpected error occurred. Please try manual entry.")
    }
  }

  const handleAddressChange = async (val: string) => {
    setFormData({ ...formData, address: val })
    setErrorMessage(null)
    if (val.length > 3) {
      const suggestions = await getAddressSuggestions(val)
      setAddressSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } else {
      setAddressSuggestions([])
      setShowSuggestions(false)
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

  const handleCalculateAndRedirect = async () => {
    setIsSubmitting(true)
    const price = calculateEstimate(
      { sqFt: formData.sqFt, material: formData.material, pitch: formData.pitch },
      config
    )
    
    try {
       const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculator_id: calculatorId,
          estimated_price: price,
          address: formData.address,
          notes: formData.notes,
          homeowner_name: formData.firstName,
          homeowner_email: formData.email,
          homeowner_phone: formData.phone,
          form_data: {
            ...formData,
            config: config
          }
        }),
      })

      if (isDemo) {
        setEstimatedPrice(price)
        setIsSubmitting(false)
        nextStep()
        return
      }

      if (response.ok) {
        const { id } = await response.json()
        router.push(`/estimates/${id}`)
      } else {
        const err = await response.json()
        console.error("Submission error:", err)
      }
    } catch (e) {
      console.error("Lead submission error:", e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-xl lg:shadow-[0_32px_84px_rgba(0,0,0,0.12)] border border-slate-100/80 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden flex flex-col font-sans touch-manipulation ring-1 ring-slate-900/5 min-h-[580px]">
      {/* Header - Hidden on Intro and Result */}
      {currentStepId !== 'INTRO' && currentStepId !== 'RESULT' && (
        <div className="px-5 lg:px-8 pt-6 lg:pt-8 pb-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </button>
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-500/80 tracking-tight">Step {currentQuestionIndex + 1} of {totalQuestions}</span>
                  <div className="flex gap-1 ml-1">
                    {questionSteps.map((_, i) => (
                      <div key={i} className={`h-1 !rounded-full transition-all duration-500 ${i <= currentQuestionIndex ? "w-3 bg-red-700" : "w-1 bg-slate-100"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}      {/* Main Content Area */}
      <div className="flex-1 px-5 lg:px-8 pb-6 lg:pb-8 flex flex-col relative pointer-events-auto">
        
        {/* Step: Intro */}
        {currentStepId === 'INTRO' && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95 duration-1000 relative overflow-hidden">
            {/* Minimal Background Art - similar to screenshot */}
            <div className="absolute top-4 left-4 opacity-[0.06] -rotate-12 pointer-events-none">
              <div className="relative">
                <Home className="w-32 h-32 lg:w-48 lg:h-48" strokeWidth={0.5} />
                <MapPin className="absolute top-4 right-4 w-6 h-6 lg:w-10 lg:h-10 opacity-40" />
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 opacity-[0.06] rotate-12 pointer-events-none">
              <div className="flex flex-col items-end gap-2">
                <Home className="w-24 h-24 lg:w-40 lg:h-40" strokeWidth={0.5} />
                <div className="flex gap-2">
                   <Zap className="w-5 h-5 opacity-40" />
                   <CheckCircle className="w-5 h-5 opacity-40" />
                </div>
              </div>
            </div>

            <div className="w-full max-w-lg mx-auto flex flex-col items-center z-10 px-6">
              {/* Branding Header */}
              <div className="mb-10 lg:mb-12 flex flex-col items-center">
                {companyLogoUrl ? (
                  <div className="h-16 lg:h-20 flex items-center justify-center">
                    <img src={companyLogoUrl} alt={companyName} className="h-full w-auto object-contain" />
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
                       <Home className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tighter uppercase whitespace-normal text-left">{companyName || "Roofing Specialist"}</span>
                  </div>
                )}
              </div>

              <h1 className="text-[36px] lg:text-[54px] font-black text-[#0F172A] text-center leading-[1.05] tracking-tighter mb-6">
                Get a <span className="italic underline underline-offset-[8px] decoration-red-600/30">free</span> instant estimate
              </h1>

              <p className="text-[17px] lg:text-[20px] text-slate-500 text-center font-medium leading-relaxed mb-12 max-w-md">
                We use satellite imagery to measure your roof and provide an instant estimate for your roof replacement
              </p>

              <button 
                onClick={nextStep}
                className="w-full max-w-[320px] h-16 lg:h-20 bg-[#1e293b] hover:bg-[#0F172A] text-white rounded-[2rem] font-black text-[20px] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 group cursor-pointer border-none"
              >
                Get started 
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>

              <div className="mt-16 flex items-center gap-3 grayscale opacity-30 hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center">
                  <span className="text-[10px] font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-all">QC</span>
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                </div>
                <span className="text-[12px] font-bold tracking-widest text-slate-400 uppercase">Powered by QuoteCatch</span>
              </div>
            </div>
          </div>
        )}

        {/* Step: Address */}
        {currentStepId === 'ADDRESS' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {isPro ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">What’s your address?</h1>
                </div>

                <div className="bg-white rounded-xl overflow-hidden shadow-sm relative group border border-slate-100/50">
                  <div className="w-full h-[450px] bg-slate-100 relative">
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        center={mapCenter}
                        zoom={mapZoom}
                        options={{ mapTypeId: 'satellite', disableDefaultUI: true, tilt: 45 }}
                        onLoad={map => map.setTilt(45)}
                      >
                        <AnimatePresence>
                          {addressConfirmed && (
                            <motion.div initial={{ opacity: 0, scale: 2 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                               <div className="w-14 h-14 border-2 border-white/50 rounded-full flex items-center justify-center backdrop-blur-[1px]">
                                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]" />
                               </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GoogleMap>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
                      </div>
                    )}

                    <div className="absolute top-4 left-4 right-4 z-20 flex items-start justify-between gap-4">
                      <div className="flex-1 max-w-md">
                        <div className="relative">
                          {isLoaded && (
                            <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged} options={{ types: ['address'] }}>
                              <div className="relative">
                                <Input 
                                  type="text"
                                  placeholder="1234 Street Name, City, State"
                                  value={formData.address}
                                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                  className="h-12 pl-4 pr-10 rounded-lg border-none bg-white text-slate-900 shadow-xl font-medium text-[15px] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                                />
                                {formData.address && (
                                  <button onClick={() => { setFormData({...formData, address: ""}); setAddressConfirmed(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <span className="text-lg">×</span>
                                  </button>
                                )}
                              </div>
                            </Autocomplete>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {addressConfirmed && (
                          <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onClick={handleConfirmProperty} className="bg-white text-blue-600 border-2 border-blue-600 px-8 h-12 rounded-full font-bold shadow-xl hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-2">
                            Continue
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2">
                       <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-slate-400 border border-slate-200/50">QUOTECATCH SATELLITE HD</div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[13px] text-slate-400 font-medium">
                  {addressConfirmed ? "Property high-resolution scan ready for analysis." : "Enter your address to begin your instant satellite roof scan."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Roof Size</h1>
                  <p className="text-[15px] text-slate-500 font-medium">Approximate square footage of your home.</p>
                </div>
                <div className="grid gap-3">
                  {[{ id: "under_1500", label: "Under 1,500 sq ft", sub: "Small or Single Story" }, { id: "1500_2500", label: "1,500 – 2,500 sq ft", sub: "Average Family Home" }, { id: "over_2500", label: "2,500+ sq ft", sub: "Large or Multi-Story" }].map((item) => {
                    const active = formData.sqFt === item.id;
                    return (
                      <button key={item.id} onClick={() => handleSelect("sqFt", item.id)} className={`w-full p-5 rounded-3xl border-2 text-left group cursor-pointer ${active ? "border-red-700 bg-red-50/50 shadow-md" : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"}`}>
                        <p className={`text-[18px] font-bold transition-colors ${active ? "text-red-800" : "text-slate-900"}`}>{item.label}</p>
                        <p className="text-[15px] text-slate-400 font-bold mt-0.5">{item.sub}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step: Building Type */}
        {currentStepId === 'BUILDING_TYPE' && (
          <div key="st_build" className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">What type of building?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "residential", label: "Residential", img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80" },
                { id: "commercial", label: "Commercial", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80" }
              ].map((item) => {
                const active = formData.buildingType === item.id;
                return (
                  <button key={item.id} onClick={() => handleSelect("buildingType", item.id)} className={`group relative h-48 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${active ? "ring-4 ring-red-700 ring-offset-2" : "ring-1 ring-slate-200"}`}>
                    <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white font-bold flex items-center gap-1.5">{item.label} <ArrowLeft className="w-4 h-4 rotate-[135deg]" /></div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Current Material */}
        {currentStepId === 'MATERIAL_CURRENT' && (
          <div key="st_curr_mat" className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Currently on your roof?</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "asphalt", label: "Asphalt", img: "/asphalt.jpg" },
                { id: "metal", label: "Metal", img: "/materials/metal.jpg" },
                { id: "tile", label: "Tile", img: "/tiles.jpg" },
                { id: "cedar", label: "Cedar", img: "/materials/cedar.png" }
              ].map((item) => {
                const active = formData.material === item.id;
                return (
                  <button key={item.id} onClick={() => handleSelect("material", item.id)} className={`group relative h-32 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${active ? "ring-4 ring-slate-900 ring-offset-2 scale-[1.02] shadow-xl" : "ring-1 ring-slate-200"}`}>
                    <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity opacity-80 group-hover:opacity-60" />
                    <div className="absolute bottom-3 left-3 text-white text-sm font-black flex items-center gap-1 drop-shadow-lg">{item.label} <ArrowLeft className="w-3.5 h-3.5 rotate-[135deg]" /></div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Desired Material */}
        {currentStepId === 'MATERIAL_DESIRED' && (
          <div key="st_des_mat" className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Desired roof type?</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "asphalt", label: "Asphalt", img: "/asphalt.jpg" },
                { id: "metal", label: "Metal", img: "/materials/metal.jpg" },
                { id: "tile", label: "Tile", img: "/tiles.jpg" },
                { id: "cedar", label: "Cedar", img: "/materials/cedar.png" }
              ]
              .filter(item => (config.offered_materials ?? ['asphalt', 'tile']).includes(item.id))
              .map((item) => {
                const active = formData.desiredMaterial === item.id;
                return (
                  <button key={item.id} onClick={() => handleSelect("desiredMaterial", item.id)} className={`group relative h-32 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${active ? "ring-4 ring-slate-900 ring-offset-2 scale-[1.02] shadow-xl" : "ring-1 ring-slate-200"}`}>
                    <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity opacity-80 group-hover:opacity-60" />
                    <div className="absolute bottom-3 left-3 text-white text-sm font-black flex items-center gap-1 drop-shadow-lg">{item.label} <ArrowLeft className="w-3.5 h-3.5 rotate-[135deg]" /></div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Pitch */}
        {currentStepId === 'PITCH' && (
          <div key="st_pitch" className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Roof Steepness?</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {PITCH_OPTIONS.map(({ id, label, sub }) => {
                const active = formData.pitch === id;
                return (
                  <button key={id} onClick={() => handleSelect("pitch", id)} className={`flex flex-col items-start p-6 rounded-[2rem] border-2 transition-all duration-300 group cursor-pointer text-left ${active ? "border-red-700 bg-red-50/50 shadow-md scale-[1.02]" : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"}`}>
                    <div className="mb-4"><PitchIcon type={id} active={active} /></div>
                    <p className={`text-[19px] font-black tracking-tight transition-colors ${active ? "text-red-900" : "text-slate-900"}`}>{label}</p>
                    <p className="text-[14px] text-slate-500 font-bold mt-1">{sub}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Project Timeline */}
        {currentStepId === 'TIMELINE' && (
          <div key="st_time" className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Desired timeline?</h2>
            </div>
            <div className="grid gap-4">
              {[
                { id: "none", label: "No timeline", sub: "I do not have a timeline in mind yet" },
                { id: "1-3_months", label: "In 1-3 months", sub: "Not urgent, but I would like to start soon" },
                { id: "immediately", label: "Now", sub: "I would like to start immediately" }
              ].map((item) => {
                const active = formData.timeline === item.id;
                return (
                  <button key={item.id} onClick={() => handleSelect("timeline", item.id)} className={`w-full p-5 rounded-2xl border-2 text-left group transition-all duration-300 cursor-pointer ${active ? "border-red-700 bg-red-50/50" : "border-slate-100 bg-white hover:border-slate-200"}`}>
                    <p className={`text-lg font-bold ${active ? "text-red-800" : "text-slate-900"}`}>{item.label}</p>
                    <p className="text-sm text-slate-400 font-medium mt-1">{item.sub}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Financing */}
        {currentStepId === 'FINANCING' && (
          <div key="st_fin" className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Interested in financing?</h2>
            </div>
            <div className="grid gap-4">
              {[
                { id: "yes", label: "Yes", sub: "I am interested in financing" },
                { id: "no", label: "No", sub: "I am not interested in financing" },
                { id: "maybe", label: "Maybe", sub: "I would like to learn more about financing" }
              ].map((item) => {
                const active = formData.financing === item.id;
                return (
                  <button key={item.id} onClick={() => handleSelect("financing", item.id)} className={`w-full p-5 rounded-2xl border-2 text-left group transition-all duration-300 cursor-pointer ${active ? "border-red-700 bg-red-50/50" : "border-slate-100 bg-white hover:border-slate-200"}`}>
                    <p className={`text-lg font-bold ${active ? "text-red-800" : "text-slate-900"}`}>{item.label}</p>
                    <p className="text-sm text-slate-400 font-medium mt-1">{item.sub}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Notes */}
        {currentStepId === 'NOTES' && (
          <div key="st_notes" className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Additional Details</h2>
            </div>
            <textarea
              placeholder="Are there skylights? Solar panels? Chimneys? Tell us more..."
              className="w-full min-h-[160px] p-6 bg-slate-50 border-slate-100 focus:outline-none focus:ring-2 focus:ring-red-700/20 rounded-[2rem] text-[16px] font-bold text-slate-900 placeholder:text-slate-400 resize-none shadow-inner"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <button 
              onClick={nextStep} 
              className="w-full h-16 bg-[#0F172A] hover:bg-black text-white rounded-[1.5rem] font-black text-[15px] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* Step: Lead Capture */}
        {currentStepId === 'LEAD_CAPTURE' && (
          <div key="st_lead" className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-[#0F172A]">Where should we send your estimate?</h2>
              <p className="text-slate-500 font-semibold italic text-[14px]">You're just one step away from your instant quote.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Full Name</Label>
                <Input 
                  placeholder="John Doe" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 text-[16px] font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Work Email</Label>
                <Input 
                  placeholder="john@example.com" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 text-[16px] font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-black uppercase tracking-widest text-[#0F172A] ml-1">Phone Number</Label>
                <Input 
                  placeholder="(555) 000-0000" 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="h-14 bg-slate-50 border-slate-100 rounded-2xl px-6 text-[16px] font-bold"
                />
              </div>
            </div>

            <button 
              onClick={handleCalculateAndRedirect} 
              disabled={isSubmitting || !formData.email || !formData.firstName}
              className="w-full h-16 bg-red-700 hover:bg-black text-white rounded-[1.5rem] font-black text-[18px] transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Calculate My Estimate →"}
            </button>
          </div>
        )}

        {/* Step: Result (Demo Only) */}
        {currentStepId === 'RESULT' && (
          <div key="st_result" className="space-y-8 animate-in fade-in zoom-in duration-500 py-4 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-[36px] font-black text-[#0F172A] tracking-tighter">Success!</h2>
                <p className="text-slate-500 font-bold min-h-[48px]">We've generated your instant estimate for {formData.address.split(',')[0]}!</p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 lg:p-10 space-y-4 shadow-inner">
               <p className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-400">Estimated Project Cost</p>
               <div className="text-[48px] lg:text-[64px] font-black text-[#0F172A] tracking-tight leading-none">
                 ${estimatedPrice?.toLocaleString()}
               </div>
               <p className="text-[13px] text-slate-400 font-semibold px-4 italic leading-relaxed">
                 Price is a ballpark estimate based on current material rates and satellite measurements.
               </p>
            </div>

            <div className="w-full space-y-4">
                <button 
                    onClick={() => window.location.href = '/login?tab=signup'}
                    className="w-full h-16 bg-[#0F172A] hover:bg-black text-white rounded-[1.5rem] font-black text-[18px] transition-all shadow-xl shadow-slate-200"
                >
                    Get your own Free Widget →
                </button>
                <p className="text-[12px] text-slate-400 font-bold">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

