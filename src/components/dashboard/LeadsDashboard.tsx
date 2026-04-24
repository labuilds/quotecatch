"use client"

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { 
  Inbox, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  ChevronRight,
  Calendar,
  Trash2,
  X,
  Building,
  Zap,
  Maximize,
  Layers,
  FileText,
  CreditCard,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { UpgradeModal } from "@/components/UpgradeModal"
import { createDodoCheckoutSession } from "@/app/actions/billing"
import { createClient } from "@/utils/supabase/client"
import { useUserTier } from "@/components/UserTierProvider"
import { motion, AnimatePresence } from 'framer-motion'

interface LeadsDashboardProps {
  initialLeads: any[]
  initialIsPro: boolean
}

export default function LeadsDashboard({ initialLeads, initialIsPro }: LeadsDashboardProps) {
  const [leads, setLeads] = useState(initialLeads)
  const { isPro, trialDaysRemaining } = useUserTier()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<any>(null)

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

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead? This cannot be undone.")) return

    const supabase = createClient()
    const { error } = await supabase.from('leads').delete().eq('id', id)

    if (error) {
      alert("Failed to delete lead: " + error.message)
      return
    }

    setLeads(prev => prev.filter(l => l.id !== id))
  }

  const totalValue = leads?.reduce((sum, l) => sum + (l.estimated_price || 0), 0) ?? 0
  const thisWeek = leads?.filter(l => {
    if (!l.created_at) return false
    const d = new Date(l.created_at)
    if (isNaN(d.getTime())) return false
    const now = new Date()
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000
  }).length ?? 0

  const stats = [
    { label: "Total Leads", value: leads?.length ?? 0, icon: Users, color: "text-slate-900", bg: "bg-white" },
    { label: "Pipeline Value", value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "New This Week", value: thisWeek, icon: Clock, color: "text-red-700", bg: "bg-red-50" },
  ]

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[36px] font-semibold tracking-tighter text-[#0F172A] leading-tight">Leads Pipeline</h1>
          <p className="text-slate-600 font-medium text-[16px] mt-1 max-w-md">
            Manage your high-intent roofing prospects captured from your website.
          </p>
        </div>
      </div>

      {/* Stats row */}
      {leads && leads.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-hover hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[16px] font-bold text-slate-600 uppercase tracking-widest mb-1">{label}</p>
                  <p className={`text-[28px] font-semibold text-slate-900 tracking-tight`}>{value}</p>
                </div>
                <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center border border-slate-50 shadow-sm`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leads Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 px-2">
          <h2 className="text-[16px] font-bold text-slate-600 uppercase tracking-widest">Recent Activity</h2>
          <span className="text-[15px] font-medium text-slate-600">{leads?.length || 0} leads found</span>
        </div>

        {/* Empty state */}
        {!leads || leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-100 rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mb-6 relative">
              <Inbox className="w-9 h-9 text-slate-300" />
              <div className="absolute top-1 right-1 w-4 h-4 bg-red-600 rounded-full border-4 border-white" />
            </div>
            <h3 className="text-[22px] font-semibold text-[#0F172A]">Awaiting your first lead</h3>
            <p className="text-slate-600 font-medium mt-2 text-[16px] max-w-[360px] leading-relaxed">
              Once you embed your lead machine, homeowners will start appearing here in real-time.
            </p>
            <Link
              href="/calculators"
              className="mt-8 px-8 py-3 bg-[#0F172A] text-white font-semibold rounded-2xl text-[16px] hover:bg-black transition-all hover:scale-[1.02] cursor-pointer"
            >
              Build Machine →
            </Link>
          </div>
        ) : (
          /* Lead cards */
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            {leads.map((lead: any, idx: number) => {
              const date = new Date(lead.created_at)
              const isNew = (new Date().getTime() - date.getTime()) < 24 * 60 * 60 * 1000
              
              return (
                <div 
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={cn(
                    "group p-6 hover:bg-slate-50 transition-all duration-300 flex flex-col lg:flex-row lg:items-center gap-6 cursor-pointer active:bg-slate-100",
                    idx !== leads.length - 1 && "border-b border-slate-50"
                  )}
                >
                  <div className="flex items-center gap-5 lg:w-[30%]">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 font-bold text-[#0F172A] text-[18px] group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
                      {lead.homeowner_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-[17px] text-slate-900 truncate tracking-tight">{lead.homeowner_name || "New Prospect"}</p>
                        {isNew && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg shrink-0">New</span>
                        )}
                      </div>
                      <div className="flex items-center text-slate-600 gap-3">
                         <span className="text-[14px] font-medium flex items-center gap-1.5 shrink-0">
                           <Calendar className="w-4 h-4" />
                           {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                         </span>
                         <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                         <span className="text-[14px] font-medium truncate opacity-70">
                           {lead.calculators?.name || "Global Machine"}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex-1 gap-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 opacity-60" />
                      </div>
                      <p className="text-[16px] font-medium truncate">{lead.homeowner_email}</p>
                    </div>
                    {lead.homeowner_phone && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 opacity-60" />
                        </div>
                        <p className="text-[16px] font-medium">{lead.homeowner_phone}</p>
                      </div>
                    )}
                  </div>

                  {lead.address && (
                    <div className="hidden xl:flex items-center gap-3 text-slate-600 w-[20%]">
                      <MapPin className="w-4 h-4 shrink-0 opacity-60" />
                      <p className="text-[15px] font-medium truncate">{lead.address}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                    <div className="text-left lg:text-right min-w-[120px]">
                      <p className="text-[20px] font-semibold text-[#0F172A] tracking-tight">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lead.estimated_price || 0)}
                      </p>
                      <p className="text-[13px] text-slate-600 font-bold uppercase tracking-widest opacity-60">Est. Revenue</p>
                    </div>
                    <div className="flex items-center gap-4 pl-4 border-l border-slate-50 ml-4">
                       <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        trialDaysRemaining={trialDaysRemaining}
      />

      {/* Lead Detail Side Panel */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] z-[101] flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center font-bold text-white text-[18px]">
                    {selectedLead.homeowner_name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">{selectedLead.homeowner_name || "New Prospect"}</h2>
                    <p className="text-slate-600 font-bold text-[15px] uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Captured on {new Date(selectedLead.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Revenue Card */}
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-bold text-slate-600 uppercase tracking-widest">Estimated Value</p>
                    <p className="text-[32px] font-semibold text-[#0F172A] tracking-tighter">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(selectedLead.estimated_price || 0)}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>

                {/* Info Groups */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[16px] font-bold text-slate-600 uppercase tracking-widest px-1">Contact Information</h4>
                    <div className="grid gap-3">
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-slate-600 uppercase">Email</p>
                          <p className="text-[16px] font-medium text-slate-900">{selectedLead.homeowner_email}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                          <Phone className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-slate-600 uppercase">Phone</p>
                          <p className="text-[16px] font-medium text-slate-900">{selectedLead.homeowner_phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[16px] font-bold text-slate-600 uppercase tracking-widest px-1">Project Details</h4>
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-slate-600 uppercase">Property Address</p>
                          <p className="text-[15px] font-medium text-slate-900 leading-relaxed">{selectedLead.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-slate-600 uppercase">Lead Machine</p>
                          <p className="text-[15px] font-medium text-slate-900">{selectedLead.calculators?.name || "Global Machine"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {(selectedLead.form_data && Object.keys(selectedLead.form_data).length > 0 || selectedLead.notes) ? (
                    <div className="space-y-4">
                      <h4 className="text-[16px] font-bold text-slate-600 uppercase tracking-widest px-1">Captured Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedLead.form_data?.sqFt && (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Maximize className="w-3.5 h-3.5 text-slate-600" />
                              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Property Size</p>
                            </div>
                            <p className="text-[15px] font-medium text-slate-900">
                              {String(selectedLead.form_data.sqFt).includes('_') 
                                ? String(selectedLead.form_data.sqFt).replace('_', ' - ').replace('under', 'Under').replace('over', 'Over') + ' sq ft'
                                : parseInt(selectedLead.form_data.sqFt).toLocaleString() + ' sq ft'}
                            </p>
                          </div>
                        )}
                        {selectedLead.form_data?.buildingType && (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Building className="w-3.5 h-3.5 text-slate-600" />
                              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Building Type</p>
                            </div>
                            <p className="text-[15px] font-medium text-slate-900 capitalize">{selectedLead.form_data.buildingType}</p>
                          </div>
                        )}
                        {selectedLead.form_data?.material && (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Layers className="w-3.5 h-3.5 text-slate-600" />
                              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Existing Material</p>
                            </div>
                            <p className="text-[15px] font-medium text-slate-900 capitalize">{selectedLead.form_data.material}</p>
                          </div>
                        )}
                        {selectedLead.form_data?.desiredMaterial && (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Target className="w-3.5 h-3.5 text-slate-600" />
                              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Desired Material</p>
                            </div>
                            <p className="text-[15px] font-medium text-slate-900 capitalize">{selectedLead.form_data.desiredMaterial}</p>
                          </div>
                        )}
                        {selectedLead.form_data?.pitch && (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-3.5 h-3.5 text-slate-600" />
                              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Roof Pitch</p>
                            </div>
                            <p className="text-[15px] font-medium text-slate-900 capitalize">{selectedLead.form_data.pitch}</p>
                          </div>
                        )}
                        {selectedLead.form_data?.timeline && (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-3.5 h-3.5 text-slate-600" />
                              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Timeline</p>
                            </div>
                            <p className="text-[15px] font-medium text-slate-900 capitalize">{selectedLead.form_data.timeline.replace('-', ' to ')}</p>
                          </div>
                        )}
                        {selectedLead.form_data?.financing && (
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1">
                              <CreditCard className="w-3.5 h-3.5 text-slate-600" />
                              <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Financing</p>
                            </div>
                            <p className="text-[15px] font-medium text-slate-900 capitalize">{selectedLead.form_data.financing}</p>
                          </div>
                        )}
                      </div>

                      {selectedLead.notes && (
                        <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-amber-600" />
                            <p className="text-[16px] font-bold text-amber-600 uppercase tracking-widest">Additional Notes</p>
                          </div>
                          <p className="text-[15px] font-medium text-amber-900 leading-relaxed italic">
                            "{selectedLead.notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[15px] font-semibold text-slate-600 uppercase tracking-tight">No detailed info</p>
                        <p className="text-[15px] font-medium text-slate-600 leading-relaxed max-w-[200px]">
                          This lead was captured before the detailed insight update.
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Panel Actions */}
              <div className="p-8 border-t border-slate-50">
                <button 
                  onClick={() => {
                    handleDeleteLead(selectedLead.id)
                    setSelectedLead(null)
                  }}
                  className="w-full h-14 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" /> Delete Lead Record
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
