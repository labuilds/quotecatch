"use client"

import { useState } from 'react'
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
  Calendar
} from 'lucide-react'
import { UpgradeModal } from "@/components/UpgradeModal"
import { createDodoCheckoutSession } from "@/app/actions/billing"

interface LeadsDashboardProps {
  initialLeads: any[]
  initialIsPro: boolean
}

export default function LeadsDashboard({ initialLeads, initialIsPro }: LeadsDashboardProps) {
  const [leads] = useState(initialLeads)
  const [isPro] = useState(initialIsPro)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

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

  const totalValue = leads?.reduce((sum, l) => sum + (l.estimated_price || 0), 0) ?? 0
  const thisWeek = leads?.filter(l => {
    const d = new Date(l.created_at)
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
          <h1 className="text-[36px] font-black tracking-tighter text-[#0F172A] leading-tight">Leads Pipeline</h1>
          <p className="text-slate-500 font-medium text-[16px] mt-1 max-w-md">
            Manage your high-intent roofing prospects captured from your website.
          </p>
        </div>
        {!isPro && (
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center gap-2.5 px-6 py-3 bg-[#0F172A] text-white font-bold rounded-2xl text-[16px] shadow-[0_8px_20px_rgba(15,23,42,0.2)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.25)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
          >
            Upgrade to Pro <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Stats row */}
      {leads && leads.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-hover hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[14px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className={`text-[28px] font-black text-slate-900 tracking-tight`}>{value}</p>
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
          <h2 className="text-[16px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</h2>
          <span className="text-[15px] font-bold text-slate-400">{leads?.length || 0} leads found</span>
        </div>

        {/* Empty state */}
        {!leads || leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-100 rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] text-center px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mb-6 relative">
              <Inbox className="w-9 h-9 text-slate-300" />
              <div className="absolute top-1 right-1 w-4 h-4 bg-red-600 rounded-full border-4 border-white" />
            </div>
            <h3 className="text-[22px] font-black text-[#0F172A]">Awaiting your first lead</h3>
            <p className="text-slate-400 font-medium mt-2 text-[16px] max-w-[360px] leading-relaxed">
              Once you embed the estimator widget, homeowners will start appearing here in real-time.
            </p>
            <a
              href="/calculators"
              className="mt-8 px-8 py-3 bg-[#0F172A] text-white font-bold rounded-2xl text-[14px] hover:bg-black transition-all hover:scale-[1.02] cursor-pointer"
            >
              Configure Estimator →
            </a>
          </div>
        ) : (
          /* Lead cards */
          <div className="grid gap-4">
            {leads.map((lead: any) => {
              const date = new Date(lead.created_at)
              const isNew = (new Date().getTime() - date.getTime()) < 24 * 60 * 60 * 1000
              
              return (
                <div
                  key={lead.id}
                  className="group bg-white border border-slate-100 rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 flex flex-col lg:flex-row lg:items-center gap-6 cursor-pointer"
                >
                  <div className="flex items-center gap-4 lg:w-[30%]">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 font-black text-[#0F172A] text-[18px] group-hover:bg-[#0F172A] group-hover:text-white transition-colors duration-300">
                      {lead.homeowner_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-black text-[17px] text-slate-900 truncate tracking-tight">{lead.homeowner_name || "New Prospect"}</p>
                        {isNew && (
                          <span className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg shrink-0">Priority</span>
                        )}
                      </div>
                      <div className="flex items-center text-slate-400 gap-3">
                         <span className="text-[14px] font-bold flex items-center gap-1.5 shrink-0">
                           <Calendar className="w-4 h-4" />
                           {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                         </span>
                         <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                         <span className="text-[14px] font-bold truncate">
                           {lead.calculators?.name || "General Form"}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex-1 gap-4">
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <p className="text-[16px] font-bold truncate">{lead.homeowner_email}</p>
                    </div>
                    {lead.homeowner_phone && (
                      <div className="flex items-center gap-3 text-slate-500">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <p className="text-[16px] font-bold">{lead.homeowner_phone}</p>
                      </div>
                    )}
                  </div>

                  {lead.address && (
                    <div className="hidden xl:flex items-center gap-3 text-slate-400 w-[20%]">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <p className="text-[13px] font-medium truncate">{lead.address}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                    <div className="text-left lg:text-right min-w-[120px]">
                      <p className="text-[20px] font-black text-[#0F172A] tracking-tight">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lead.estimated_price || 0)}
                      </p>
                      <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest">Est. Revenue</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                         <ChevronRight className="w-5 h-5" />
                       </button>
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
      />
    </div>
  )
}
