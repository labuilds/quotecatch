"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, 
  MapPin, 
  Zap, 
  ArrowLeft, 
  Home, 
  Search, 
  Loader2, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  Phone,
  Calendar,
  Share2,
  CheckCircle2
} from "lucide-react"
import LeadCaptureModal from "@/components/LeadCaptureModal"

export default function EstimatesClient({ 
  lead, 
  companyName,
  isDemo = false
}: { 
  lead: any, 
  companyName: string,
  isDemo?: boolean
}) {
  const [showResults, setShowResults] = useState(!!lead.homeowner_email)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const unformattedPrice = lead.estimated_price || 0
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(unformattedPrice)

  const monthlyPayment = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(unformattedPrice / 120)

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      
      {isDemo && (
        <div className="w-full bg-amber-50 border-b border-amber-100 py-3 px-6 text-center">
            <p className="text-[13px] font-bold text-amber-800">
                <span className="bg-amber-200 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider mr-2">Demo Mode</span>
                This is a sample estimate. To get real quotes for your project, <a href="/login?tab=signup" className="underline hover:text-amber-900">sign up for a free account</a>.
            </p>
        </div>
      )}

      {/* Background/Blurred Content */}
      <div className={`transition-all duration-1000 ${showResults ? "blur-0" : "blur-2xl pointer-events-none opacity-40 scale-105"}`}>
        {/* Simple Premium Header */}
        <header className="w-full h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <span className="font-black text-[20px] text-slate-900 tracking-tighter uppercase">{companyName}</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
             <p className="text-[14px] font-black text-slate-400 uppercase tracking-widest">Property Identification</p>
             <div className="w-px h-6 bg-slate-200" />
             <p className="text-[14px] font-black text-slate-900">{lead.address}</p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20 space-y-12">
          {/* Main Hero Result */}
          <section className="text-center space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[14px] font-black uppercase tracking-widest border border-emerald-100">
                <CheckCircle className="w-4 h-4" /> Estimate Ready
              </span>
              <h1 className="text-[64px] lg:text-[84px] font-black text-slate-900 tracking-tighter leading-none">
                {formattedPrice}
              </h1>
              <p className="text-[18px] lg:text-[22px] text-slate-500 font-bold max-w-2xl mx-auto">
                Based on your property details, your roofing replacement estimate ranges from {formattedPrice}.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
               <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center gap-2 min-w-[200px]">
                  <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Monthly Payment</p>
                  <p className="text-[28px] font-black text-red-700">{monthlyPayment}/mo</p>
               </div>
               <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center gap-2 min-w-[200px]">
                  <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Financing APR</p>
                  <p className="text-[28px] font-black text-slate-900">As low as 6.9%</p>
               </div>
            </div>
          </section>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-900 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-slate-200">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-[24px] font-black tracking-tight">Schedule Site Inspection</h3>
                  <p className="text-slate-400 font-medium">Have an expert visit your property to provide a final, guaranteed quote.</p>
               </div>
               <div className="flex gap-3">
                 <button className="flex-1 h-16 bg-white text-slate-900 rounded-2xl font-black text-[18px] hover:scale-[1.02] active:scale-95 transition-all">Book Inspection</button>
                 <button 
                   onClick={handleCopyLink}
                   className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                 >
                   {copied ? <CheckCircle2 className="w-6 h-6" /> : <Share2 className="w-6 h-6" />}
                 </button>
               </div>
            </div>

            <div className="p-8 bg-white rounded-[3rem] border border-slate-100 space-y-6 shadow-sm">
               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                  <Phone className="w-7 h-7 text-slate-900" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-[24px] font-black tracking-tight text-slate-900">Speak with a Specialist</h3>
                  <p className="text-slate-500 font-medium">Questions about materials or financing? We're here to help you choose the best roof.</p>
               </div>
               <button className="w-full h-16 bg-slate-100 text-slate-900 rounded-2xl font-black text-[18px] hover:bg-slate-200 transition-all">Call Now</button>
            </div>
          </div>
        </main>
      </div>

      {/* Modal - only shown when results are hidden */}
      <AnimatePresence>
        {!showResults && (
           <>
            {/* Backdrop for extra focus */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90]"
            />
            <LeadCaptureModal 
              leadId={lead.id} 
              companyName={companyName}
              onSubmitSuccess={() => setShowResults(true)}
            />
           </>
        )}
      </AnimatePresence>
    </div>
  )
}
