"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, 
  Loader2, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck,
  ChevronRight,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPhoneNumber } from "@/utils/format"

export default function LeadCaptureModal({ 
  leadId, 
  companyName, 
  onSubmitSuccess 
}: { 
  leadId: string, 
  companyName: string,
  onSubmitSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
    agreeMarketing: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.agreeTerms) {
      setError("Please complete all required fields.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeowner_name: formData.name,
          homeowner_email: formData.email,
          homeowner_phone: formData.phone
        })
      })

      if (response.ok) {
        onSubmitSuccess()
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[540px] bg-white rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden"
      >
        <div className="p-8 sm:p-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-[32px] sm:text-[36px] font-black text-slate-900 tracking-tight leading-[1.1]">
              Where should we send your estimates?
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-slate-400 uppercase tracking-widest ml-1">Name*</Label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  <Input 
                    placeholder="Enter your full name" 
                    className="h-14 pl-14 pr-6 rounded-2xl border-slate-100 bg-slate-50/50 text-[16px] font-normal text-slate-900 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email*</Label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                    <Input 
                      placeholder="Enter your email" 
                      type="email"
                      className="h-14 pl-14 pr-6 rounded-2xl border-slate-100 bg-slate-50/50 text-[16px] font-normal text-slate-900 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone*</Label>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                    <Input 
                      placeholder="Enter phone number" 
                      type="tel"
                      className="h-14 pl-14 pr-6 rounded-2xl border-slate-100 bg-slate-50/50 text-[16px] font-normal text-slate-900 focus-visible:ring-slate-900/5 focus-visible:border-slate-900 transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input 
                    type="checkbox" 
                    className="peer hidden" 
                    checked={formData.agreeTerms}
                    onChange={e => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  />
                  <div className="w-6 h-6 rounded-lg border-2 border-slate-200 peer-checked:border-red-700 bg-white transition-all group-hover:border-slate-300 flex items-center justify-center">
                    {formData.agreeTerms && <CheckCircle className="w-4 h-4 text-red-700" />}
                  </div>
                </div>
                <p className="text-[16px] text-slate-500 font-medium leading-relaxed">
                  I agree to the <span className="text-slate-900 border-b border-slate-900/20 cursor-pointer">Terms of Service</span> and <span className="text-slate-900 border-b border-slate-900/20 cursor-pointer">Privacy Policy</span>.
                </p>
              </label>

              <label className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input 
                    type="checkbox" 
                    className="peer sr-only" 
                    required
                    checked={formData.agreeMarketing}
                    onChange={e => setFormData({ ...formData, agreeMarketing: e.target.checked })}
                  />
                  <div className="w-6 h-6 rounded-lg border-2 border-slate-200 peer-checked:border-red-700 bg-white transition-all group-hover:border-slate-300 flex items-center justify-center">
                    {formData.agreeMarketing && <CheckCircle className="w-4 h-4 text-red-700" />}
                  </div>
                </div>
                <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
                  To ensure you’re getting the best offers and pricing, <span className="text-slate-900 font-bold">{companyName}</span> may need to contact you by text/call. By checking this box, you agree to these communications, including marketing and promotional messages. Message and data rates may apply. You can reply STOP to opt-out of future messaging; reply HELP for messaging help. Message frequency may vary.
                </p>
              </label>
            </div>

            {error && <p className="text-red-600 text-sm font-bold text-center">{error}</p>}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-16 bg-[#0F172A] hover:bg-black text-white rounded-[1.25rem] font-black text-[18px] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Get my estimate <ChevronRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
