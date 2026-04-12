"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Crown, Check, Loader2, LogOut, User, CreditCard, Zap, Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UpgradeModal } from "@/components/UpgradeModal"
import { createDodoCheckoutSession } from "@/app/actions/billing"

interface SettingsClientProps {
  isPro: boolean
}

export function SettingsClient({ isPro }: SettingsClientProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleUpgrade = async () => {
    try {
      const { url } = await createDodoCheckoutSession()
      if (!url || url.startsWith("#")) {
        alert("Billing is not configured. Please add DODO_PAYMENTS_API_KEY and DODO_PRO_PRODUCT_ID to your environment variables.")
        return
      }
      window.location.href = url
    } catch (error) {
      console.error(error)
      alert("Failed to start checkout. Check your network or API keys.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-20">
      {/* Page header */}
      <div>
        <h1 className="text-[36px] font-black tracking-tighter text-[#0F172A] leading-tight">
          Account Settings
        </h1>
        <p className="text-slate-500 font-medium text-[16px] mt-1">
          Manage your roofing business profile and subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          <p className="text-[13px] font-black uppercase tracking-widest text-slate-400 mb-4 px-4">
            Categories
          </p>
          <button className="w-full text-left px-4 py-3 bg-[#0F172A] text-white font-bold rounded-2xl text-[16px] shadow-lg shadow-slate-200/50">
            Profile Settings
          </button>
          <button className="w-full text-left px-4 py-3 text-slate-500 font-bold rounded-2xl text-[16px] hover:bg-slate-50 transition-colors">
            Team Members
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Section */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <User className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-[18px] font-black text-[#0F172A]">Company Profile</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[15px] font-bold text-slate-600 ml-1">First Name</Label>
                <Input
                  placeholder="John"
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 px-5 text-[16px] font-bold text-slate-900 focus-visible:ring-red-700/20 focus-visible:border-red-700 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[15px] font-bold text-slate-600 ml-1">Last Name</Label>
                <Input
                  placeholder="Smith"
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 px-5 text-[16px] font-bold text-slate-900 focus-visible:ring-red-700/20 focus-visible:border-red-700 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-bold text-slate-600 ml-1">Company Name</Label>
              <Input
                placeholder="Apex Roofing Pros"
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 px-5 text-[16px] font-bold text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[15px] font-bold text-slate-600 ml-1">Business Website</Label>
              <Input
                placeholder="https://apexroofing.com"
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 px-5 text-[16px] font-bold text-slate-900"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className={`h-12 px-8 font-black rounded-2xl text-[16px] transition-all duration-300 ${
                  saved
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                    : "bg-[#0F172A] hover:bg-black text-white shadow-lg shadow-slate-200 hover:-translate-y-0.5"
                }`}
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                ) : saved ? (
                  <><Check className="w-4 h-4 mr-2" /> Settings Saved</>
                ) : (
                  "Save Information"
                )}
              </Button>
            </div>
          </section>

          {/* Billing Section */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <CreditCard className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-[18px] font-black text-[#0F172A]">Current Plan</h3>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 rounded-[24px] border border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[20px] font-black text-[#0F172A]">
                    {isPro ? "Pro Satellite" : "Basic Estimator"}
                  </p>
                  <span
                    className={`text-[12px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      isPro
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    Active
                  </span>
                </div>
                <p className="text-[15px] text-slate-400 font-bold">
                  {isPro
                    ? "Unlimited leads · Satellite data · No branding"
                    : "Unlimited leads · Manual Estimations Only"}
                </p>
              </div>
              {!isPro && (
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  className="h-11 px-6 bg-red-700 text-white font-black rounded-xl text-[14px] shadow-lg shadow-red-200 hover:bg-red-800 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Upgrade to Pro Satellite
                </Button>
              )}
            </div>

            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50" />
          </section>


          {/* CRM Webhooks (Pro-Gated) */}
          <section className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isPro ? "bg-red-50 border-red-100/50" : "bg-slate-50 border-slate-100"}`}>
                  {isPro ? (
                    <Zap className="w-5 h-5 text-red-700" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <h3 className="text-[18px] font-black text-[#0F172A]">CRM Webhooks</h3>
              </div>
              {!isPro && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="text-[12px] font-black uppercase tracking-widest bg-red-700 text-white px-3 py-1.5 rounded-full shadow-sm hover:bg-red-800 transition-colors cursor-pointer"
                >
                  Pro Feature
                </button>
              )}
            </div>

            <p className="text-[14px] text-slate-500 font-medium">
              Automatically push new leads to Zapier, Make, or your CRM of choice.
            </p>

            <div className={`space-y-4 ${!isPro ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[15px] font-bold text-slate-600 ml-1">Endpoint URL</Label>
                </div>
                <Input
                  disabled={!isPro}
                  placeholder="https://hooks.zapier.com/..."
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 px-5 text-[16px] font-bold text-slate-400 italic"
                />
              </div>
            </div>

            {!isPro && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full h-12 border-2 border-dashed border-red-200 rounded-2xl text-red-700 font-black text-[14px] hover:bg-red-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                Upgrade to Pro to unlock CRM Webhooks
              </button>
            )}
          </section>

          {/* Sign out */}
          <div className="flex justify-center pt-8">
            <Button
              variant="ghost"
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold rounded-2xl h-12 px-6 text-[16px] transition-all"
              onClick={async () => {
                await supabase.auth.signOut()
                router.push("/login")
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out of Account
            </Button>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
